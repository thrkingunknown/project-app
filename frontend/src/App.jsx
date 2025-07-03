import { useState } from 'react'
import './App.css'
import Home from './components/Home.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import CreatePost from './components/CreatePost.jsx'
import PostView from './components/PostView.jsx'
import Profile from './components/Profile.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import EmailVerification from './components/EmailVerification.jsx'
import ResendVerification from './components/ResendVerification.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
     <Navbar />
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostView />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/resend-verification" element={<ResendVerification />} />
     </Routes>
    </>
  )
}

export default App
