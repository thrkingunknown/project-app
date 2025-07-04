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
      <Navbar data-oid="wfu5asr" />
      <Routes data-oid="cqsnbin">
        <Route
          path="/"
          element={<Home data-oid="h36e:1k" />}
          data-oid="tso544z"
        />

        <Route
          path="/login"
          element={<Login data-oid="c5qmx59" />}
          data-oid="h5lxtu7"
        />

        <Route
          path="/register"
          element={<Register data-oid="5fgynno" />}
          data-oid="8k108zy"
        />

        <Route
          path="/create-post"
          element={<CreatePost data-oid="5c:fyle" />}
          data-oid="9.2e-m-"
        />

        <Route
          path="/post/:id"
          element={<PostView data-oid="5uqtbqj" />}
          data-oid="e1x32oh"
        />

        <Route
          path="/profile/:id"
          element={<Profile data-oid="xrdl9ck" />}
          data-oid="xn4dec6"
        />

        <Route
          path="/admin"
          element={<AdminDashboard data-oid=":5pjzdp" />}
          data-oid="3_74udv"
        />

        <Route
          path="/verify-email"
          element={<EmailVerification data-oid="cy9td2t" />}
          data-oid="ax.fhp1"
        />

        <Route
          path="/resend-verification"
          element={<ResendVerification data-oid="g7dfw8u" />}
          data-oid="xz2uset"
        />
      </Routes>
    </>
  );
}

export default App;
