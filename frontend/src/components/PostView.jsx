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
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const PostView = () => {
  var { id } = useParams();
  var navigate = useNavigate();
  var [post, setPost] = useState();
  var [commEdit, setCommEdit] = useState(false);
  var [editingCommentId, setEditingCommentId] = useState(null);
  var [comment, setComment] = useState("");
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
        alert("Error loading post");
      });
  }, [id]);

  var handleDeletePost = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert("Error deleting post");
      });
  };

  var handlePostEdit = (postData) => {
    console.log(postData);
    navigate(`/create-post`, { state: postData });
  };

  var likehandler = () => {
    if (!token) {
      alert("Please login to like this post");
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
      <Container maxWidth="md" style={{ marginTop: "50px" }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Paper
        style={{ padding: "30px" }}
        className="combined sh"
        sx={{ boxShadow: 5, borderRadius: 2 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          By: {post.author?.username || "Unknown"} |{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        <br />
        <Typography variant="body1">{post.content}</Typography>
        <br />
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          className="combined sh"
        >
          Back to Home
        </Button>
        &nbsp;
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
        >
          {post.likedBy?.includes(user.id) ? "Liked" : "Like"}:{" "}
          {post.likes || 0}
        </Button>
        &nbsp;&nbsp;
        {(user.id === post.author?._id || user.role === "admin") && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this post?")
              ) {
                handleDeletePost();
              }
            }}
          >
            Delete
          </Button>
        )}
        &nbsp;&nbsp;
        {(user.role === "admin" || user.id === post.author?._id) && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              handlePostEdit(post);

            }}

          >
            Edit
          </Button>
        )}
      </Paper>

      <br />

      <Paper
        style={{ padding: "20px" }}
        className="combined sh"
        sx={{ boxShadow: 5, borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          Comments ({post.comments?.length || 0})
        </Typography>

        {token && (
          <>
            <TextField
              label={commEdit ? "Edit comment" : "Add a comment"}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              margin="normal"
              className="combined sh"
            />

            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
              className="combined sh"
            >
              Comment
            </Button>
            <br />
            <br />
          </>
        )}

        <Divider />
        <br />

        {post.comments &&
          post.comments.map((comm) => (
            <Card
              key={comm._id}
              style={{ marginBottom: "10px" }}
              sx={{ boxShadow: 3, borderRadius: 1 }}
            >
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {comm.author?.username || "Unknown"} |{" "}
                  {new Date(comm.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">{comm.content}</Typography>
                {(user.id === comm.author?._id || user.role === "admin") && (
                  <>
                    <br />
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteComment(comm._id)}
                    >
                      Delete
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      onClick={() => handleCommentEdit(comm)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

        {(!post.comments || post.comments.length === 0) && (
          <Typography variant="body2" color="textSecondary">
            No comments yet. Be the first to comment!
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default PostView;
