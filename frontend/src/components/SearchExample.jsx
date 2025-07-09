import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import SearchBar from './SearchBar';

const SearchExample = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'React components',
    'JavaScript tutorials',
    'CSS animations'
  ]);

  // Handle search functionality
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    
    // Add to recent searches if it's a new search
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }

    // Mock search results
    if (query.trim()) {
      const mockResults = [
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`
      ];
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  // Handle clear search
  const handleClear = () => {
    setSearchResults([]);
    console.log('Search cleared');
  };

  // Handle recent search click
  const handleRecentSearchClick = (search) => {
    handleSearch(search);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: 'var(--color-text-primary)',
            fontWeight: 600,
            mb: 2
          }}
        >
          Search Component Demo
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          A responsive search bar component with MUI, Tailwind CSS, and smooth animations
        </Typography>
      </Box>

      {/* Search Bar Examples */}
      <Grid container spacing={4}>
        {/* Main Search */}
        <Grid size={{ xs: 12 }}>
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--color-surface)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-text-primary)' }}>
                Main Search Bar
              </Typography>
              <Box display="flex" justifyContent="center" mb={3}>
                <SearchBar
                  placeholder="Search anything..."
                  onSearch={handleSearch}
                  onClear={handleClear}
                  size="medium"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Full Width Search */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--color-surface)'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-text-primary)' }}>
                Full Width Search
              </Typography>
              <SearchBar
                placeholder="Full width search..."
                onSearch={handleSearch}
                onClear={handleClear}
                fullWidth
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Compact Search */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--color-surface)'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-text-primary)' }}>
                Compact Search
              </Typography>
              <SearchBar
                placeholder="Compact search..."
                onSearch={handleSearch}
                onClear={handleClear}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card 
              elevation={2}
              sx={{ 
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-text-primary)' }}>
                  Recent Searches
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {recentSearches.map((search, index) => (
                    <Chip
                      key={index}
                      label={search}
                      onClick={() => handleRecentSearchClick(search)}
                      variant="outlined"
                      sx={{
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          borderColor: 'var(--color-primary)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all var(--transition-normal)'
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card 
              elevation={2}
              sx={{ 
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-text-primary)' }}>
                  Search Results ({searchResults.length})
                </Typography>
                <Stack spacing={2}>
                  {searchResults.map((result, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-background)',
                        border: '1px solid var(--color-border)',
                        transition: 'all var(--transition-normal)',
                        '&:hover': {
                          boxShadow: 'var(--shadow-sm)',
                          transform: 'translateY(-1px)',
                          borderColor: 'var(--color-primary-light)'
                        }
                      }}
                    >
                      <Typography sx={{ color: 'var(--color-text-primary)' }}>
                        {result}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SearchExample;
