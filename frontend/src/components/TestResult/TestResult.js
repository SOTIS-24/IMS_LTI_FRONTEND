import React, { useState, useEffect } from 'react';
import { environment } from '../../env/environment';
import { useParams, useNavigate } from 'react-router-dom';
import './TestResult.css'; 

const TestResult = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        const username = localStorage.username;
        const response = await fetch(environment.apiHost + `testResults/result-details/` + username +  `/` + testId);  
        if (!response.ok) {
          throw new Error('Greška prilikom dobijanja rezultata testa');
        }
        const data = await response.json();
        setTestResult(data);  
      } catch (err) {
        setError(err.message);  
      } finally {
        setLoading(false);  
      }
    };

    fetchTestResult();
  }, [testId]); 

  const getAnswerClass = (answer) => {
    return answer.isCorrect ? 'correct-answer' : 'incorrect-answer'; 
  };

  const handleFinishResultClick = () => {
    navigate(`/student-landing-page/` + localStorage.role + `/` + localStorage.username + `/` + localStorage.courseId);
  };

  

  if (loading) {
    return <div>Učitavanje rezultata...</div>;  
  }

  if (error) {
    return <div>Greška: {error}</div>;  
  }

  if (!testResult) {
    return <div>Rezultati nisu dostupni</div>;  
  }

  

  return (
    <div className="test-detail container mt-5">
      <h2 className="text-center mb-4">Rezultat testa</h2>                 {/* dodati naslov testa..I POPRAVITI PRIKAZ ODARBANIH I TACNIH SVIH ODG*/}

      <ul className="list-group">
        {testResult.questionResults.map((questionResult, index) => (
          <li key={questionResult.id} className="list-group-item question-item">
            <h4>{index + 1}. {questionResult.question.text} 
              <span className="text-muted"> ({questionResult.points} poena)</span>
            </h4>

            {/* Odabrani odgovori */}
            <div className="selected-answers">
              <h5>Odabrani odgovori:</h5>
              <ul className="list-group">
                {questionResult.answers.map((answer, idx) => (
                  <li key={idx} className={`list-group-item ${getAnswerClass(answer)}`}>
                    <p>{answer.text} - {answer.points} poena</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="correct-answers">
              <h5>Tačni odgovori:</h5>
              <ul className="list-group">
                {questionResult.question.answers.filter(answer => answer.isCorrect).map((answer, idx) => (
                  <li key={idx} className="list-group-item correct-answer">
                    <p>{answer.text} - {answer.points} poena</p>
                  </li>
                ))}
              </ul>
            </div>


            <hr />
            <p><strong>Bodovi za pitanje:</strong> {questionResult.points} / {questionResult.question.points}</p>
          </li>
        ))}
      </ul>

      <h4 className="text-center mt-4">Ukupni bodovi: {testResult.points} / {testResult.questionResults.reduce((sum, q) => sum + q.points, 0)}</h4>

      <button type="button" className="btn-add btn-outline-primary btn-center" onClick={() => handleFinishResultClick()}>ZAVRŠI PREGLED REZULTATA</button>

    </div>
  );
};

export default TestResult;
