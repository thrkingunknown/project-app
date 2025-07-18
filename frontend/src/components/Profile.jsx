import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
  Avatar,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

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
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Error loading profile", severity: "error" });
      });
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleProfilePictureUpload = () => {
    if (!selectedFile) {
      setSnackbar({ open: true, message: "Please select a file", severity: "warning" });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      const base64String = reader.result;
      const token = localStorage.getItem("token");
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/users/${id}/profile-picture`,
          { profilePicture: base64String },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setSnackbar({ open: true, message: "Profile picture updated successfully", severity: "success" });
          const updatedUser = { ...currentUser, profilePicture: res.data.profilePicture };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUserData((prevData) => ({
            ...prevData,
            user: { ...prevData.user, profilePicture: res.data.profilePicture },
          }));
          window.location.reload();
        })
        .catch(() => {
          setSnackbar({ open: true, message: "Error updating profile picture", severity: "error" });
        });
    };
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleDeletePost = (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({ open: true, message: "Please login first", severity: "warning" });
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSnackbar({ open: true, message: "Post deleted successfully", severity: "success" });
        setUserData(prevData => ({
          ...prevData,
          posts: prevData.posts.filter(post => post._id !== postId)
        }));
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Error deleting post", severity: "error" });
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            User Profile
          </Typography>
          {currentUser.id === userData.user?._id && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate("/edit-profile")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 16px rgba(0, 122, 255, 0.4)",
                },
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={userData.user?.profilePicture}
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {userData.user?.username?.[0]}
          </Avatar>
          <Typography variant="h5" gutterBottom>
            {userData.user?.username || "Unknown User"}
          </Typography>
        </Box>
        {currentUser.id === userData.user?._id && (
          <Box sx={{ mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.2)",
                },
              }}
            >
              Upload Profile Picture
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
            {selectedFile && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleProfilePictureUpload}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  ml: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 16px rgba(0, 122, 255, 0.4)",
                  },
                }}
              >
                Confirm
              </Button>
            )}
          </Box>
        )}
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
              <Grid key={post._id}>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
