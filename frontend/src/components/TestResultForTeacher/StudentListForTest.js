import React, { useState, useEffect } from 'react';
import { environment } from '../../env/environment';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './StudentListForTest.css'; 

const StudentListForTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(environment.apiHost + `testResults/students/`+ testId);  
        if (!response.ok) {
          throw new Error('Greška prilikom dobijanja studenta koji su uradili test');
        }
        const data = await response.json();
        setStudents(data);  
      } catch (err) {
        setError(err.message);  
      } finally {
        setLoading(false);  
      }
    };

    fetchStudents();
  }, [testId]); 


  const handleSeeResultForStudentClick = () => {
    navigate(`/tests`);
  };

  if (loading) {
    return <div>Učitavanje rezultata...</div>;  
  }

  if (error) {
    return <div>Greška: {error}</div>;  
  }

  if (!students) {
    return <div>Rezultati nisu dostupni</div>;  
  }

  const handleFinishResultClick = () => {
    navigate(`/test-result-details-teacher/` + testId);
  };

  return (
    <div className="test-detail container mt-5">
      <h2 className="text-center mb-4">Studenti koji su rešavali test</h2>   
    
      <ul className="list-group">
        {students.students.map((student, index) => (
          <li key={student} className="list-group-item question-item">
            <Link to={`/test-result-student/${students.testId}/${student}`} className={`card-title link-hover`}>
                <h4>{student}
                </h4>
            </Link>

            <hr />
          </li>
        ))}
      </ul>
      <button type="button" className="btn-add btn-outline-primary btn-center" onClick={() => handleFinishResultClick()}>ZAVRŠI PREGLED STUDENATA</button>

    </div>
  );
};

export default StudentListForTest;
