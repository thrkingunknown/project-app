import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
  var [searchParams] = useSearchParams();
  var navigate = useNavigate();
  var [status, setStatus] = useState("verifying");
  var [message, setMessage] = useState("");

  useEffect(() => {
    var token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/verify-email?token=${token}`)
      .then((response) => {
        console.log("Verification response:", response.data);
        setStatus("success");
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(
          "Error verifying email. Please try again or contact support.",
        );
      });
  }, [searchParams]);

  var handleGoToLogin = () => {
    navigate("/login");
  };

  var handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "100px" }}>
      <Paper style={{ padding: "40px", textAlign: "center" }}>
        {status === "verifying" && (
          <>
            <CircularProgress size={60} />
            <br />
            <br />
            <Typography variant="h5" gutterBottom>
              Verifying Your Email...
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Please wait while we verify your email address.
            </Typography>
          </>
        )}

        {status === "success" && (
          <>
            <Typography variant="h4" gutterBottom style={{ color: "green" }}>
              ✅ Email Verified Successfully!
            </Typography>
            <Typography variant="body1" gutterBottom>
              {message}
            </Typography>
            <br />
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Your account is now active. You can login and start using FAXRN.
            </Typography>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoToLogin}
              size="large"
            >
              Go to Login
            </Button>
            &nbsp;&nbsp;
            <Button variant="outlined" onClick={handleGoHome} size="large">
              Go to Home
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <Typography variant="h4" gutterBottom style={{ color: "red" }}>
              ❌ Verification Failed
            </Typography>
            <Typography variant="body1" gutterBottom>
              {message}
            </Typography>
            <br />
            <Typography variant="body2" color="textSecondary" gutterBottom>
              The verification link may have expired or is invalid. You can
              request a new verification email from the login page.
            </Typography>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoToLogin}
              size="large"
            >
              Go to Login
            </Button>
            &nbsp;&nbsp;
            <Button variant="outlined" onClick={handleGoHome} size="large">
              Go to Home
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default EmailVerification;
