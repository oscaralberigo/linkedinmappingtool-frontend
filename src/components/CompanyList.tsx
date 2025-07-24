import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Paper
} from '@mui/material';
import { LinkedIn as LinkedInIcon } from '@mui/icons-material';
import { Company } from '../types/company';
import { Button } from './ui';

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  error?: string;
  onSearchLinkedIn?: () => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  loading,
  error,
  onSearchLinkedIn
}) => {
  const handleLinkedInClick = (linkedinPage: string) => {
    if (linkedinPage) {
      window.open(linkedinPage, '_blank');
    }
  };
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (companies.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <Typography color="text.secondary">
          No companies found. Try another search.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Button
          variant="linkedin"
          disabled={loading || companies.length === 0}
          fullWidth
          onClick={onSearchLinkedIn}
          startIcon={<LinkedInIcon />}
          sx={{
            '& .MuiButton-startIcon': {
              marginRight: '8px',
            },
          }}
        >
          Search LinkedIn
        </Button>
      </Box>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="h6">
          Companies ({companies.length})
        </Typography>
      </Box>
      
      <List sx={{ p: 0 }}>
        {companies.map((company, index) => (
          <ListItem
            key={company.id || index}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'grey.100',
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <ListItemText
              primary={company.name}
              secondaryTypographyProps={{
                component: 'div'
              }}
            />
            <ListItemSecondaryAction>
              {company.linkedin_page && (
                <IconButton
                  onClick={() => handleLinkedInClick(company.linkedin_page!)}
                  sx={{
                    color: '#0077b5', // LinkedIn blue color
                    '&:hover': {
                      backgroundColor: 'rgba(0, 119, 181, 0.1)',
                    },
                  }}
                  title="View on LinkedIn"
                >
                  <LinkedInIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CompanyList; 