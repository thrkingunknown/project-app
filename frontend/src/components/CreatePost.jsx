import React from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  styled,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CreatePost = (props) => {
  var navigate = useNavigate();
  var location = useLocation();
  var [data, setData] = useState({ title: "", content: "", image: "" });
  useEffect(() => {
    if (location.state !== null) {
      setData({
        ...data,
        title: location.state.title,
        content: location.state.content,
        image: location.state.image,
      });
    }
  }, []);

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
    var token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, []);

  var inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  var submitHandler = () => {
    var token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }
     if (location.state !== null) {
       axios
         .put(`${import.meta.env.VITE_BACKEND_URL}/posts/${location.state._id}`, data, {
           headers: { Authorization: `Bearer ${token}` },
         })
         .then((res) => {
           console.log(res);
           alert(res.data);
           navigate("/");
         })
         .catch((err) => {
           console.log(err);
           alert("Error updating post");
       })
     } else {
    console.log("creating post", data);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/posts`, data, {
        headers: { Authorization: `Bearer ${token}` },
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
}

  return (
    <Container maxWidth="md" style={{ marginTop: "50px" }}>
      <Paper style={{ padding: "30px" }}>
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
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          />
        </Button>
        &nbsp;&nbsp;
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
          onClick={() => navigate("/")}
          size="large"
        >
          Cancel
        </Button>
      </Paper>
    </Container>
  );
};

export default CreatePost;
