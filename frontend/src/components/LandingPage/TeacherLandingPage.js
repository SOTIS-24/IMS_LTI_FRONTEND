import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './TeacherLandingPage.css'; 

function TeacherLandingPage() {
  const navigate = useNavigate();

  const { role, username, courseId } = useParams();

  useEffect(() => {
      localStorage.setItem("role", role)
      localStorage.setItem("username", username)
      localStorage.setItem("courseId", courseId)

      console.log(localStorage.role)
  }, [role, username, courseId]);

  const handleMyTestsClick = () => {
    navigate(`/tests`);
  };

  const handleNewTestClick = () => {
    navigate(`/test-form/-1`);
  };

  return (
    <div className="teacher-landing-page">
      <h1>Welcome!</h1>

      <div>
        <button className="button" onClick={handleMyTestsClick}>My Test</button>
        <button className="button" onClick={handleNewTestClick}>New Test</button>
      </div>
    </div>
  );
}

export default TeacherLandingPage;
