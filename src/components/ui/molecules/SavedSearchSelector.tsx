import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Paper,
  Typography
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { TextField } from '../atoms';

interface SavedSearch {
  id: number;
  search_name: string;
}

interface SavedSearchSelectorProps {
  title: string;
  savedSearches: SavedSearch[];
  onSelect: (searchId: number) => void;
  placeholder?: string;
  loading?: boolean;
}

const SavedSearchSelector: React.FC<SavedSearchSelectorProps> = ({
  title,
  savedSearches,
  onSelect,
  placeholder = 'Search saved searches...',
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSearches = savedSearches.filter(search =>
    search.search_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = (searchId: number) => {
    onSelect(searchId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <Box ref={dropdownRef} sx={{ position: 'relative' }}>
      {/* Header */}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          cursor: 'pointer',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          '&:hover': {
            backgroundColor: 'grey.50',
          },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      {/* Dropdown Content */}
      <Collapse in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 1 }}
            />
          </Box>
          
          <List sx={{ maxHeight: 250, overflow: 'auto' }}>
            {loading ? (
              <ListItem key="loading">
                <ListItemText primary="Loading..." />
              </ListItem>
            ) : filteredSearches.length === 0 ? (
              <ListItem key="no-searches">
                <ListItemText primary="No saved searches found" />
              </ListItem>
            ) : (
              filteredSearches.map((search) => (
                <ListItem
                  key={search.id}
                  onClick={() => handleSearchClick(search.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  <ListItemText 
                    primary={search.search_name}
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default SavedSearchSelector; 