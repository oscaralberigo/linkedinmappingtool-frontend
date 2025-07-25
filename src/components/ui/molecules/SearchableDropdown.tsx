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

interface DropdownItem {
  id: string | number;
  label: string;
  [key: string]: any; // Allow additional properties
}

interface GenericSearchableDropdownProps {
  title: string;
  items: DropdownItem[];
  onSelect: (itemId: string | number) => void;
  placeholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  getItemLabel?: (item: DropdownItem) => string;
  getItemId?: (item: DropdownItem) => string | number;
}

const GenericSearchableDropdown: React.FC<GenericSearchableDropdownProps> = ({
  title,
  items,
  onSelect,
  placeholder = 'Search...',
  loading = false,
  emptyMessage = 'No items found',
  loadingMessage = 'Loading...',
  getItemLabel = (item) => item.label,
  getItemId = (item) => item.id
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

  const filteredItems = items.filter(item =>
    getItemLabel(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item: DropdownItem) => {
    onSelect(getItemId(item));
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
                <ListItemText primary={loadingMessage} />
              </ListItem>
            ) : filteredItems.length === 0 ? (
              <ListItem key="no-items">
                <ListItemText primary={emptyMessage} />
              </ListItem>
            ) : (
              filteredItems.map((item) => (
                <ListItem
                  key={getItemId(item)}
                  onClick={() => handleItemClick(item)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  <ListItemText 
                    primary={getItemLabel(item)}
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

export default GenericSearchableDropdown; 