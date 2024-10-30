import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { environment } from '../../env/environment';
import './Test.css';

const Test = () => {
  const { id } = useParams(); //  id koji sam poslala kroz url
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(environment.apiHost + `tests/${id}`);
        if (!response.ok) {
          throw new Error('Greška prilikom dobijanja testa');
        }
        const data = await response.json();
        setTest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (error) {
    return <div>Greška: {error}</div>;
  }

  return (
    <div className="test-detail">
      <h2>{test.name}</h2>
      <p>{test.description}</p>
      <ul>
        {test.questions.map((question, index) => (
          <li key={question.id}>
            <h4>{index + 1}. {question.text} <span>({question.points} bodova)</span></h4>
            <ul>
              {question.answers.map((answer) => (
                <li key={answer.id}>
                  <p>{answer.text}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
