import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581091870630-cd1f231f5ba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')"
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-0" />

      {/* Main layout */}
      <div className="relative z-10 flex flex-col min-h-screen font-sans">

        {/* 🔹 Top Navigation */}
        <header className="flex justify-between items-center px-8 py-6">
          <h1 className="text-3xl font-bold tracking-tight">📄 ResumeCraft</h1>
          <nav className="space-x-8 text-lg">
            <button
              className="hover:text-yellow-300 transition"
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button
              className="hover:text-yellow-300 transition"
              onClick={() => alert('ℹ️ About section coming soon!')}
            >
              About
            </button>
          </nav>
        </header>

        {/* 🔹 Middle Hero Section */}
        <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            🎯 Build Resumes That Get You Hired
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mb-10 text-gray-200">
            Craft professional, AI-enhanced resumes with ease. Launch your career faster and smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => navigate('/resume-builder')}
              className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md hover:bg-yellow-300 transition"
            >
              ✍️ Create New Resume
            </button>
            <button
              onClick={() => alert('Resume updater is coming soon!')}
              className="border border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-black transition"
            >
              🔄 Update Existing Resume
            </button>
          </div>
        </main>

        {/* 🔹 Footer */}
        <footer className="text-center text-sm py-4 text-gray-400 bg-black/40">
          <p>&copy; {new Date().getFullYear()} ResumeCraft. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
