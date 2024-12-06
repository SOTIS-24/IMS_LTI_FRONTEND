import React, { useState, useEffect} from 'react';
import { environment } from '../../env/environment';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './StudentLandingPage.css'; 

function StudentLandingPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { role, username, courseId } = useParams();

  useEffect(() => {
      localStorage.setItem("role", role)
      localStorage.setItem("username", username)
      localStorage.setItem("courseId", courseId)
      
  }, [role, username, courseId]);


  const fetchTests = async () => {
    try {
      const response = await fetch(environment.apiHost + 'tests/forStudent/' + username + "/" + courseId);
      if (!response.ok) {
        throw new Error('Greška prilikom dobijanja testova');
      }
      const data = await response.json();
      setTests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchTests();
  }, []);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (error) {
    return <div>Greška: {error}</div>;
  }

  return (
    <div className="student-landing-page">
      <h1>Available Tests</h1>
      <ul>
      {tests.map((test) => 
      {
      return(
        <li key={test.id} className="test-item" >
          <div className="test-info">
            <Link to={`/tests/${test.id}`}>
              <h3 >{test.name}</h3>
              <p>{test.description}</p>
            </Link>
          </div>
        </li>
      )})}
    </ul>
    </div>
  );
}

export default StudentLandingPage;
