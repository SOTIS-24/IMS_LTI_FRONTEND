import React, { useState, useEffect } from 'react';
import { environment } from '../../env/environment';
import { Link } from 'react-router-dom';
import './TestList.css';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchTests();
  }, []);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (error) {
    return <div>Greška: {error}</div>;
  }

  return (
    <div className="test-list">
      <h2>Lista testova</h2>
      <ul>
        {tests.map((test) => (
          <li key={test.id}>
            <Link to={`/tests/${test.id}`}>
              <h3>{test.name}</h3>
              <p>{test.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestList;
