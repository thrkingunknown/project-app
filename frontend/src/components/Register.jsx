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
import { useNavigate, Link, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";

const Register = () => {
  var navigate = useNavigate();
  var location = useLocation();
  var [data, setData] = useState({ username: "", email: "", password: "" });
  var [message, setMessage] = useState("");
  var [isError, setIsError] = useState(false);
  var [showPassword, setShowPassword] = useState(false);
  var [isLoading, setIsLoading] = useState(false);


  var isEditMode = location.pathname.includes('/edit-profile');

  useEffect(() => {
    if (isEditMode) {
      var currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser.username && currentUser.email) {
        setData({
          username: currentUser.username,
          email: currentUser.email,
          password: ""
        });
      } else {
        navigate("/login");
      }
    }


  }, [isEditMode, navigate, location]);

  var inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  var submitHandler = () => {
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    if (isEditMode) {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login first");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      var updateData = { username: data.username };
      if (data.password.trim()) {
        updateData.password = data.password;
      }

      axios
        .put(`${import.meta.env.VITE_BACKEND_URL}/profile`, updateData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setMessage("Profile updated successfully!");
          setIsError(false);

          var currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          currentUser.username = data.username;
          localStorage.setItem("user", JSON.stringify(currentUser));

          setData({ ...data, password: "" });

          setTimeout(() => {
            navigate("/profile/" + currentUser.id);
          }, 2000);
        })
        .catch((error) => {
          let errorMessage = "Error updating profile";
          if (error.response?.status === 401) {
            errorMessage = "Not authorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data?.message || "Invalid profile data";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          setMessage(errorMessage);
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/register`, data)
        .then((response) => {
          setMessage(response.data.message);
          setIsError(false);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch((error) => {
          let errorMessage = "Error registering user";
          if (error.response?.status === 400) {
            errorMessage = error.response.data?.message || "Invalid registration data";
          } else if (error.response?.status === 409) {
            errorMessage = "Email already exists. Please use a different email.";
          } else if (error.response?.status === 429) {
            errorMessage = "Too many registration attempts. Please try again later.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          setMessage(errorMessage);
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
                {isEditMode ? (
                  <EditIcon
                    sx={{
                      fontSize: 48,
                      color: 'primary.main',
                      mb: 2,
                      filter: 'drop-shadow(0 2px 8px rgba(0, 122, 255, 0.3))'
                    }}
                  />
                ) : (
                  <PersonAddIcon
                    sx={{
                      fontSize: 48,
                      color: 'primary.main',
                      mb: 2,
                      filter: 'drop-shadow(0 2px 8px rgba(0, 122, 255, 0.3))'
                    }}
                  />
                )}
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: 'text.primary'
                  }}
                >
                  {isEditMode ? 'Edit Profile' : 'Join FAXRN'}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 400 }}
                >
                  {isEditMode
                    ? 'Update your username and password'
                    : 'Create your account to start participating in discussions'
                  }
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
                  id="username"
                  label="Username"
                  variant="outlined"
                  name="username"
                  value={data.username}
                  onChange={inputHandler}
                  fullWidth
                  margin="normal"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }
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
                  id="email"
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={inputHandler}
                  disabled={isEditMode}
                  fullWidth
                  margin="normal"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      backgroundColor: isEditMode ? 'action.disabledBackground' : 'transparent',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isEditMode ? 'action.disabled' : 'primary.main',
                        }
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: 2,
                        }
                      },
                      '&.Mui-disabled': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'action.disabled',
                        }
                      }
                    }
                  }}
                  helperText={isEditMode ? "Email cannot be changed" : ""}
                />

                <TextField
                  id="password"
                  label={isEditMode ? "New Password (optional)" : "Password"}
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={inputHandler}
                  fullWidth
                  margin="normal"
                  slotProps={{
                    input: {
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
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
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
                  helperText={isEditMode ? "Leave blank to keep current password" : ""}
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
                  {isLoading
                    ? (isEditMode ? 'Updating Profile...' : 'Creating Account...')
                    : (isEditMode ? 'Update Profile' : 'Create Account')
                  }
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  {isEditMode ? (
                    <Button
                      variant="text"
                      onClick={() => navigate(-1)}
                      sx={{
                        color: 'text.secondary',
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        style={{
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          fontWeight: 600
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grow>
        </Box>
      </Fade>
    </Container>
  );
};

export default Register;
