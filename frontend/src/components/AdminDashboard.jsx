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
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  var navigate = useNavigate();
  var [users, setUsers] = useState([]);
  var [posts, setPosts] = useState([]);
  var [tabValue, setTabValue] = useState(0);
  var currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  var token = localStorage.getItem('token');

  useEffect(() => {
    // check if user is admin
    if (currentUser.role !== 'admin') {
      alert('Admin access required');
      navigate('/');
      return;
    }

    // get users
    axios
      .get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log("users", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Error loading users");
      });

    // get posts
    axios
      .get("http://localhost:3000/posts")
      .then((res) => {
        console.log("posts", res.data);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  var handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert("Cannot delete your own account");
      return;
    }

    axios
      .delete(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("Error deleting user");
      });
  };

  var handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:3000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
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

  var handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Users Management" />
          <Tab label="Posts Management" />
        </Tabs>
      </Box>

      {/* Users Tab */}
      {tabValue === 0 && (
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
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
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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

      {/* Posts Tab */}
      {tabValue === 1 && (
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
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
                    <TableCell>{post.author?.username || 'Unknown'}</TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
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
    </Container>
  );
};

export default AdminDashboard;
