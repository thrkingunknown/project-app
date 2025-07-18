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
  var navigate = useNavigate();
  var [email, setEmail] = useState("");
  var [message, setMessage] = useState("");
  var [loading, setLoading] = useState(false);
  var [success, setSuccess] = useState(false);

  var handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      var response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/resend-verification`,
        {
          email: email,
        },
      );

      setMessage(response.data);
      setSuccess(true);
    } catch (error) {
      setMessage("Error sending verification email. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  var handleGoToLogin = () => {
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
