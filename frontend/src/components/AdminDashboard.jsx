import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  var navigate = useNavigate();
  var [users, setUsers] = useState([]);
  var [posts, setPosts] = useState([]);
  var [tabValue, setTabValue] = useState(0);
  var [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  var currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (currentUser.role !== "admin") {
      setSnackbar({ open: true, message: "Admin access required", severity: "error" });
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("users", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, message: "Error loading users", severity: "error" });
      });

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/posts`)
      .then((res) => {
        console.log("posts", res.data);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, message: "Error loading posts", severity: "error" });
      });
  }, [currentUser.role, navigate, token]);

  var handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      setSnackbar({ open: true, message: "Cannot delete your own account", severity: "warning" });
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setSnackbar({ open: true, message: "User deleted successfully", severity: "success" });
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, message: "Error deleting user", severity: "error" });
      });
  };

  var handleDeletePost = (postId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setSnackbar({ open: true, message: "Post deleted successfully", severity: "success" });
        setPosts(posts.filter(post => post._id !== postId));
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, message: "Error deleting post", severity: "error" });
      });
  };

  var handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Users Management" />
          <Tab label="Posts Management" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Paper style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Users Management
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/profile/${user._id}`)}
                        size="small"
                      >
                        View
                      </Button>
                      &nbsp;
                      {user._id !== currentUser.id && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteUser(user._id)}
                          size="small"
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Posts Management
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.author?.username || "Unknown"}</TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{post.comments?.length || 0}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/post/${post._id}`)}
                        size="small"
                      >
                        View
                      </Button>
                      &nbsp;
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeletePost(post._id)}
                        size="small"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
