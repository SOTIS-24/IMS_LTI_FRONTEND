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
    <div className="container mt-5">
      <h2>Testovi</h2>
      <div className="row">
        {tests.map((test) => {
          const fontColor = 'text-success';
            return (
            <div key={test.id} className="col-12 mb-4">
              <div className="card shadow-sm rounded card-hover">
                <div className="card-body d-flex flex-column">
                  <Link to={`/tests/${test.id}`} className={`card-title ${fontColor} link-hover`}>
                    <h5>{test.name}</h5>
                  </Link>
                  <p className="card-text">{test.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="card-text"><small className="text-muted">Teacher email: {test.teacherUsername}</small></p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>


  );
}

export default StudentLandingPage;
