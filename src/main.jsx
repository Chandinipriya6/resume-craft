import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import ResumeBuilder from './pages/ResumeBuilder';
import Dashboard from './pages/Dashboard';
import PublicResume from './pages/PublicResume';
import ResumePreview from './pages/ResumePreview';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import MyResumes from './pages/MyResumes';
//import About from './pages/About';
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
    404 - Page Not Found
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resume-builder" element={<ResumeBuilder />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume/:id" element={<PublicResume />} />
      <Route path="/resume-preview" element={<ResumePreview />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/my-resumes" element={<MyResumes />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// ✅ Export App for consistent HMR behavior
export default App;

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
