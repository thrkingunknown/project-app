import React, { useState } from 'react';
import { 
  TextField, 
  IconButton, 
  InputAdornment, 
  Box,
  useTheme,
  useMediaQuery,
  Collapse
} from '@mui/material';
import { Search, Clear, Close } from '@mui/icons-material';

const CompactSearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  expandable = false,
  size = "small"
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(!expandable);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchClick = () => {
    if (expandable && !isExpanded) {
      setIsExpanded(true);
      return;
    }
    
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleClearClick = () => {
    setSearchValue('');
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleClose = () => {
    if (expandable) {
      setIsExpanded(false);
      setSearchValue('');
      if (onClear) {
        onClear();
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (onSearch && searchValue.trim()) {
        onSearch(searchValue.trim());
      }
    }
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  if (expandable && !isExpanded) {
    return (
      <IconButton
        onClick={handleSearchClick}
        size={size}
        aria-label="Open search"
        sx={{
          color: 'var(--color-text-secondary)',
          transition: 'all var(--transition-fast)',
          '&:hover': {
            backgroundColor: 'rgba(0, 122, 255, 0.08)',
            color: 'var(--color-primary)',
            transform: 'scale(1.05)',
          }
        }}
      >
        <Search />
      </IconButton>
    );
  }

  return (
    <Collapse in={isExpanded} orientation="horizontal">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          transition: 'all var(--transition-normal)',
          '&:hover': {
            borderColor: 'var(--color-primary-light)',
            boxShadow: 'var(--shadow-sm)',
          },
          '&:focus-within': {
            borderColor: 'var(--color-primary)',
            boxShadow: 'var(--shadow-md)',
          },
          minWidth: isMobile ? '200px' : '250px',
          maxWidth: isMobile ? '280px' : '350px',
        }}
      >
        <TextField
          variant="standard"
          size={size}
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          autoFocus={expandable}
          slotProps={{
            input: {
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={handleSearchClick}
                    disabled={!searchValue.trim()}
                    size="small"
                    aria-label="Search"
                    sx={{
                      color: searchValue.trim()
                        ? 'var(--color-primary)'
                        : 'var(--color-text-secondary)',
                      transition: 'all var(--transition-fast)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 122, 255, 0.08)',
                        transform: 'scale(1.05)',
                      },
                      '&:disabled': {
                        color: 'var(--color-text-secondary)',
                      }
                    }}
                  >
                    <Search fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchValue && (
                    <IconButton
                      onClick={handleClearClick}
                      size="small"
                      aria-label="Clear search"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        transition: 'all var(--transition-fast)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 0, 0, 0.08)',
                          color: '#ff4444',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  )}
                  {expandable && (
                    <IconButton
                      onClick={handleClose}
                      size="small"
                      aria-label="Close search"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        transition: 'all var(--transition-fast)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
              sx: {
                padding: '8px 12px',
                '& input': {
                  color: 'var(--color-text-primary)',
                  fontSize: isMobile ? '14px' : '15px',
                  padding: 0,
                },
                '& input::placeholder': {
                  color: 'var(--color-text-secondary)',
                  opacity: 0.7,
                }
              }
            }
          }}
        />
      </Box>
    </Collapse>
  );
};

export default CompactSearchBar;
