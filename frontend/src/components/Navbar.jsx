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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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
    <AppBar position="static">
      <Container maxWidth="xl" className="opacity-[80%] rounded-[25px]">
        <Toolbar disableGutters>
          <ForumIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            FAXRN
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleMenuItemClick(page.path)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <ForumIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            FAXRN
          </Typography>

          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            className="relative top-auto right-auto bottom-auto left-auto"
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <IconButton
                onClick={toggleDarkMode}
                color="inherit"
                sx={{ mr: 1 }}
              >
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {token ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.username}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {user.username ? (
                        user.username.charAt(0).toUpperCase()
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
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
                    >
                      <Typography sx={{ textAlign: "center" }}>
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
