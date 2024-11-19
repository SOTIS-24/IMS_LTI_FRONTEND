import React, { useState, useEffect } from 'react';
import { environment } from '../../env/environment';
import { Link, useNavigate } from 'react-router-dom';
import './TestList.css';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      const response = await fetch(environment.apiHost + 'tests');
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

  const handleEditClick = (testId) => {
    navigate(`/test-form/${testId}`);
  };

  const handleDeleteClick = async (e, test) => {
    e.preventDefault();

    try {
      const method = 'PUT'; 
      const url = `${environment.apiHost}tests/delete`;
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test),
      });

      if (!response.ok) {
        throw new Error("Greška prilikom brisanja testa");
      }

      const deletedTest = await response.text();
      fetchTests();
   
      console.log("Deleted test");
      

      // Redirect to tests list page after successful save
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="test-list">
    <h2>Lista testova</h2>
    <ul>
      {tests.map((test) => (
        <li key={test.id} className="test-item">
          <div className="test-info">
            <Link to={`/tests/${test.id}`}>
              <h3>{test.name}</h3>
              <p>{test.description}</p>
            </Link>
          </div>
          <div className="test-actions">
            <button className="edit-button" onClick={() => handleEditClick(test.id)}>Edit</button>
            <button className="delete-button" onClick={(e) => handleDeleteClick(e, test)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </div>  
  );
};

export default TestList;
