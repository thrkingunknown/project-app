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
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  var navigate = useNavigate();
  var [data, setData] = useState({ email: "", password: "" });
  var [message, setMessage] = useState("");
  var [isError, setIsError] = useState(false);
  var [showPassword, setShowPassword] = useState(false);
  var [isLoading, setIsLoading] = useState(false);

  var inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  var submitHandler = () => {
    console.log("login data", data);
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/login`, data)
      .then((response) => {
        console.log("Login successful:", response.data);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setMessage("Login successful!");
          setIsError(false);
          setTimeout(() => navigate("/"), 1000);
        } else {
          setMessage(response.data);
          setIsError(true);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setMessage("Error logging in");
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Fade in timeout={600}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grow in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                maxWidth: 480,
                width: "100%",
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background: 'background.paper',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <LoginIcon
                  sx={{
                    fontSize: 48,
                    color: 'primary.main',
                    mb: 2,
                    filter: 'drop-shadow(0 2px 8px rgba(0, 122, 255, 0.3))'
                  }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: 'text.primary'
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 400 }}
                >
                  Sign in to continue your discussions
                </Typography>
              </Box>

              {message && (
                <Fade in timeout={400}>
                  <Alert
                    severity={isError ? "error" : "success"}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        fontWeight: 500
                      }
                    }}
                  >
                    {message}
                  </Alert>
                </Fade>
              )}

              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={inputHandler}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        }
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: 2,
                        }
                      }
                    }
                  }}
                />

                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={inputHandler}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        }
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: 2,
                        }
                      }
                    }
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitHandler}
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)'
                    },
                    '&:disabled': {
                      transform: 'none'
                    }
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      style={{
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Register here
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Need to verify your email?{' '}
                    <Link
                      to="/resend-verification"
                      style={{
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Resend verification
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Forgot your password?{' '}
                    <Link
                      to="/forgot-password"
                      style={{
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Reset password
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grow>
        </Box>
      </Fade>
    </Container>
  );
};

export default Login;
