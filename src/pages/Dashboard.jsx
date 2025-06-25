import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>🚀 <strong>Job-Winning Resume Templates</strong></h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Get hired 2x faster using professionally designed templates and expert-backed resume suggestions.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/resume-builder')} 
          style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', border: 'none' }}
        >
          Create New Resume
        </button>

        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', borderRadius: '5px', border: 'none' }}
        >
          Optimize My Resume
        </button>
      </div>

      <img src="/sample-resume.png" alt="Sample Resume" width="300" />
    </div>
  );
};

export default Dashboard;
