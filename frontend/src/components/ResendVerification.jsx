import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResendVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/resend-verification`,
        {
          email: email,
        },
      );

      setMessage(response.data.message);
      setSuccess(true);
    } catch (error) {
      console.log("Resend verification error:", error.response?.status, error.response?.data);

      let errorMessage = "Error sending verification email. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        // Handle specific backend messages
        if (errorMessage.includes("already verified")) {
          setSuccess(true); // Treat "already verified" as success
        } else {
          setSuccess(false);
        }
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid request. Please check your email address.";
        setSuccess(false);
      } else if (error.response?.status === 404) {
        errorMessage = "No account found with this email address.";
        setSuccess(false);
      } else if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
        setSuccess(false);
      } else {
        setSuccess(false);
      }

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "100px" }}>
      <Paper style={{ padding: "40px" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resend Verification Email
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Enter your email address to receive a new verification link
        </Typography>
        <br />

        {message && (
          <>
            <Alert severity={success ? "success" : "error"}>{message}</Alert>
            <br />
          </>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <br />
          <br />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            size="large"
          >
            {loading ? "Sending..." : "Send Verification Email"}
          </Button>
        </form>

        <br />
        <br />
        <Typography variant="body2" color="textSecondary" align="center">
          Already verified your email?{" "}
          <Button
            color="primary"
            onClick={handleGoToLogin}
            style={{ textTransform: "none" }}
          >
            Go to Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default ResendVerification;
