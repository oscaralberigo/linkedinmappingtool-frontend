import React, { useState, useRef } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, Snackbar, Alert } from '@mui/material';
import CompanyList from './components/CompanyList';
import { useSearch } from './hooks/useSearch';
import Sidebar from './components/Sidebar';
import { apiService } from './services/api';

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
    companies, 
    manuallyAddedCompanies,
    loading, 
    error, 
    searchCompanies, 
    addManuallySelectedCompanies,
    setCompanies,
    getCombinedResults 
  } = useSearch();

  // Save Search Modal State
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // Ref to store the refresh function from Sidebar
  const refreshSavedSearchesRef = useRef<(() => void) | null>(null);

  // Get combined results for display
  const combinedCompanies = getCombinedResults();

  // Open modal from Sidebar
  const handleSaveSearch = () => {
    setSaveModalOpen(true);
  };

  // Load saved search handler
  const handleLoadSavedSearch = async (searchId: number) => {
    try {
      console.log('Loading saved search with ID:', searchId);
      const savedCompanies = await apiService.getSavedSearchById(searchId);
      console.log('Loaded companies:', savedCompanies);
      setCompanies(savedCompanies);
      setSnackbar({ open: true, message: 'Saved search loaded successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error loading saved search:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setSnackbar({ open: true, message: `Failed to load saved search: ${errorMessage}`, severity: 'error' });
    }
  };

  // Save search handler
  const handleSaveSearchConfirm = async () => {
    if (!searchName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a search name.', severity: 'error' });
      return;
    }
    if (!combinedCompanies || combinedCompanies.length === 0) {
      setSnackbar({ open: true, message: 'No companies to save. Please run a search first.', severity: 'error' });
      return;
    }
    setSaveLoading(true);
    try {
      const company_ids = combinedCompanies.map(c => c.company_id);
      await apiService.saveSearch({ search_name: searchName.trim(), company_ids });
      setSnackbar({ open: true, message: 'Search saved successfully!', severity: 'success' });
      setSaveModalOpen(false);
      setSearchName('');
      // Refresh the saved searches list
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
          onSearch={searchCompanies}
          onAddManuallySelectedCompanies={addManuallySelectedCompanies}
          onSaveSearch={handleSaveSearch}
          onLoadSavedSearch={handleLoadSavedSearch}
          onRefreshSavedSearches={(refreshFn) => {
            refreshSavedSearchesRef.current = refreshFn;
          }}
          loading={loading}
          searchResults={companies}
        />
        <Box sx={{ flex: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          {/* <Box sx={{ mb: 2 }}>
            <LoginButton />
          </Box> */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Filter company universe
          </Typography>
          <CompanyList
            companies={combinedCompanies}
            loading={loading}
            error={error || undefined}
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
      {/* Snackbar for feedback */}
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