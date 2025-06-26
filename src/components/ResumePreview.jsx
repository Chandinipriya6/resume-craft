import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

export default function ResumePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resume, publicUrl } = location.state || {};
  const [templateHtml, setTemplateHtml] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchFilledTemplate = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/render-template`, {
          template: resume.template, // e.g. "template1.html"
          data: resume
        });
        setTemplateHtml(res.data);
      } catch (err) {
        console.error('❌ Error rendering template:', err);
        alert('Failed to render resume template');
      } finally {
        setLoading(false);
      }
    };

    if (resume && resume.template) {
      fetchFilledTemplate();
    } else {
      setLoading(false);
    }
  }, [resume]);

  if (!resume || !resume.template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <div className="text-center">
          <h2 className="text-xl font-bold">⚠️ Missing Resume Data</h2>
          <p className="mb-4">Please go back and generate a resume first.</p>
          <button
            onClick={() => navigate('/resume-builder')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            ← Back to Builder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">📄 Final Resume Preview</h1>
        {loading ? (
          <p>Loading preview...</p>
        ) : (
          <div
            className="prose prose-sm sm:prose lg:prose-lg max-w-full"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(templateHtml) }}
          />
        )}
      </div>
    </div>
  );
}
