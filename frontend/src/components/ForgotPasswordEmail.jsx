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
import { useNavigate, Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

const ForgotPasswordEmail = () => {
  var navigate = useNavigate();
  var [email, setEmail] = useState("");
  var [message, setMessage] = useState("");
  var [isError, setIsError] = useState(false);
  var [isLoading, setIsLoading] = useState(false);
  var [isSuccess, setIsSuccess] = useState(false);

  var inputHandler = (e) => {
    setEmail(e.target.value);
  };

  var submitHandler = () => {
    console.log("forgot password email", email);
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
        console.log("Forgot password response:", response.data);
        
        if (response.data === "not-registered") {
          // Redirect to register page with popup
          navigate("/register", { 
            state: { 
              showNotRegisteredPopup: true,
              email: email 
            } 
          });
        } else {
          setMessage(response.data);
          setIsError(false);
          setIsSuccess(true);
        }
      })
      .catch((error) => {
        console.error("Error sending reset email:", error);
        setMessage("Error sending reset email");
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  var handleKeyPress = (e) => {
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
                    onKeyPress={handleKeyPress}
                    style={{ marginBottom: "20px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon style={{ color: "white" }} />
                        </InputAdornment>
                      ),
                      style: { color: "white" },
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
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
