import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import ResumeBuilder from './pages/ResumeBuilder';
import Dashboard from './pages/Dashboard';
import PublicResume from './pages/PublicResume';
import ResumePreview from './pages/ResumePreview';
import Home from './pages/Home';

// Optional: Simple NotFound page
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
      <Route path="*" element={<NotFound />} /> {/* ✅ Catch-all route */}
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
