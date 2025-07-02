import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  var [posts, setPosts] = useState([]);
  var navigate = useNavigate();
  var user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    axios
      .get("http://localhost:3000/posts")
      .then((res) => {
        console.log(res);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  var handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  var handleDelete = (id) => {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }
    
    console.log('deleting post', id);
    axios
      .delete(`http://localhost:3000/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert('Error deleting post');
      });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome To FAXRN
      </Typography>
      <Typography variant="h6" gutterBottom>
        Latest Posts
      </Typography>
      <br />
      
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  By: {post.author?.username || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" paragraph>
                  {post.content.substring(0, 200)}...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Comments: {post.comments?.length || 0} | Likes: {post.likes || 0}
                </Typography>
                <br />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handlePostClick(post._id)}
                >
                  Read More
                </Button>
                &nbsp;&nbsp;
                {(user.id === post.author?._id || user.role === 'admin') && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {posts.length === 0 && (
        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '50px' }}>
          No posts yet. Be the first to create one!
        </Typography>
      )}
    </Container>
  );
};

export default Home;
