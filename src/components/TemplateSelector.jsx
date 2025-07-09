import React, { useEffect, useState } from 'react';

// ✅ Load from React's public/templates folder (hosted by Vercel or locally)
const LOCAL_TEMPLATE_URL = '/templates/';

export default function TemplateSelector({ selectedTemplate, setSelectedTemplate }) {
  const [templateList, setTemplateList] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    setLoadingTemplates(true);
    setTemplateList([
      { name: 'Modern Template', file: 'template1.html' },
      { name: 'Professional Template', file: 'template2.html' },
      { name: 'Creative Template', file: 'template3.html' },
    ]);
    setLoadingTemplates(false);
  }, []);

  return (
    <div className="mb-6">
      <label htmlFor="template-select" className="block font-semibold text-gray-800 mb-2">
        🎨 Choose Resume Template
      </label>

      <select
        id="template-select"
        className="w-full border border-gray-300 p-2 rounded"
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
      >
        <option value="">-- Select Template --</option>
        {templateList.map((tpl, index) => (
          <option key={index} value={tpl.file}>
            {tpl.name}
          </option>
        ))}
      </select>

      {selectedTemplate && (
        <div className="mt-4">
          <label className="block font-semibold text-gray-700 mb-2">🖼 Preview</label>
          <iframe
            src={`${LOCAL_TEMPLATE_URL}${selectedTemplate}`}
            title="Template Preview"
            className="w-full h-96 border rounded shadow"
          ></iframe>
        </div>
      )}

      {!selectedTemplate && !loadingTemplates && (
        <p className="text-gray-500 text-sm mt-2">Select a template to preview it here.</p>
      )}
    </div>
  );
}
