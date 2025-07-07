import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Skeleton,
  Chip,
  IconButton,
  Fade,
  Grow,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Home = () => {
  var [posts, setPosts] = useState([]);
  var [loading, setLoading] = useState(true);
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
    var token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    console.log("deleting post", id);
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("Error deleting post");
      });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #007AFF 0%, #0A84FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Welcome To FAXRN
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              mb: 1
            }}
          >
            Discover and share amazing content with our community
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Chip
              label="Latest Posts"
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 2
              }}
            />
          </Box>
        </Box>
      </Fade>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Grow in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: 400,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={16} sx={{ mb: 3 }} />
                    <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 1 }} />
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Skeleton variant="text" width={60} height={20} />
                      <Skeleton variant="text" width={60} height={20} />
                    </Box>
                    <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {Array.isArray(posts) && posts.length === 0 ? (
            <Fade in timeout={600}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 2, fontWeight: 500 }}
                >
                  No posts available yet
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Be the first to create and share amazing content!
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/create-post')}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Create First Post
                </Button>
              </Box>
            </Fade>
          ) : (
            <Grid container spacing={3}>
              {Array.isArray(posts) &&
                posts.map((post, index) => (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 4 }}
                    key={post._id}
                  >
                    <Grow in timeout={300 + index * 100}>
                      <Card
                        sx={{
                          height: "100%",
                          width: "100%",
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
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            p: 3,
                            '&:last-child': { pb: 3 }
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                              fontWeight: 700,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              minHeight: "3.2em",
                              fontSize: { xs: "1.1rem", sm: "1.25rem" },
                              color: 'text.primary',
                              mb: 2,
                              lineHeight: 1.3
                            }}
                          >
                            {post.title}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                              >
                                {post.author?.username || "Unknown"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(post.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              flexGrow: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                              mb: 3,
                              lineHeight: 1.6,
                              color: 'text.secondary'
                            }}
                          >
                            {post.content.substring(0, 200)}...
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CommentIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {post.comments?.length || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ThumbUpOffAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {post.likes || 0}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePostClick(post._id);
                              }}
                              size="small"
                              startIcon={<VisibilityIcon />}
                              sx={{
                                flex: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1
                              }}
                            >
                              Read More
                            </Button>
                            {user &&
                              user.id &&
                              (user.id === post.author?._id ||
                                user.role === "admin") && (
                                <IconButton
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(post._id);
                                  }}
                                  size="small"
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                      transform: 'scale(1.1)',
                                      backgroundColor: 'error.main',
                                      color: 'white',
                                      borderRadius: '50%'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
