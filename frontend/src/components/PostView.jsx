import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  Box,
  Avatar,
  IconButton,
  Chip,
  Fade,
  Grow,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";

const PostView = () => {
  var { id } = useParams();
  var navigate = useNavigate();
  var [post, setPost] = useState();
  var [commEdit, setCommEdit] = useState(false);
  var [editingCommentId, setEditingCommentId] = useState(null);
  var [comment, setComment] = useState("");
  var [isLoading, setIsLoading] = useState(false);
  var [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  var user = JSON.parse(localStorage.getItem("user") || "{}");
  var token = localStorage.getItem("token");


  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`)
      .then((res) => {
        console.log("post data", res.data);
        setPost(res.data);
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, message: "Error loading post", severity: "error" });
      });
  }, [id]);

  var handleDeletePost = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setSnackbar({ open: true, message: "Post deleted successfully", severity: "success" });
        setTimeout(() => navigate("/"), 2000);
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, message: "Error deleting post", severity: "error" });
      });
  };

  var handlePostEdit = (postData) => {
    console.log(postData);
    navigate(`/create-post`, { state: postData });
  };

  var likehandler = () => {
    if (!token) {
      setSnackbar({ open: true, message: "Please login to like this post", severity: "warning" });
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setPost((prevPost) => ({
          ...prevPost,
          likes: res.data.likes,
          likedBy: res.data.likedBy,
        }));
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.error) {
          alert(err.response.data.error);
        } else if (err.response?.data) {
          alert(err.response.data);
        } else {
          alert("Error processing like");
        }
      });
  };

  var handleCommentEdit = (commentData) => {
    console.log(commentData);
    setComment(commentData.content);
    setCommEdit(true);
    setEditingCommentId(commentData._id);
  };


  var handleCommentSubmit = () => {
    if (!token) {
      alert("Please login to comment");
      return;
    }

    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setIsLoading(true);

    if (commEdit === false) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/posts/${id}/comments`,
          { content: comment },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((res) => {
          console.log(res);
          alert(res.data);
          setComment("");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert("Error adding comment");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/comments/${editingCommentId}`,
          { content: comment },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((res) => {
          console.log(res);
          alert(res.data);
          setComment("");
          setCommEdit(false);
          setEditingCommentId(null);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert("Error updating comment");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  var handleDeleteComment = (commentId) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("Error deleting comment");
      });
  };

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Loading post...
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6, px: 2, py: 3 }}>
      <Fade in timeout={600}>
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
          {/* Post Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary'
              }}
            >
              {post.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <PersonIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {post.author?.username || "Unknown"}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Post Content */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                fontSize: '1.1rem',
                color: 'text.primary'
              }}
            >
              {post.content}
            </Typography>
          </Box>
          {/* Post Actions */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
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
              Back to Home
            </Button>

            <Button
              variant={post.likedBy?.includes(user.id) ? "contained" : "outlined"}
              startIcon={
                post.likedBy?.includes(user.id) ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpOffAltIcon />
                )
              }
              onClick={likehandler}
              disabled={!token}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  ...(post.likedBy?.includes(user.id)
                    ? { boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)' }
                    : { backgroundColor: 'action.hover' }
                  )
                },
                '&:disabled': {
                  transform: 'none'
                }
              }}
            >
              {post.likedBy?.includes(user.id) ? "Liked" : "Like"} ({post.likes || 0})
            </Button>

            {(user.id === post.author?._id || user.role === "admin") && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this post?")
                  ) {
                    handleDeletePost();
                  }
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    backgroundColor: 'error.main',
                    color: 'white'
                  }
                }}
              >
                Delete
              </Button>
            )}

            {(user.role === "admin" || user.id === post.author?._id) && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => handlePostEdit(post)}
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
                Edit
              </Button>
            )}
          </Box>
        </Paper>
      </Fade>

      {/* Comments Section */}
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'background.paper',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <CommentIcon sx={{ color: 'primary.main' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              Comments ({post.comments?.length || 0})
            </Typography>
          </Box>

          {token && (
            <Box sx={{ mb: 4 }}>
              <TextField
                label={commEdit ? "Edit comment" : "Add a comment"}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                        <CommentIcon sx={{ color: 'text.secondary' }} />
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

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCommentSubmit}
                  disabled={isLoading}
                  startIcon={<SendIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
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
                  {commEdit ? 'Update' : 'Comment'}
                </Button>

                {commEdit && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setCommEdit(false);
                      setComment("");
                      setEditingCommentId(null);
                    }}
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
                )}
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 3 }} />

          {post.comments &&
            post.comments.map((comm, index) => (
              <Grow in timeout={600 + index * 100} key={comm._id}>
                <Card
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 28, height: 28 }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {comm.author?.username || "Unknown"}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.6,
                        color: 'text.primary'
                      }}
                    >
                      {comm.content}
                    </Typography>

                    {(user.id === comm.author?._id || user.role === "admin") && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteComment(comm._id)}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'error.main',
                              color: 'white'
                            }
                          }}
                        >
                          Delete
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleCommentEdit(comm)}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          Edit
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            ))}

          {(!post.comments || post.comments.length === 0) && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CommentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                No comments yet. Be the first to comment!
              </Typography>
            </Box>
          )}
        </Paper>
      </Fade>

      {/* Snackbar for notifications */}
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

export default PostView;
