import React from "react";
import { Button, TextField, Typography, Paper, Alert, Container } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  var navigate = useNavigate();
  var [data, setData] = useState({ username: "", email: "", password: "" });
  var [message, setMessage] = useState("");
  var [isError, setIsError] = useState(false);

  var inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  var submitHandler = () => {
    console.log("register data", data);
    setMessage("");
    setIsError(false);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, data)
      .then((response) => {
        console.log("Registration successful:", response.data);
        setMessage(response.data);
        setIsError(false);
        // Don't navigate immediately, let user see the message
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error registering:", error);
        setMessage("Error registering user");
        setIsError(true);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Paper style={{ padding: '30px', maxWidth: '400px', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Join FAXRN
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Create your account to start participating in discussions
        </Typography>
        <br />

        {message && (
          <>
            <Alert severity={isError ? "error" : "success"}>
              {message}
            </Alert>
            <br />
          </>
        )}
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          name="username"
          value={data.username}
          onChange={inputHandler}
          fullWidth
          margin="normal"
        />
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
          Register
        </Button>
        <br />
        <br />
        <Typography variant="body2" align="center">
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Register;
