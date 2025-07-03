import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
  var navigate = useNavigate();
  var token = localStorage.getItem("token");
  var user = JSON.parse(localStorage.getItem("user") || "{}");

  var handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              {" "}
              <Typography variant="h5" component="div" className="scale" >
                FAXRN
              </Typography>
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {user.username
                ? `Welcome, ${user.username}`
                : "Welcome to the Forum"}
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "right",
              }}
            >
              {token ? (
                <>
                  <Button color="inherit">
                    <Link
                      to="/create-post"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Create Post
                    </Link>
                  </Button>
                  <Button color="inherit">
                    <Link
                      to={`/profile/${user.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Profile
                    </Link>
                  </Button>
                  {user.role === "admin" && (
                    <Button color="inherit">
                      <Link
                        to="/admin"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit">
                    <Link
                      to="/login"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button color="inherit">
                    <Link
                      to="/register"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Navbar;
