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
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
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

  const handleLike = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({ open: true, message: "Please login to like this post", severity: "warning" });
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setPosts(posts.map(post =>
          post._id === id
            ? { ...post, likes: res.data.likes, likedBy: res.data.likedBy }
            : post
        ));
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, message: "Error liking post", severity: "error" });
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };



  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1
          }}
        >
          Search Results
        </Typography>
        {query && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.secondary">
              Results for:
            </Typography>
            <Chip
              label={`"${query}"`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500 }}
            />
            {!loading && (
              <Typography variant="body2" color="text.secondary">
                ({posts.length} {posts.length === 1 ? "result" : "results"} found)
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {!query.trim() && !loading && (
        <Card sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
          <CardContent>
            <SearchIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Enter a search term to find posts
            </Typography>
          </CardContent>
        </Card>
      )}

      {query.trim() && !loading && posts.length === 0 && !error && (
        <Card sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
          <CardContent>
            <SearchIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No posts found for "{query}"
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try different keywords or check your spelling
            </Typography>
          </CardContent>
        </Card>
      )}

      {!loading && posts.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {posts.map((post) => (
            <Card
              key={post._id}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: "background.paper",
                cursor: 'pointer',
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: 'text.secondary',
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => handlePostClick(post._id)}
            >
              <CardContent sx={{ p: 2, display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 40,
                    py: 1
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      p: 0.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 69, 0, 0.1)',
                        color: 'orange'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post._id);
                    }}
                  >
                    <ThumbUpOffAltIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      my: 0.5
                    }}
                  >
                    {post.likes || 0}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'text.primary',
                      mb: 1,
                      lineHeight: 1.3,
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {highlightText(post.title, query)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Posted by {post.author?.username || "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      mb: 2,
                      lineHeight: 1.4,
                      color: 'text.secondary'
                    }}
                  >
                    {highlightText(post.content, query)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      size="small"
                      startIcon={<CommentIcon />}
                      sx={{
                        color: 'text.secondary',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        minWidth: 'auto',
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {post.comments?.length || 0} Comments
                    </Button>
                  </Box>
                </Box>
              </CardContent>

            </Card>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SearchResults;
