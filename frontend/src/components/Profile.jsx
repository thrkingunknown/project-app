import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  var { id } = useParams();
  var navigate = useNavigate();
  var [userData, setUserData] = useState(null);
  var currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`)
      .then((res) => {
        console.log("user data", res.data);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Error loading profile");
      });
  }, [id]);

  var handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  var handleDeletePost = (postId) => {
    var token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("Error deleting post");
      });
  };

  if (!userData) {
    return (
      <Container maxWidth="md" style={{ marginTop: "50px" }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Paper style={{ padding: "30px" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="h5" gutterBottom>
          {userData.user?.username || "Unknown User"}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Email: {userData.user?.email || "N/A"}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Role: {userData.user?.role || "user"}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Member since:{" "}
          {new Date(userData.user?.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total Posts: {userData.posts?.length || 0}
        </Typography>
      </Paper>

      <br />

      <Paper style={{ padding: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Posts by {userData.user?.username}
        </Typography>

        <Grid container spacing={2}>
          {userData.posts &&
            userData.posts.map((post) => (
              <Grid size={12} key={post._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {post.content.substring(0, 150)}...
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Comments: {post.comments?.length || 0} | Likes:{" "}
                      {post.likes || 0}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePostClick(post._id)}
                    >
                      View Post
                    </Button>
                    &nbsp;&nbsp;
                    {(currentUser.id === userData.user?._id ||
                      currentUser.role === "admin") && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {(!userData.posts || userData.posts.length === 0) && (
          <Typography variant="body1" color="textSecondary">
            No posts yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
