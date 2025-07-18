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
  IconButton,
  Fade,
  Grow,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SecurityIcon from "@mui/icons-material/Security";
import LoginIcon from "@mui/icons-material/Login";

const ForgotPasswordReset = () => {
  var navigate = useNavigate();
  var [searchParams] = useSearchParams();
  var [data, setData] = useState({ newPassword: "", confirmPassword: "" });
  var [message, setMessage] = useState("");
  var [isError, setIsError] = useState(false);
  var [isLoading, setIsLoading] = useState(false);
  var [isSuccess, setIsSuccess] = useState(false);
  var [showPassword, setShowPassword] = useState(false);
  var [showConfirmPassword, setShowConfirmPassword] = useState(false);
  var [token, setToken] = useState("");

  useEffect(() => {
    var resetToken = searchParams.get("token");
    if (!resetToken) {
      setMessage("Invalid reset link. No token provided.");
      setIsError(true);
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);

  var inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  var submitHandler = () => {
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    if (!data.newPassword || !data.confirmPassword) {
      setMessage("Please fill in all fields");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (data.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!token) {
      setMessage("Invalid reset token");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/reset-password`, {
        token: token,
        newPassword: data.newPassword,
      })
      .then((response) => {
        setMessage(response.data);
        setIsError(false);
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        let errorMessage = "Error resetting password";
        if (error.response?.status === 400) {
          errorMessage = "Invalid or expired reset token";
        } else if (error.response?.status === 404) {
          errorMessage = "Reset token not found";
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

  var handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  };

  var handleGoToLogin = () => {
    navigate("/login");
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
              <SecurityIcon style={{ fontSize: "60px", marginBottom: "20px" }} />
              <Typography
                variant="h4"
                gutterBottom
                style={{ fontWeight: "bold", marginBottom: "10px" }}
              >
                Reset Password
              </Typography>
              <Typography
                variant="body1"
                style={{ marginBottom: "30px", opacity: 0.9 }}
              >
                Enter your new password below
              </Typography>

              {message && (
                <Alert
                  severity={isError ? "error" : "success"}
                  style={{ marginBottom: "20px" }}
                >
                  {message}
                </Alert>
              )}

              {!isSuccess && token && (
                <>
                  <TextField
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={data.newPassword}
                    onChange={inputHandler}
                    onKeyDown={handleKeyPress}
                    style={{ marginBottom: "20px" }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon style={{ color: "white" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ color: "white" }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
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

                  <TextField
                    label="Confirm New Password"
                    variant="outlined"
                    fullWidth
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.confirmPassword}
                    onChange={inputHandler}
                    onKeyDown={handleKeyPress}
                    style={{ marginBottom: "20px" }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon style={{ color: "white" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={{ color: "white" }}
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
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
                    startIcon={<SecurityIcon />}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </>
              )}

              {isSuccess && (
                <Button
                  variant="contained"
                  onClick={handleGoToLogin}
                  style={{
                    marginTop: "20px",
                    padding: "12px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    backgroundColor: "white",
                    color: "#667eea",
                    borderRadius: "8px",
                  }}
                  startIcon={<LoginIcon />}
                >
                  Go to Login
                </Button>
              )}

              <Box style={{ marginTop: "20px" }}>
                <Link
                  to="/login"
                  style={{
                    color: "white",
                    textDecoration: "none",
                  }}
                >
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

export default ForgotPasswordReset;
