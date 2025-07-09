// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../index.css";


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 🔝 Navigation Bar */}
      <header className="navbar">
        <h1 className="logo">📄 ResumeCraft</h1>
        <nav className="nav-links">
          
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        
        </nav>
      </header>

      {/* 🎯 Hero Section */}
      <main className="hero">
        <h2>🚀 Create Stunning AI-Generated Resumes</h2>
        <p>
          ResumeCraft helps you design job-winning resumes in minutes using smart templates and AI assistance.
        </p>
        <div className="buttons">
          <button className="primary" onClick={() => navigate('/resume-builder')}>✍️ Create New Resume</button>
          <button className="secondary" onClick={() => navigate('/my-resumes')}>🔄 Update Existing Resume</button>
        </div>
      </main>

      {/* 👣 Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} ResumeCraft. All rights reserved.
      </footer>
    </div>
  );
}