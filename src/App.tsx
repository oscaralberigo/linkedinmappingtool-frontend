import React, { useState, useRef } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, Snackbar, Alert, Button } from '@mui/material';
import CompanyList from './components/CompanyList';
import { useCompanies } from './hooks/useCompanies';
import Sidebar from './components/Sidebar';
import { apiService } from './services/api';
import { LinkedInUrlFormatter } from './utils/linkedinUrlFormatter';
import { useSearch } from './hooks/useSearch';
import { Company } from './types/company';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const {
    loading,
    error,
    allCompanies,
  } = useCompanies();

  // Save Search Modal State
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [currentKeywords, setCurrentKeywords] = useState<string>('');

  const availableForManualSelection = allCompanies.filter(
    company => {
      const existingCompany = companyList.find(existing => existing.id === company.id);
      // Show if not in list, or if in list but added manually (so it can be deselected)
      return !existingCompany || existingCompany.added_manually;
    }
  );

  const clearCompanyList = () => {
    setCompanyList([]);
  };
  const {
    returnedCompanies,
    setReturnedCompanies,
    loading: returnedCompaniesLoading,
    error: returnedCompaniesError,
    searchCompanies,
  } = useSearch(companyList);

  // Ref to store the refresh function from Sidebar
  const refreshSavedSearchesRef = useRef<(() => void) | null>(null);

  // Open modal from Sidebar
  const handleSaveSearch = () => {
    setSaveModalOpen(true);
  };

  // Load saved search handler
  const handleLoadSavedSearch = async (searchId: number) => {
    try {
      clearCompanyList();
      const savedCompanies = await apiService.getSavedSearchById(searchId);
      // Convert to Company[] with added_manually: false
      console.log(savedCompanies);
      const loaded: Company[] = savedCompanies.companies.map((c) => ({ ...c, id: c.id, name: c.name, added_manually: false }));
      setCompanyList(loaded);
      setCurrentKeywords(savedCompanies.keywords || '');
      setSnackbar({ open: true, message: 'Saved search loaded successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load saved search', severity: 'error' });
    }
  };

  // Get Companies (was Generate Search)
  const handleSearchCompanies = async (filters: any, keywords?: string) => {
    const merged = await searchCompanies(filters);
    setCompanyList(merged); // This will update your right-hand list with the merged/filtered companies
    setCurrentKeywords(keywords || ''); // Store the keywords for LinkedIn search
  };

  const handleSearchLinkedin = () => {
    const companyIds = companyList.map(company => company.linkedin_id);
    LinkedInUrlFormatter.openLinkedInPeopleSearch({
      companyIds,
      keywords: currentKeywords
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
      
      const toAdd = allCompanies.find(c => c.id === companyId);
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
      await apiService.saveSearch({ search_name: searchName.trim(), keywords: currentKeywords, company_ids });
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

  const handleSaveModalClose = () => {
    setSaveModalOpen(false);
    setSearchName('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          onGetCompanies={handleSearchCompanies}
          onAddManuallySelectedCompany={handleAddManuallySelectedCompany}
          onRemoveManuallySelectedCompany={handleRemoveManuallySelectedCompany}
          onSaveSearch={handleSaveSearch}
          onLoadSavedSearch={handleLoadSavedSearch}
          onRefreshSavedSearches={(refreshFn) => {
            refreshSavedSearchesRef.current = refreshFn;
          }}
          loading={loading}
          companies={companyList}
          availableForManualSelection={availableForManualSelection}
          currentKeywords={currentKeywords}
        />
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
    </ThemeProvider>
  );
}

export default App; 