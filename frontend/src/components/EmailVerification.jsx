import { useEffect, useState } from "react";
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    let isCancelled = false;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/verify-email?token=${token}`)
      .then((response) => {
        if (!isCancelled) {
          setStatus("success");
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.log("Verification error:", error.response?.status, error.response?.data);

          if (error.response?.data?.message?.includes("already verified")) {
            setStatus("success");
            setMessage(error.response.data.message);
            return;
          }

          setStatus("error");
          let errorMessage = "Error verifying email. Please try again.";

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.status === 400) {
            errorMessage = "Verification token has expired. Please request a new verification email.";
          } else if (error.response?.status === 404) {
            errorMessage = "Invalid verification token. Please request a new verification email.";
          } else if (error.response?.status === 406) {
            errorMessage = "Invalid verification token. Please request a new verification email.";
          } else if (error.response?.status === 500) {
            errorMessage = "Server error occurred. Please try again later.";
          }

          setMessage(errorMessage);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoHome = () => {
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
              ❌ Verification Issue
            </Typography>
            <Typography variant="body1" gutterBottom>
              {message}
            </Typography>
            <br />
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {message.includes("expired")
                ? "Please request a new verification email to continue."
                : message.includes("Invalid")
                ? "Please request a new verification email from the login page."
                : "You can request a new verification email from the login page."
              }
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
