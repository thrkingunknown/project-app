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
  var navigate = useNavigate();
  var location = useLocation();
  var [data, setData] = useState({ title: "", content: "", image: "" });
  var [isLoading, setIsLoading] = useState(false);
  var [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
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
      alert("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  var inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  var submitHandler = () => {
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
        .then((res) => {
          console.log(res);
          setSnackbar({ open: true, message: "Post updated successfully!", severity: "success" });
          setTimeout(() => navigate("/"), 2000);
        })
        .catch((err) => {
          console.log(err);
          setSnackbar({ open: true, message: "Error updating post", severity: "error" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.log("creating post", data);
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/posts`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Post created successfully:", response.data);
          setSnackbar({ open: true, message: "Post created successfully!", severity: "success" });
          setTimeout(() => navigate("/"), 2000);
        })
        .catch((error) => {
          console.error("Error creating post:", error);
          setSnackbar({ open: true, message: "Error creating post", severity: "error" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
      <Fade in timeout={600}>
        <Grow in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background: 'background.paper',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
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
              <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
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
                    onChange={(event) => console.log(event.target.files)}
                    accept="image/*"
                  />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitHandler}
                  disabled={isLoading}
                  sx={{
                    flex: 1,
                    minWidth: 200,
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
