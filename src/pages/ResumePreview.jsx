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
