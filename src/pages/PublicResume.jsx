import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const TEMPLATE_BASE = "https://vrefqdogglobhsccfstr.supabase.co/storage/v1/object/public/resume-templates/templates";

function PublicResume() {
  const { id } = useParams();
  const [html, setHtml] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get resume data from your backend
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/resumes/${id}`);
        const resume = res.data.resume;

        // 2. Determine template name (optional default fallback)
        const template = resume.template || "template2.html";

        // 3. Fetch the HTML template from Supabase Storage
        const htmlRes = await fetch(`${TEMPLATE_BASE}/${template}`);
        let htmlContent = await htmlRes.text();

        // 4. Replace placeholders with fallback checks
        htmlContent = htmlContent
          .replace(/{{name}}/g, resume.name || "")
          .replace(/{{email}}/g, resume.email || "")
          .replace(/{{summary}}/g, resume.summary || "")
          .replace(/{{skills}}/g, Array.isArray(resume.skills) ? resume.skills.join(', ') : "")
          .replace(/{{education}}/g,
            Array.isArray(resume.education)
              ? resume.education.map(e => `${e.degree} at ${e.university} (${e.years})`).join('<br>')
              : ""
          )
          .replace(/{{experience}}/g,
            Array.isArray(resume.experience)
              ? resume.experience.map(e => `${e.role} at ${e.company} (${e.years})`).join('<br>')
              : ""
          );

        // 5. Fix the CSS path
        if (template === "template2.html") {
          htmlContent = htmlContent.replace(`href="template2.css"`, `href="${TEMPLATE_BASE}/template2.css"`);
        }
        if (template === "template3.html") {
          htmlContent = htmlContent.replace(`href="template3.css"`, `href="${TEMPLATE_BASE}/template3.css"`);
        }

        setHtml(htmlContent);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load resume preview");
      }
    };

    fetchData();
  }, [id]);

  if (!html) return <p className="text-center mt-10">🔄 Loading resume preview...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-4 shadow rounded">
        <iframe
          title="Resume Preview"
          srcDoc={html}
          className="w-full h-[1200px] border rounded"
        />
      </div>
    </div>
  );
}

export default PublicResume;
