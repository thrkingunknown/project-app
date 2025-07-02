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

const PostView = () => {
  var { id } = useParams();
  var navigate = useNavigate();
  var [post, setPost] = useState(null);
  var [comment, setComment] = useState("");
  var user = JSON.parse(localStorage.getItem('user') || '{}');
  var token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`http://localhost:3000/posts/${id}`)
      .then((res) => {
        console.log("post data", res.data);
        setPost(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Error loading post");
      });
  }, [id]);

  var handleCommentSubmit = () => {
    if (!token) {
      alert('Please login to comment');
      return;
    }
    
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    axios
      .post(`http://localhost:3000/posts/${id}/comments`, 
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        alert(res.data);
        setComment("");
        window.location.reload(); // reload to show new comment
      })
      .catch((err) => {
        console.log(err);
        alert("Error adding comment");
      });
  };

  var handleDeleteComment = (commentId) => {
    if (!token) {
      alert('Please login first');
      return;
    }

    axios
      .delete(`http://localhost:3000/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
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
      <Container maxWidth="md" style={{ marginTop: '50px' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper style={{ padding: '30px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          By: {post.author?.username || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        <br />
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Likes: {post.likes || 0}
        </Typography>
        <br />
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Paper>

      <br />

      {/* Comment Section */}
      <Paper style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Comments ({post.comments?.length || 0})
        </Typography>
        
        {token && (
          <>
            <TextField
              label="Add a comment"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              margin="normal"
            />
            <br />
            <br />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCommentSubmit}
            >
              Add Comment
            </Button>
            <br />
            <br />
          </>
        )}

        <Divider />
        <br />

        {post.comments && post.comments.map((comm) => (
          <Card key={comm._id} style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {comm.author?.username || 'Unknown'} | {new Date(comm.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                {comm.content}
              </Typography>
              {(user.id === comm.author?._id || user.role === 'admin') && (
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
