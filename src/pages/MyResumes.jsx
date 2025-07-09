import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function MyResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch resumes
  const fetchResumes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (error || !user) {
        console.error("❌ Supabase Auth Error:", error);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/resumes/user/${user.id}`
      );

      if (!Array.isArray(response.data)) {
        console.error("❌ Unexpected response format:", response.data);
        return;
      }

      setResumes(response.data);
    } catch (err) {
      console.error("❌ Error fetching resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete a resume
  const handleDelete = async (resumeId) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("❌ Please log in to delete.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/resumes/delete/${resumeId}`,
        {
          headers: {
            'x-user-id': user.id
          }
        }
      );

      if (response.data.success) {
        alert("✅ Resume deleted!");
        fetchResumes(); // Refresh
      } else {
        console.error("❌ Delete error:", response.data.error);
        alert("❌ Failed to delete resume.");
      }
    } catch (err) {
      console.error("❌ Delete request failed:", err.message);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">📂 My Saved Resumes</h1>

      {loading ? (
        <p>⏳ Loading resumes...</p>
      ) : resumes.length === 0 ? (
        <p className="text-gray-600">😕 No resumes found. Create one now!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-xl transition duration-200"
            >
              <h2 className="text-xl font-semibold mb-2">{resume.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{resume.email}</p>
              <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                {resume.summary}
              </p>

              <div className="flex justify-between items-center gap-2">
                {/* 🔍 View Resume */}
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() =>
                    navigate('/resume-preview', {
                      state: {
                        resume: resume,
                        templateHtml: '', // Optional: Load saved template if available
                        publicUrl: '',     // Optional: Shareable link
                      }
                    })
                  }
                >
                  👁️ View
                </button>

                {/* ❌ Delete Resume */}
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => handleDelete(resume.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
