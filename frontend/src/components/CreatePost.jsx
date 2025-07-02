import React from "react";
import { Button, TextField, Typography, Paper, Container } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  var navigate = useNavigate();
  var [data, setData] = useState({ title: "", content: "" });

  useEffect(() => {
    // check if user is logged in
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/login');
    }
  }, []);

  var inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  var submitHandler = () => {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    console.log("creating post", data);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/posts`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        console.log("Post created successfully:", response.data);
        alert(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        alert("Error creating post");
      });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Paper style={{ padding: '30px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Post
        </Typography>
        <br />
        <TextField
          id="title"
          label="Post Title"
          variant="outlined"
          name="title"
          value={data.title}
          onChange={inputHandler}
          fullWidth
          margin="normal"
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
        />
        <br />
        <br />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={submitHandler}
          size="large"
        >
          Create Post
        </Button>
        &nbsp;&nbsp;
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => navigate('/')}
          size="large"
        >
          Cancel
        </Button>
      </Paper>
    </Container>
  );
};

export default CreatePost;
