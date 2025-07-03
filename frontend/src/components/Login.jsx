import React from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Container,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  var navigate = useNavigate();
  var [data, setData] = useState({ email: "", password: "" });
  var [message, setMessage] = useState("");
  var [isError, setIsError] = useState(false);

  var inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  var submitHandler = () => {
    console.log("login data", data);
    setMessage("");
    setIsError(false);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/login`, data)
      .then((response) => {
        console.log("Login successful:", response.data);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setMessage("Login successful!");
          setIsError(false);
          navigate("/");
        } else {
          setMessage(response.data);
          setIsError(true);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setMessage("Error logging in");
        setIsError(true);
      });
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <Paper style={{ padding: "30px", maxWidth: "400px", width: "100%" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome Back to FAXRN
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Sign in to continue your discussions
        </Typography>
        <br />

        {message && (
          <>
            <Alert severity={isError ? "error" : "success"}>{message}</Alert>
            <br />
          </>
        )}
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
        />

        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          value={data.password}
          onChange={inputHandler}
          fullWidth
          margin="normal"
        />

        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={submitHandler}
          fullWidth
        >
          Login
        </Button>
        <br />
        <br />
        <Typography variant="body2" align="center">
          Don't have an account? <Link to="/register">Register here</Link>
        </Typography>
        <br />
        <Typography variant="body2" align="center">
          Need to verify your email?{" "}
          <Link to="/resend-verification">Resend verification email</Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login;
