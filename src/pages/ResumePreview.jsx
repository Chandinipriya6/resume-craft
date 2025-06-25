import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import QRCode from 'react-qr-code';

export default function ResumePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const resume = location.state?.resume;

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-100">
        <p className="text-red-600 font-semibold text-lg">❌ No resume data found.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
          ← Go Back
        </button>
      </div>
    );
  }

  const downloadPDF = () => {
    const element = document.getElementById('resume-content');
    const opt = {
      margin: 0.5,
      filename: `${resume.name?.replace(/\s/g, '_') || 'resume'}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center mb-4 rounded-md">
        <h1 className="text-xl font-semibold text-blue-700">📄 Resume Preview</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/resume-builder')}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Resume Content */}
      <div
        id="resume-content"
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-300"
      >
        {/* Header */}
        <div className="text-center border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">{resume.name}</h1>
          <p className="text-sm text-gray-600">{resume.email}</p>
          <p className="italic text-gray-700 mt-2">{resume.summary}</p>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">🎓 Education</h2>
          {Array.isArray(resume.education) ? (
            resume.education.map((edu, i) => (
              <p key={i} className="text-gray-800">
                📘 <strong>{edu.degree}</strong> at {edu.university} ({edu.years})
              </p>
            ))
          ) : (
            <p className="text-gray-700">{resume.education}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">💼 Experience</h2>
          {Array.isArray(resume.experience) ? (
            resume.experience.map((exp, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-gray-800">
                  🏢 {exp.title} at {exp.company}{' '}
                  <span className="text-sm text-gray-500">({exp.years})</span>
                </p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">{resume.experience}</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">🛠 Skills</h2>
          <ul className="list-disc list-inside text-gray-800">
            {resume.skills?.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Custom Sections */}
        {resume.customSections?.map((section, i) => (
          <div key={i}>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">📌 {section.heading}</h2>
            {typeof section.content === 'string' ? (
              <p className="text-gray-800">{section.content}</p>
            ) : Array.isArray(section.content) ? (
              section.content.map((item, idx) => (
                <div key={idx} className="mb-2">
                  {item.title && (
                    <p className="font-semibold text-gray-800">{item.title}</p>
                  )}
                  {item.tools && (
                    <p className="text-sm italic text-gray-600">{item.tools}</p>
                  )}
                  {item.description && (
                    <p className="text-gray-700">{item.description}</p>
                  )}
                </div>
              ))
            ) : (
              <pre className="text-gray-600 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(section.content, null, 2)}
              </pre>
            )}
          </div>
        ))}

        {/* QR Code and Signature */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            <h4 className="font-semibold mb-2">📱 Scan to View Online</h4>
            <QRCode value={resume.publicUrl || resume.linkedin || 'https://your-resume-link.com'} size={80} />
          </div>
          <div className="text-right">
            <p className="font-handwritten text-3xl text-gray-600">~ {resume.name}</p>
            <p className="text-sm">Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
