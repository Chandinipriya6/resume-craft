// ✅ ResumeBuilder.jsx (frontend/src/pages/ResumeBuilder.jsx)
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import JSON5 from 'json5';
import TemplateSelector from '../components/TemplateSelector';
import { supabase } from '../lib/supabase';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', skills: '', education: '', experience: '', template: ''
  });
  const [customSections, setCustomSections] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCustomChange = (i, key, value) => {
    const updated = [...customSections];
    updated[i][key] = value;
    setCustomSections(updated);
  };

  const addCustomSection = () =>
    setCustomSections([...customSections, { title: '', content: '' }]);

  const generateResume = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("⚠️ You must be logged in to generate a resume.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_BASE}/api/generate-resume`, {
        ...formData,
        customSections,
      });

      const raw = response.data.content;
      const jsonText = raw.match(/{[\s\S]+}/)?.[0] || '{}';
      let aiResume = JSON.parse(jsonText);

      // ✅ Ensure safe array structures
      aiResume.skills = Array.isArray(aiResume.skills)
        ? aiResume.skills
        : (typeof aiResume.skills === 'string'
            ? aiResume.skills.split(',').map(s => s.trim())
            : []);

      aiResume.education = Array.isArray(aiResume.education)
        ? aiResume.education
        : [];

      aiResume.experience = Array.isArray(aiResume.experience)
        ? aiResume.experience
        : [];

      aiResume.customSections = Array.isArray(aiResume.customSections)
        ? aiResume.customSections
        : [];

      console.log("🎯 AI Resume Parsed:", aiResume);

      const saveRes = await axios.post(`${API_BASE}/api/resumes/save`, {
        user_id: user.id,
        name: aiResume.name,
        email: aiResume.email,
        summary: aiResume.summary,
        education: aiResume.education,
        experience: aiResume.experience,
        skills: aiResume.skills,
        custom_sections: aiResume.customSections,
        template: formData.template || "template2.html"
      });

      const resumeId = saveRes.data.resumeId;

      navigate('/resume-preview', {
        state: {
          resume: aiResume,
          publicUrl: `${window.location.origin}/resume/${resumeId}`
        }
      });

    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to generate/save resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-resume-builder-bg bg-cover bg-center bg-no-repeat py-12 px-6 font-sans">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 p-10">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">🎓 Create Your Resume</h2>
          <div className="space-y-4 text-gray-700">
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            <textarea name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            <textarea name="education" placeholder="Education" value={formData.education} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            <textarea name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />

            <TemplateSelector
              selectedTemplate={formData.template}
              setSelectedTemplate={(value) => setFormData({ ...formData, template: value })}
            />

            {formData.template && (
              <a
                href={`https://vrefqdogglobhsccfstr.supabase.co/storage/v1/object/public/resume-templates/templates/${formData.template}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-1 block"
              >
                🔍 Preview Template
              </a>
            )}

            <div className="space-y-3">
              <h3 className="text-md font-semibold text-gray-800">➕ Add Custom Sections</h3>
              {customSections.map((section, i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-md">
                  <input
                    type="text"
                    placeholder="Section Title"
                    value={section.title}
                    onChange={(e) => handleCustomChange(i, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                  <textarea
                    placeholder="Details"
                    value={section.content}
                    onChange={(e) => handleCustomChange(i, 'content', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
              <button onClick={addCustomSection} className="text-blue-700 hover:underline text-sm">
                + Add Another Section
              </button>
            </div>

            <button
              onClick={generateResume}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-md"
            >
              🚀 Generate Resume with AI
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📄 Resume Preview</h2>
          {loading ? (
            <p className="italic text-gray-600">⏳ Generating your resume...</p>
          ) : (
            <p className="text-gray-600">Fill in the form and click Generate Resume to preview.</p>
          )}
        </div>
      </div>
    </div>
  );
}
