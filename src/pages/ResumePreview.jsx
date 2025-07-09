import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { createClient } from '@supabase/supabase-js';

// ✅ Supabase client setup
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function ResumePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resume, templateHtml, publicUrl } = location.state || {};
  const iframeRef = useRef(null);

  // ✅ Auto-save resume to Supabase
  useEffect(() => {
    const saveResumeToSupabase = async () => {
      if (!resume) return;

      const {
        name,
        email,
        summary = '',
        education = [],
        experience = [],
        skills = [],
        custom_sections = []
      } = resume;

      // ✅ Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (userError || !user) {
        console.error("❌ Supabase Auth Error:", userError?.message);
        return;
      }

      const user_id = user.id;

      // ✅ Remove `id` if it exists to avoid duplicate key error
      const { id, ...safeResume } = resume;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id,
            ...safeResume,
          })
        });

        const result = await response.json();
        if (result.success) {
          console.log("✅ Resume saved with ID:", result.resumeId);
        } else {
          console.error("❌ Save Error:", result.error);
        }
      } catch (err) {
        console.error("❌ Network Error:", err.message);
      }
    };

    saveResumeToSupabase();
  }, [resume]);

  // ✅ PDF download
  const downloadPDF = () => {
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    if (!iframeDoc) return alert("❌ Could not access resume content.");

    const element = iframeDoc.body;
    const opt = {
      margin: 0,
      filename: `${resume.name?.replace(/\s/g, '_') || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // ✅ Error fallback
  if (!resume || !templateHtml) {
    return (
      <div className="preview-error-page">
        <p className="error-text">❌ No resume or template found.</p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="preview-wrapper">
      {/* 🔝 Top Action Bar */}
      <div className="preview-topbar">
        <h1 className="preview-heading">📄 Resume Preview</h1>
        <div className="preview-buttons">
          <button onClick={() => navigate('/resume-builder')} className="back-button">
            ← Back
          </button>
          <button onClick={downloadPDF} className="download-button">
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* 🔳 Resume Iframe */}
      <div className="preview-iframe-container">
        <iframe
          ref={iframeRef}
          title="Resume Template"
          srcDoc={templateHtml}
          sandbox=""
          style={{ width: '100%', height: '1000px', border: 'none' }}
        />
      </div>
    </div>
  );
}
