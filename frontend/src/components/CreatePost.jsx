import React from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  styled,
  Box,
  InputAdornment,
  Fade,
  Grow,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TitleIcon from "@mui/icons-material/Title";
import ArticleIcon from "@mui/icons-material/Article";
import CreateIcon from "@mui/icons-material/Create";
import CancelIcon from "@mui/icons-material/Cancel";

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({ title: "", content: "", image: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [imagePreview, setImagePreview] = useState("");
  useEffect(() => {
    if (location.state !== null) {
      setData((prevData) => ({
        ...prevData,
        title: location.state.title,
        content: location.state.content,
        image: location.state.image,
      }));
    }
  }, [location.state]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({ open: true, message: "Please login first", severity: "warning" });
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);

  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: "Image size should not exceed 5MB", severity: "error" });
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setData({ ...data, image: reader.result });
        setImagePreview(reader.result);
      };
    }
  };

  const submitHandler = () => {
    if (!data.title.trim()) {
      setSnackbar({ open: true, message: "Please enter a post title", severity: "error" });
      return;
    }
    if (!data.content.trim()) {
      setSnackbar({ open: true, message: "Please enter post content", severity: "error" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({ open: true, message: "Please login first", severity: "error" });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setIsLoading(true);

    if (location.state !== null) {
      axios
        .put(`${import.meta.env.VITE_BACKEND_URL}/posts/${location.state._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setSnackbar({ open: true, message: "Post updated successfully!", severity: "success" });
          setTimeout(() => navigate("/"), 2000);
        })
        .catch((error) => {
          let errorMessage = "Error updating post";
          if (error.response?.status === 401) {
            errorMessage = "Not authorized. Please login again.";
          } else if (error.response?.status === 403) {
            errorMessage = "Not authorized to update this post";
          } else if (error.response?.status === 404) {
            errorMessage = "Post not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          setSnackbar({ open: true, message: errorMessage, severity: "error" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/posts`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setSnackbar({ open: true, message: "Post created successfully!", severity: "success" });
          setTimeout(() => navigate("/"), 2000);
        })
        .catch((error) => {
          let errorMessage = "Error creating post";
          if (error.response?.status === 401) {
            errorMessage = "Not authorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data?.message || "Invalid post data";
          } else if (error.response?.status === 413) {
            errorMessage = "Post content or image too large";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          setSnackbar({ open: true, message: errorMessage, severity: "error" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4, md: 6 }, mb: 4, px: { xs: 2, sm: 3 } }}>
      <Fade in timeout={600}>
        <Grow in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background: 'background.paper',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CreateIcon
                sx={{
                  fontSize: 48,
                  color: 'primary.main',
                  mb: 2,
                  filter: 'drop-shadow(0 2px 8px rgba(0, 122, 255, 0.3))'
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: 'text.primary'
                }}
              >
                {location.state ? 'Edit Post' : 'Create New Post'}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                {location.state ? 'Update your post content' : 'Share your thoughts with the community'}
              </Typography>
            </Box>
            <Box component="form" sx={{ mt: 2 }} role="form" aria-label="Create post form">
              <TextField
                id="title"
                label="Post Title"
                variant="outlined"
                name="title"
                value={data.title}
                onChange={inputHandler}
                fullWidth
                margin="normal"
                required
                aria-describedby="title-helper-text"
                placeholder="Enter an engaging title for your post..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                      }
                    }
                  }
                }}
              />

              <TextField
                id="content"
                label="Post Content"
                variant="outlined"
                name="content"
                value={data.content}
                onChange={inputHandler}
                fullWidth
                multiline
                rows={8}
                margin="normal"
                required
                aria-describedby="content-helper-text"
                placeholder="Write your post content here..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                        <ArticleIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                      }
                    }
                  }
                }}
              />
              <Box sx={{ mt: 3, mb: 3 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)'
                    }
                  }}
                >
                  Upload Image
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </Button>
              </Box>

              {imagePreview && (
                <Box
                  sx={{
                    mt: 2,
                    mb: 4,
                    textAlign: 'center',
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'grey.50'
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 2
                    }}
                  >
                    Image Preview:
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(0, 0, 0, 0.2)'
                          : 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        width: "auto",
                        height: "auto",
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        objectFit: "contain",
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
                            : "0 4px 16px rgba(0, 0, 0, 0.15)"
                      }}
                    />
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 4,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'stretch'
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitHandler}
                  disabled={isLoading}
                  sx={{
                    flex: { sm: 1 },
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)'
                    },
                    '&:disabled': {
                      transform: 'none'
                    }
                  }}
                >
                  {isLoading
                    ? (location.state ? 'Updating...' : 'Creating...')
                    : (location.state ? 'Update Post' : 'Create Post')
                  }
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/")}
                  startIcon={<CancelIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grow>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreatePost;
