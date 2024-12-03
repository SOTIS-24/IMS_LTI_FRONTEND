import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css'; 

function LandingPage() {
  const navigate = useNavigate();

  const handleButton1Click = () => {
    navigate(`/teacher-landing-page`);
  };

  const handleButton2Click = () => {
    navigate(`/student-landing-page`);
  };

  return (
    <div className="landing-page">
      <h1>Application for testing</h1>
      <button onClick={handleButton1Click}>Teacher</button>
      <button onClick={handleButton2Click}>Student</button>
    </div>
  );
}

export default LandingPage;
