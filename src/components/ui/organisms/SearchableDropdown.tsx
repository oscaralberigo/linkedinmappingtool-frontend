import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Paper
} from '@mui/material';
import { TextField } from '../atoms';
import { FilterHeader } from '../molecules';

interface SearchableDropdownProps {
  title: string;
  items: Array<{ id: string | number; name: string }>;
  selectedItems: Array<string | number>;
  onSelectionChange: (selectedIds: Array<string | number>) => void;
  placeholder?: string;
  loading?: boolean;
  availableCount?: number; // Optional prop to show available count instead of selected count
  showSelectedOutOfAvailable?: boolean; // New prop to show "selected/available" format
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  title,
  items,
  selectedItems,
  onSelectionChange,
  placeholder = 'Search...',
  loading = false,
  availableCount,
  showSelectedOutOfAvailable = false
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
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (itemId: string | number) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onSelectionChange(newSelection);
  };

  // Determine what count to display
  let displayCount: number | string;
  if (showSelectedOutOfAvailable && availableCount !== undefined) {
    displayCount = `${selectedItems.length}/${availableCount}`;
  } else if (availableCount !== undefined) {
    displayCount = availableCount;
  } else {
    displayCount = selectedItems.length;
  }

  return (
    <Box ref={dropdownRef} sx={{ position: 'relative' }}>
      <FilterHeader
        title={title}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        selectedCount={displayCount}
      />
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
            ) : filteredItems.length === 0 ? (
              <ListItem key="no-items">
                <ListItemText primary="No items found" />
              </ListItem>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <ListItem
                    key={`${item.id}-${index}`}
                    onClick={() => handleItemClick(item.id)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'primary.light' : 'transparent',
                      '&:hover': {
                        backgroundColor: isSelected ? 'primary.light' : 'grey.100',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={item.name}
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItem>
                );
              })
            )}
          </List>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default SearchableDropdown; 