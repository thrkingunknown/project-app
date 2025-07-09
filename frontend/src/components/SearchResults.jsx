import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { highlightText } from "../utils/regexUtils.jsx";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Fade,
  Grow,
  Alert,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query.trim()) {
      searchPosts(query);
    } else {
      setPosts([]);
      setError("");
    }
  }, [query]);

  const searchPosts = async (searchQuery) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/search?q=${encodeURIComponent(searchQuery)}`
      );
      setPosts(response.data);
    } catch (err) {
      console.error("Error searching posts:", err);
      setError("Failed to search posts. Please try again.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };



  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={300}>
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SearchIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Search Results
            </Typography>
          </Box>
          
          {query && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body1" color="text.secondary">
                Results for:
              </Typography>
              <Chip 
                label={`"${query}"`} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
              {!loading && (
                <Typography variant="body2" color="text.secondary">
                  ({posts.length} {posts.length === 1 ? 'result' : 'results'} found)
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Fade>

      {loading && (
        <Fade in timeout={300}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        </Fade>
      )}

      {error && (
        <Fade in timeout={300}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {!query.trim() && !loading && (
        <Fade in timeout={300}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Enter a search term to find posts
            </Typography>
          </Box>
        </Fade>
      )}

      {query.trim() && !loading && posts.length === 0 && !error && (
        <Fade in timeout={300}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No posts found for "{query}"
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try different keywords or check your spelling
            </Typography>
          </Box>
        </Fade>
      )}

      {!loading && posts.length > 0 && (
        <Grid container spacing={3}>
          {posts.map((post, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post._id}>
              <Grow in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    cursor: 'pointer',
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => handlePostClick(post._id)}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: "text.primary",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {highlightText(post.title, query)}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {highlightText(post.content, query)}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.author?.username || 'Unknown'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15)'
                        }
                      }}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResults;
