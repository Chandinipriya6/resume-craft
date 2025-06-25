// Resume preview UI before downloadimport React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResumePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resume, templateHtml } = location.state || {};

  // Function to replace {{placeholders}} in the template
  const fillTemplate = (template, data) => {
    if (!template) return '<p>⚠️ No template selected</p>';

    let filled = template;

    // Basic fields
    filled = filled.replace(/{{name}}/g, data.name || '');
    filled = filled.replace(/{{email}}/g, data.email || '');
    filled = filled.replace(/{{skills}}/g, (data.skills || []).join(', '));
    filled = filled.replace(/{{education}}/g, Array.isArray(data.education)
      ? data.education.map(e => `${e.degree} at ${e.university} (${e.years})`).join('<br/>')
      : data.education || ''
    );
    filled = filled.replace(/{{experience}}/g, Array.isArray(data.experience)
      ? data.experience.map(e => `${e.title} at ${e.company} (${e.years}) - ${e.description}`).join('<br/>')
      : data.experience || ''
    );

    // You can also add custom sections handling here if needed

    return filled;
  };

  if (!resume || !templateHtml) {
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

  const filledHtml = fillTemplate(templateHtml, resume);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">📄 Final Resume Preview</h1>
        <div
          className="prose prose-sm sm:prose lg:prose-lg max-w-full"
          dangerouslySetInnerHTML={{ __html: filledHtml }}
        />
      </div>
    </div>
  );
}
