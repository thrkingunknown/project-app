import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Box,
  Skeleton,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";

const Home = () => {
  var [posts, setPosts] = useState([]);
  var [loading, setLoading] = useState(true);
  var [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  var navigate = useNavigate();
  var user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/posts`)
      .then((res) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          console.error("Posts data is not an array:", res.data);
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  var handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  var handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({ open: true, message: "Please login first", severity: "warning" });
      return;
    }

    console.log("deleting post", id);
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setSnackbar({ open: true, message: "Post deleted successfully", severity: "success" });
        // Remove the deleted post from state instead of reloading
        setPosts(posts.filter(post => post._id !== id));
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, message: "Error deleting post", severity: "error" });
      });
  };

  var handleLike = (id) => {
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

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Popular Posts
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[...Array(5)].map((_, index) => (
            <Card
              key={index}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 2, display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }}>
                  <Skeleton variant="rectangular" width={24} height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width={20} height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width={24} height={24} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={16} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="text" width={80} height={16} />
                    <Skeleton variant="text" width={60} height={16} />
                    <Skeleton variant="text" width={50} height={16} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <>
          {Array.isArray(posts) && posts.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  No posts yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Be the first to share something!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/create-post')}
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Create Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Array.isArray(posts) &&
                posts.map((post) => (
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
                          {post.title}
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
                            {new Date(post.createdAt).toLocaleDateString()}
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
                          {post.content.substring(0, 150)}...
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
                          {user &&
                            user.id &&
                            (user.id === post.author?._id ||
                              user.role === "admin") && (
                              <Button
                                size="small"
                                startIcon={<DeleteIcon />}
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(post._id);
                                }}
                                sx={{
                                  color: 'error.main',
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  minWidth: 'auto',
                                  p: 0.5,
                                  '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'white'
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </>
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

export default Home;
