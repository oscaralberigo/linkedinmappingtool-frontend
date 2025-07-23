import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Paper
} from '@mui/material';
import { CompanyWithLinkedInId } from '../types/search';

interface CompanyListProps {
  companies: CompanyWithLinkedInId[];
  loading: boolean;
  error?: string;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  loading,
  error
}) => {
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
          No companies found. Try adjusting your search criteria.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="h6">
          Companies ({companies.length})
        </Typography>
      </Box>
      
      <List sx={{ p: 0 }}>
        {companies.map((company, index) => (
          <ListItem
            key={company.company_id || index}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'grey.100',
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <ListItemText
              primary={company.company_name}
              secondary={
                <Box sx={{ mt: 1 }}>
                  {company.linkedin_id && (
                    <Chip
                      label="LinkedIn ID"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                </Box>
              }
              secondaryTypographyProps={{
                component: 'div'
              }}
            />
            <ListItemSecondaryAction>
              {company.linkedin_id && (
                <Chip
                  label="LinkedIn ID"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CompanyList; 