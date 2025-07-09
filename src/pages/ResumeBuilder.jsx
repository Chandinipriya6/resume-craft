import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingResume = location.state?.resume;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    education: '',
    experience: '',
    template: ''
  });

  const [customSections, setCustomSections] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (editingResume) {
      setFormData({
        name: editingResume.name || '',
        email: editingResume.email || '',
        skills: Array.isArray(editingResume.skills)
          ? editingResume.skills.join(', ')
          : '',
        education: Array.isArray(editingResume.education)
          ? editingResume.education.map(e => e.details || '').join('\n')
          : '',
        experience: Array.isArray(editingResume.experience)
          ? editingResume.experience.map(e => e.details || '').join('\n')
          : '',
        template: editingResume.template || ''
      });
      setCustomSections(editingResume.custom_sections || []);
    }
  }, [editingResume]);

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
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!user || !token) {
        alert('⚠️ You must be logged in to generate a resume.');
        setLoading(false);
        return;
      }

      const transformedSections = customSections.map(section => ({
        heading: section.title,
        content: section.content
      }));

      const response = await axios.post(
        `${API_BASE}/api/generate-resume`,
        { ...formData, customSections: transformedSections },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const raw = response.data.content;
      const jsonText = raw.match(/{[\s\S]+}/)?.[0] || '{}';
      const aiResume = JSON.parse(jsonText);

      console.log("🤖 AI Resume Output:", aiResume);

      aiResume.name = aiResume.name || formData.name || 'Unknown';
      aiResume.email = aiResume.email || formData.email || 'unknown@example.com';
      aiResume.skills = Array.isArray(aiResume.skills)
        ? aiResume.skills
        : typeof aiResume.skills === 'string'
          ? aiResume.skills.split(',').map(s => s.trim())
          : [];
      aiResume.education = Array.isArray(aiResume.education)
        ? aiResume.education
        : [];
      aiResume.experience = Array.isArray(aiResume.experience)
        ? aiResume.experience
        : [];
      aiResume.custom_sections = Array.isArray(aiResume.customSections)
        ? aiResume.customSections
        : [];

      if (!aiResume.name || aiResume.name.trim() === '') {
        alert('❌ Resume name is missing. Please check the AI output.');
        console.error("❌ AI output missing name:", aiResume);
        return;
      }

      const saveEndpoint = `${API_BASE}/api/resumes/save`;

      const resumePayload = {
        user_id: user.id,
        name: aiResume.name,
        email: aiResume.email,
        summary: aiResume.summary || '',
        education: aiResume.education,
        experience: aiResume.experience,
        skills: aiResume.skills,
        custom_sections: aiResume.custom_sections
      };

      console.log("📤 Sending resume data to backend:", resumePayload);

      const saveRes = await axios.post(
        saveEndpoint,
        resumePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resumeId = saveRes.data.resumeId || editingResume?.id;

      navigate('/resume-preview', {
        state: {
          resume: aiResume,
          templateHtml: response.data.templateHtml,
          publicUrl: `${window.location.origin}/resume/${resumeId}`
        }
      });
    } catch (error) {
      console.error('❌ Error generating/saving resume:', error);
      alert('Failed to generate/save resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-builder-page">
      <div className="resume-builder-container">
        {/* Left Form */}
        <div className="resume-builder-left">
          <h2>🎓 Create Your Resume</h2>

          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <textarea name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} />
          <textarea name="education" placeholder="Education" value={formData.education} onChange={handleChange} />
          <textarea name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} />

          {/* Template Selector */}
          <div className="template-selector">
            <label className="template-selector-label">
              🎨 Choose Resume Template
              <select className="template-selector-select" value={formData.template} onChange={(e) => setFormData({ ...formData, template: e.target.value })}>
                <option value="">-- Select Template --</option>
                <option value="template1.html">Template 1</option>
                <option value="template2.html">Template 2</option>
              </select>
            </label>

            {formData.template && (
              <a href={`/templates/${formData.template}`} target="_blank" rel="noopener noreferrer" className="template-preview">
                🔍 Preview Template
              </a>
            )}
          </div>

          {/* Custom Sections */}
          <h3 className="section-heading">➕ Add Custom Sections</h3>
          {customSections.map((section, i) => (
            <div key={i} className="custom-section">
              <input type="text" placeholder="Section Title" value={section.title} onChange={(e) => handleCustomChange(i, 'title', e.target.value)} />
              <textarea placeholder="Details" value={section.content} onChange={(e) => handleCustomChange(i, 'content', e.target.value)} />
            </div>
          ))}

          <button onClick={addCustomSection} className="add-section-btn">+ Add Another Section</button>
          <button onClick={generateResume} className="resume-builder-button">🚀 Generate Resume with AI</button>
        </div>

        {/* Right Preview */}
        <div className="resume-builder-right">
          <h2>📄 Resume Preview</h2>
          {loading ? <p>⏳ Generating your resume...</p> : <p>Fill in the form and click <strong>Generate Resume</strong> to preview.</p>}
        </div>
      </div>
    </div>
  );
}
