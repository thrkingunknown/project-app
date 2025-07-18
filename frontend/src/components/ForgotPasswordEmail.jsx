import React from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Container,
  Box,
  InputAdornment,
  Fade,
  Grow,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputHandler = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = () => {
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    if (!email) {
      setMessage("Please enter your email address");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/forgot-password`, { email })
      .then((response) => {
        setMessage(response.data);
        setIsError(false);
        setIsSuccess(true);
      })
      .catch((error) => {
        let errorMessage = "Error sending reset email";
        if (error.response?.status === 400) {
          errorMessage = "Invalid email address";
        } else if (error.response?.status === 429) {
          errorMessage = "Too many reset attempts. Please try again later.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        setMessage(errorMessage);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Fade in={true} timeout={800}>
        <Paper
          elevation={8}
          style={{
            padding: "40px",
            borderRadius: "15px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Grow in={true} timeout={1000}>
            <Box textAlign="center">
              <Typography
                variant="h4"
                gutterBottom
                style={{ fontWeight: "bold", marginBottom: "10px" }}
              >
                Forgot Password
              </Typography>
              <Typography
                variant="body1"
                style={{ marginBottom: "30px", opacity: 0.9 }}
              >
                Enter your email address and we'll send you a link to reset your password
              </Typography>

              {message && (
                <Alert
                  severity={isError ? "error" : "success"}
                  style={{ marginBottom: "20px" }}
                >
                  {message}
                </Alert>
              )}

              {!isSuccess && (
                <>
                  <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    name="email"
                    type="email"
                    value={email}
                    onChange={inputHandler}
                    onKeyDown={handleKeyPress}
                    style={{ marginBottom: "20px" }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon style={{ color: "white" }} />
                          </InputAdornment>
                        ),
                        style: { color: "white" },
                      },
                      inputLabel: {
                        style: { color: "white" },
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                        },
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={submitHandler}
                    disabled={isLoading}
                    style={{
                      marginBottom: "20px",
                      padding: "12px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      backgroundColor: "white",
                      color: "#667eea",
                      borderRadius: "8px",
                    }}
                    startIcon={<SendIcon />}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </>
              )}

              <Box style={{ marginTop: "20px" }}>
                <Link
                  to="/login"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <ArrowBackIcon />
                  Back to Login
                </Link>
              </Box>
            </Box>
          </Grow>
        </Paper>
      </Fade>
    </Container>
  );
};

export default ForgotPasswordEmail;
