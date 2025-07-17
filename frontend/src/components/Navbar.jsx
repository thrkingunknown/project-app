import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  InputBase,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    return () => {
      setAnchorElNav(null);
      setAnchorElUser(null);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleCloseUserMenu();
    navigate("/");
    window.location.reload();
  };

  const handleMenuItemClick = (path) => {
    handleCloseNavMenu();
    navigate(path);
  };

  const handleUserMenuItemClick = (action) => {
    handleCloseUserMenu();
    if (action === "logout") {
      handleLogout();
    } else if (action === "profile") {
      navigate(`/profile/${user.id}`);
    } else if (action === "admin") {
      navigate("/admin");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      handleCloseNavMenu();
      setSearchQuery("");
    }
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit(event);
    }
  };

  const authenticatedPages = [
    { name: "Home", path: "/" },
    { name: "Create Post", path: "/create-post" },
  ];

  const publicPages = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  const userSettings = [
    { name: "Profile", action: "profile" },
    ...(user.role === "admin"
      ? [{ name: "Admin Dashboard", action: "admin" }]
      : []),
    { name: "Logout", action: "logout" },
  ];

  const pages = token ? authenticatedPages : publicPages;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'transparent',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          zIndex: -1,
        }
      }}
      className="glass"
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, sm: 70 },
            py: 1
          }}
        >
          <ForumIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1.5,
              fontSize: 28,
              color: 'primary.main',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                filter: 'drop-shadow(0 2px 8px rgba(0, 122, 255, 0.3))'
              }
            }}
          />

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: ".2rem",
              color: "text.primary",
              textDecoration: "none",
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'primary.main',
                transform: 'translateY(-1px)',
              }
            }}
          >
            FAXRN
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="Open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: 'text.primary',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <MenuIcon sx={{ color: 'inherit' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted={false}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  mt: 1,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  minWidth: 280,
                }
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Paper
                  component="form"
                  onSubmit={handleSearchSubmit}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: 40,
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 2px 8px rgba(0, 122, 255, 0.15)'
                    },
                    '&:focus-within': {
                      borderColor: 'primary.main',
                      boxShadow: '0 2px 8px rgba(0, 122, 255, 0.25)'
                    }
                  }}
                  elevation={0}
                >
                  <InputBase
                    sx={{
                      ml: 2,
                      flex: 1,
                      fontSize: '0.9rem',
                      '& input::placeholder': {
                        color: 'text.secondary',
                        opacity: 0.7
                      }
                    }}
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyPress}
                    inputProps={{ 'aria-label': 'search posts' }}
                  />
                  <IconButton
                    type="submit"
                    sx={{
                      p: 1,
                      color: 'text.secondary',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'action.hover'
                      }
                    }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Box>

              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleMenuItemClick(page.path)}
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <ForumIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              fontSize: 24,
              color: 'primary.main',
              transition: 'all 0.2s ease-in-out'
            }}
          />

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: ".2rem",
              color: "text.primary",
              textDecoration: "none",
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'primary.main',
              }
            }}
          >
            FAXRN
          </Typography>

          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", md: "flex" },
              justifyContent: 'center',
              gap: 1
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 1,
                  px: 3,
                  py: 1,
                  color: "text.primary",
                  display: "block",
                  borderRadius: 2,
                  fontWeight: 500,
                  textTransform: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'primary.main',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15)'
                  }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: 'center',
              mx: 3
            }}
          >
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 400,
                height: 40,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15)'
                },
                '&:focus-within': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.25)'
                }
              }}
              elevation={0}
            >
              <InputBase
                sx={{
                  ml: 2,
                  flex: 1,
                  fontSize: '0.9rem',
                  '& input::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7
                  }
                }}
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyPress}
                inputProps={{ 'aria-label': 'search posts' }}
              />
              <IconButton
                type="submit"
                sx={{
                  p: 1,
                  color: 'text.secondary',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <IconButton
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                sx={{
                  mr: 1,
                  color: 'text.primary',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.05)',
                    color: 'primary.main'
                  }
                }}
              >
                {isDarkMode ? <Brightness7Icon sx={{ color: 'inherit' }} /> : <Brightness4Icon sx={{ color: 'inherit' }} />}
              </IconButton>
            </Tooltip>
            {token ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    aria-label="Open user menu"
                    sx={{
                      p: 0,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    <Avatar
                      alt={user.username}
                      src={user.profilePicture}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                        width: 40,
                        height: 40,
                        boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4)',
                        }
                      }}
                    >
                      {!user.profilePicture && user.username ? (
                        user.username.charAt(0).toUpperCase()
                      ) : (
                        !user.profilePicture && <PersonIcon />
                      )}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    mt: "45px",
                    '& .MuiPaper-root': {
                      borderRadius: 2,
                      mt: 1,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid',
                      borderColor: 'divider',
                      minWidth: 180,
                    }
                  }}
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted={false}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userSettings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      onClick={() => handleUserMenuItemClick(setting.action)}
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontWeight: 500,
                          color: 'text.primary'
                        }}
                      >
                        {setting.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              console.log("Not Logged In")
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
