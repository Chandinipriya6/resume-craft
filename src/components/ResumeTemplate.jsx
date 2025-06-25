// components/ResumeTemplate.jsx
import React from 'react';

export default function ResumeTemplate({ resume }) {
  if (!resume) return null;

  const { name, email, summary, education, experience, skills, customSections } = resume;

  return (
    <div className="space-y-4 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-blue-700">{name}</h1>
      <p className="text-md text-gray-600">{email}</p>

      {summary && (
        <>
          <h2 className="text-xl font-semibold text-blue-600 mt-4">Summary</h2>
          <p>{summary}</p>
        </>
      )}

      {education && education.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-blue-600 mt-4">Education</h2>
          <ul className="list-disc ml-6">
            {education.map((edu, index) => (
              <li key={index}>
                {edu.degree}, {edu.university} ({edu.years})
                {edu.gpa && <span> — GPA: {edu.gpa}</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {experience && experience.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-blue-600 mt-4">Experience</h2>
          <ul className="list-disc ml-6">
            {experience.map((exp, index) => (
              <li key={index}>
                <strong>{exp.title}</strong> at {exp.company} ({exp.years})<br />
                <span className="text-gray-600">{exp.description}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {skills && skills.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-blue-600 mt-4">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <li key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </>
      )}

      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold text-blue-600 mt-4">{section.heading}</h2>
              <p>{section.content}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
