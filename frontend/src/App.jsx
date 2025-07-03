import { useState } from "react";
import "./App.css";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import CreatePost from "./components/CreatePost.jsx";
import PostView from "./components/PostView.jsx";
import Profile from "./components/Profile.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import EmailVerification from "./components/EmailVerification.jsx";
import ResendVerification from "./components/ResendVerification.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar data-oid="b:1jqy5" />
      <Routes data-oid="y:ba21x">
        <Route
          path="/"
          element={<Home data-oid="rf6hfs5" />}
          data-oid="-w1yadc"
        />

        <Route
          path="/login"
          element={<Login data-oid="1ee-h1_" />}
          data-oid="utqijr8"
        />

        <Route
          path="/register"
          element={<Register data-oid="a8h2gie" />}
          data-oid="an21kf8"
        />

        <Route
          path="/create-post"
          element={<CreatePost data-oid="o9ytdhu" />}
          data-oid="yyyx_98"
        />

        <Route
          path="/post/:id"
          element={<PostView data-oid="urqmmep" />}
          data-oid="z043hv5"
        />

        <Route
          path="/profile/:id"
          element={<Profile data-oid="qfxclcu" />}
          data-oid="254gfg4"
        />

        <Route
          path="/admin"
          element={<AdminDashboard data-oid="srxc11g" />}
          data-oid="nnqbn_g"
        />

        <Route
          path="/verify-email"
          element={<EmailVerification data-oid="g01f_.f" />}
          data-oid="1yxn2d1"
        />

        <Route
          path="/resend-verification"
          element={<ResendVerification data-oid="fa-fimf" />}
          data-oid="1x.sa6-"
        />
      </Routes>
    </>
  );
}

export default App;
