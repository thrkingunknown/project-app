import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Avatar, Accordion, AccordionSummary, AccordionDetails, Chip, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const Moderation = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchReportedPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reported-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportedPosts(response.data);
    } catch (err) {
      setError('Failed to fetch reported posts. You may not have the required permissions.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchReportedPosts();
    }
  }, [token]);

  const handleRemoveReport = async (postId, reportId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReportedPosts(); // Refresh the list after removing a report
    } catch (err) {
      setError('Failed to remove report.');
    }
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Moderation - Reported Posts
      </Typography>
      {reportedPosts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No reported posts found.</Typography>
        </Paper>
      ) : (
        reportedPosts.map((post) => (
          <Paper key={post._id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" component={Link} to={`/post/${post._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                  {post.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Avatar src={post.author.profilePicture} sx={{ width: 24, height: 24 }} />
                  <Typography variant="body2">{post.author.username}</Typography>
                </Box>
              </Box>
              <Chip label={`${post.reports.length} Reports`} color="error" />
            </Box>
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>View Reports</Typography>
              </AccordionSummary>
                  <AccordionDetails>
                {post.reports.map((report) => {
                  const reportingUser = post.reportUsers.find(u => u._id === report.user);
                  return (
                  <Box key={report._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, p: 1, borderBottom: '1px solid #eee' }}>
                    <Box>
                      <Typography variant="body2"><strong>Reason:</strong> {report.reason}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reported by: {reportingUser ? reportingUser.username : 'Unknown User'} on {new Date(report.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveReport(post._id, report._id)}
                    >
                      Remove
                    </Button>
                  </Box>
                )})}
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default Moderation;
