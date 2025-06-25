import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import ResumeBuilder from './pages/ResumeBuilder';
import Dashboard from './pages/Dashboard';
import PublicResume from './pages/PublicResume';
import ResumePreview from './pages/ResumePreview';
import Home from './pages/Home';
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resume-builder" element={<ResumeBuilder />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume/:id" element={<PublicResume />} />
      <Route path="/resume-preview" element={<ResumePreview />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
