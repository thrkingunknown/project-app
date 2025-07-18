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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import ReactMarkdown from "react-markdown";

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState();
  const [commEdit, setCommEdit] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // Helper function to show snackbar messages
  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };


  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((error) => {
        let errorMessage = "Error loading post";
        if (error.response?.status === 404) {
          errorMessage = "Post not found";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error loading post";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      });
  }, [id]);

  const handleDeletePost = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSnackbar({ open: true, message: "Post deleted successfully", severity: "success" });
        setTimeout(() => navigate("/"), 2000);
      })
      .catch((error) => {
        let errorMessage = "Error deleting post";
        if (error.response?.status === 401) {
          errorMessage = "Not authorized. Please login again.";
        } else if (error.response?.status === 403) {
          errorMessage = "Not authorized to delete this post";
        } else if (error.response?.status === 404) {
          errorMessage = "Post not found";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      });
  };

  const handlePostEdit = (postData) => {
    navigate(`/create-post`, { state: postData });
  };

  const likehandler = () => {
    if (!token) {
      setSnackbar({ open: true, message: "Please login to like this post", severity: "warning" });
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPost((prevPost) => ({
          ...prevPost,
          likes: res.data.likes,
          likedBy: res.data.likedBy,
        }));
      })
      .catch((error) => {
        let errorMessage = "Error processing like";
        if (error.response?.status === 401) {
          errorMessage = "Please login to like posts";
        } else if (error.response?.status === 404) {
          errorMessage = "Post not found";
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        showSnackbar(errorMessage);
      });
  };

  const handleCommentEdit = (commentData) => {
    setComment(commentData.content);
    setCommEdit(true);
    setEditingCommentId(commentData._id);
  };


  const handleCommentSubmit = () => {
    if (!token) {
      showSnackbar("Please login to comment");
      return;
    }

    if (!comment.trim()) {
      showSnackbar("Please enter a comment");
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
          showSnackbar(res.data, "success");
          setComment("");
          window.location.reload();
        })
        .catch((error) => {
          let errorMessage = "Error adding comment";
          if (error.response?.status === 401) {
            errorMessage = "Please login to comment";
          } else if (error.response?.status === 400) {
            errorMessage = "Invalid comment content";
          } else if (error.response?.status === 404) {
            errorMessage = "Post not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          showSnackbar(errorMessage);
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
          showSnackbar(res.data, "success");
          setComment("");
          setCommEdit(false);
          setEditingCommentId(null);
          window.location.reload();
        })
        .catch((error) => {
          let errorMessage = "Error updating comment";
          if (error.response?.status === 401) {
            errorMessage = "Not authorized to update comment";
          } else if (error.response?.status === 403) {
            errorMessage = "Not authorized to update this comment";
          } else if (error.response?.status === 404) {
            errorMessage = "Comment not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          showSnackbar(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const handleDeleteComment = (commentId) => {
    if (!token) {
      setSnackbar({ open: true, message: "Please login first", severity: "warning" });
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSnackbar({ open: true, message: "Comment deleted successfully", severity: "success" });
        setPost(prevPost => ({
          ...prevPost,
          comments: prevPost.comments.filter(comment => comment._id !== commentId)
        }));
      })
      .catch((error) => {
        let errorMessage = "Error deleting comment";
        if (error.response?.status === 401) {
          errorMessage = "Not authorized to delete comment";
        } else if (error.response?.status === 403) {
          errorMessage = "Not authorized to delete this comment";
        } else if (error.response?.status === 404) {
          errorMessage = "Comment not found";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      });
  };

  const handleReportPost = () => {
    if (!token) {
      showSnackbar("Please login to report this post", "warning");
      return;
    }
    setReportDialogOpen(true);
  };

  const handleReportSubmit = () => {
    if (!reportReason.trim()) {
      showSnackbar("Please provide a reason for the report");
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${id}/report`,
        { reason: reportReason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        showSnackbar("Post reported successfully", "success");
      })
      .catch((err) => {
        showSnackbar(err.response?.data?.message || "Error reporting post");
      })
      .finally(() => {
        setReportDialogOpen(false);
        setReportReason("");
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
              <Avatar src={post.author?.profilePicture} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {!post.author?.profilePicture && (post.author?.username ? post.author.username.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />)}
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

          {post.img && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <img
                src={post.img}
                alt={post.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </Box>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography
              component="div"
              variant="body1"
              sx={{
                lineHeight: 1.7,
                fontSize: '1.1rem',
                color: 'text.primary'
              }}
            >
              <ReactMarkdown children={post.content} />
            </Typography>
          </Box>

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
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ReportIcon />}
              onClick={handleReportPost}
              disabled={!token}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  backgroundColor: 'warning.main',
                  color: 'white'
                }
              }}
            >
              Report
            </Button>
          </Box>
        </Paper>
      </Fade>

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
                      <Avatar src={comm.author?.profilePicture} sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                        {!comm.author?.profilePicture && (comm.author?.username ? comm.author.username.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />)}
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
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Report Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for reporting this post. Your report will be reviewed by an administrator.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason"
            type="text"
            fullWidth
            variant="standard"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReportSubmit}>Submit Report</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostView;
