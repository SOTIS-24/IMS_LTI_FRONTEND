import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function TeacherLandingPage() {
  const navigate = useNavigate();
  const { role, username, courseId } = useParams();

  useEffect(() => {
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    localStorage.setItem("courseId", courseId);
    console.log(localStorage.role);
  }, [role, username, courseId]);

  const handleMyTestsClick = () => {
    navigate(`/tests`);
  };

  const handleNewTestClick = () => {
    navigate(`/test-form/-1`);
  };

  return (
    <div className="container-fluid d-flex flex-column" style={{ height: '100vh' }}>
      <h1 className="text-center mt-5 mb-5" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#333' }}>Aplikacija za testiranje znanja</h1>

      <div className="row flex-fill d-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* prikaz testova opcija */}
        <div className="col d-flex justify-content-center align-items-center" 
             style={{
               background: 'linear-gradient(135deg, #B9E0FF, #E3F2FD)', 
               height: '100%', 
               boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.15)',
               borderRadius: '12px',
               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
               padding: '20px'
             }}
        >
          <div className="text-center">
            <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '16px', transition: '0.3s' }} 
                    onClick={handleMyTestsClick}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Pregled postojećih testova
            </button>
          </div>
        </div>

        {/* kreiranje novog testa opcija */}
        <div className="col d-flex justify-content-center align-items-center" 
             style={{
               background: 'linear-gradient(135deg, #C8E6C9, #E8F5E9)', 
               height: '100%',
               boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.15)',
               borderRadius: '12px',
               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
               padding: '20px'
             }}
        >
          <div className="text-center">
            <button className="btn btn-success" style={{ padding: '10px 20px', fontSize: '16px', transition: '0.3s' }} 
                    onClick={handleNewTestClick}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#388E3C'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
            >
              Kreiranje novog testa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherLandingPage;
