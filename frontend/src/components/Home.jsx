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
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const Home = () => {
  var [posts, setPosts] = useState([]);
  var [loading, setLoading] = useState(true);
  var navigate = useNavigate();
  var user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/posts`)
      .then((res) => {
        console.log(res);
        // Ensure we always set an array
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          console.error('Posts data is not an array:', res.data);
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching posts:', err);
        setPosts([]); // Set empty array on error
      })
      .finally(() => {
        setLoading(false);
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
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
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
    <Container maxWidth="xxl" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome To FAXRN
      </Typography>
      <Typography variant="h6" gutterBottom>
        Latest Posts
      </Typography>
      <br />
      
      {loading ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading posts...
        </Typography>
      ) : (
        <>
          {Array.isArray(posts) && posts.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              No posts available. Be the first to create one!
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {Array.isArray(posts) && posts.map((post) => (
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4, xxl: 4 }} key={post._id}>
            <Card
              sx={{
                height: '100%',
                maxWidth: '200%',
                width: '100%',
                margin: 'auto',
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '3.6em',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  {post.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  By: {post.author?.username || 'Unknown'}
                </Typography>
                <Typography variant="caption" color="textSecondary" gutterBottom>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    mb: 2,
                    lineHeight: 1.6
                  }}
                >
                  {post.content.substring(0, 1000)}...
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  <CommentIcon /> {post.comments?.length || 0} | <ThumbUpOffAltIcon /> {post.likes || 0}
                </Typography>
                <div style={{ marginTop: 'auto' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePostClick(post._id)}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    Read More
                  </Button>
                  {(user.id === post.author?._id || user.role === 'admin') && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(post._id)}
                      size="small"
                      fullWidth
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
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
