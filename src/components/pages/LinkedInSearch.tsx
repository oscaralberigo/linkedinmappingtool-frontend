import React, { useState, useRef } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, Snackbar, Alert, Typography } from '@mui/material';
import CompanyList from '../ui/sections/CompanyList';
import { useCompanies } from '../../hooks/useCompanies';
import LoadSavedSearch from '../ui/sections/LoadSavedSearch';
import CreateNewSearch from '../ui/sections/CreateNewSearch';
import { apiService } from '../../services/api';
import { LinkedInUrlFormatter } from '../../utils/linkedInUrlFormatter';
import { useSearch } from '../../hooks/useSearch';
import { Company } from '../../types/company';

const LinkedInSearch: React.FC = () => {
  const {
    loading,
    error,
    allCompanies,
  } = useCompanies();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [keywords, setKeywords] = useState<string>('');
  const { searchCompanies } = useSearch(companyList);

  // Filter companies that are available for manual selection
  const companiesAvailableForManualSelection = allCompanies.filter(
    (company: Company) => {
      const existingCompany = companyList.find(existing => existing.id === company.id);
      // Show if not in list, or if in list but added manually (so it can be deselected)
      return !existingCompany || existingCompany.added_manually;
    }
  );

  // Ref to store the refresh function from LoadSavedSearch
  const refreshSavedSearchesRef = useRef<(() => void) | null>(null);

  // Open modal from CreateNewSearch
  const handleSaveSearch = () => {
    setSaveModalOpen(true);
  };

  const handleSaveModalClose = () => {
    setSaveModalOpen(false);
    setSearchName('');
  };

  // Load saved search handler
  const handleLoadSavedSearch = async (searchId: number) => {
    try {
      setCompanyList([]);
      const savedCompanies = await apiService.getSavedSearchById(searchId);
      // Convert to Company[] with added_manually: false
      const loaded: Company[] = savedCompanies.companies.map((c: any) => ({ ...c, id: c.id, name: c.name, added_manually: false }));
      setCompanyList(loaded);
      setKeywords(savedCompanies.keywords || '');
      setSnackbar({ open: true, message: 'Saved search loaded successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load saved search', severity: 'error' });
    }
  };

  // Save search handler
  const handleSaveSearchConfirm = async () => {
    if (!searchName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a search name.', severity: 'error' });
      return;
    }
    if (!companyList || companyList.length === 0) {
      setSnackbar({ open: true, message: 'No companies to save. Please run a search first.', severity: 'error' });
      return;
    }
    setSaveLoading(true);
    try {
      const company_ids = companyList.map(c => parseInt(c.id));
      await apiService.saveSearch({ search_name: searchName.trim(), keywords: keywords, company_ids });
      setSnackbar({ open: true, message: 'Search saved successfully!', severity: 'success' });
      setSaveModalOpen(false);
      setSearchName('');
      if (refreshSavedSearchesRef.current) {
        refreshSavedSearchesRef.current();
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save search. Please try again.', severity: 'error' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSearchCompanies = async (filters: any) => {
    const merged = await searchCompanies(filters);
    setCompanyList(merged);
  };

  const handleSearchLinkedin = () => {
    const companyIds = companyList.map(company => company.linkedin_id);
    LinkedInUrlFormatter.openLinkedInPeopleSearch({
      companyIds,
      keywords: keywords
    });
  };

  // Add companies manually
  const handleAddManuallySelectedCompany = (companyId: string | number) => {
    setCompanyList(prev => {
      const alreadyInList = new Set(prev.map(c => c.id));
      const companyIdStr = companyId.toString();
      
      if (alreadyInList.has(companyIdStr)) {
        return prev;
      }
      
      const toAdd = allCompanies.find((c: Company) => c.id === companyId);
      if (!toAdd) {
        return prev;
      }
      
      return [...prev, { ...toAdd, added_manually: true }];
    });
  };

  // Remove companies manually
  const handleRemoveManuallySelectedCompany = (companyId: string | number) => {
    setCompanyList(prev => prev.filter(c => c.id !== companyId));
  };

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Left Panel - Search Controls */}
        <Box
          sx={{
            width: '50%',
            backgroundColor: 'white',
            borderRight: '1px solid',
            borderColor: 'grey.200',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          {/* Logo */}
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <img 
              src="/ls-logo-black.png" 
              alt="Logan Sinclair" 
              style={{ 
                maxWidth: '200px', 
                height: 'auto',
                display: 'block'
              }} 
            />
          </Box>

          {/* Load Saved Search */}
          <LoadSavedSearch
            onLoadSearch={handleLoadSavedSearch}
            onRefreshSavedSearches={(refreshFn: () => void) => {
              refreshSavedSearchesRef.current = refreshFn;
            }}
          />

          {/* OR Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Box sx={{ flex: 1, borderBottom: '2px solid', borderColor: 'grey.300' }} />
            <Typography variant="body1" color="text.secondary" sx={{ mx: 2, fontWeight: 700 }}>
              OR
            </Typography>
            <Box sx={{ flex: 1, borderBottom: '2px solid', borderColor: 'grey.300' }} />
          </Box>

          {/* Create New Search */}
          <CreateNewSearch
            keywords={keywords}
            onKeywordsChange={setKeywords}
            searchCompanies={handleSearchCompanies}
            onSaveSearch={handleSaveSearch}
            loading={loading}
            companies={companyList}
            availableForManualSelection={companiesAvailableForManualSelection}
            onAddManuallySelectedCompany={handleAddManuallySelectedCompany}
            onRemoveManuallySelectedCompany={handleRemoveManuallySelectedCompany}
          />
        </Box>

        {/* Right Panel - Company List */}
        <Box sx={{ flex: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          <CompanyList
            companies={companyList}
            loading={loading}
            error={error || undefined}
            onSearchLinkedIn={handleSearchLinkedin}
          />
        </Box>
      </Box>

      {/* Save Search Modal */}
      <Dialog open={saveModalOpen} onClose={handleSaveModalClose} maxWidth="xs" fullWidth>
        <DialogTitle>Save Search</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Name"
            type="text"
            fullWidth
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            disabled={saveLoading}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleSaveModalClose} disabled={saveLoading}>Cancel</MuiButton>
          <MuiButton onClick={handleSaveSearchConfirm} variant="contained" color="primary" disabled={saveLoading}>
            {saveLoading ? 'Saving...' : 'Save'}
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LinkedInSearch; 