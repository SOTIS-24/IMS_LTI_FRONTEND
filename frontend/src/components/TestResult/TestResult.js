import React, { useState, useEffect } from 'react';
import { environment } from '../../env/environment';


const TestResult = ({ testId }) => {
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

  const getAnswerClass = (answer, isSelected, isCorrect) => {
    if (isSelected && isCorrect) {
      return 'correct-answer'; 
    }
    if (isSelected && !isCorrect) {
      return 'incorrect-answer'; 
    }
    if (!isSelected && isCorrect) {
      return 'correct-answer'; 
    }
    return ''; 
  };

  if (loading) {
    return <div>Učitavam rezultate...</div>;  
  }

  if (error) {
    return <div>Greška: {error}</div>;  
  }

  if (!testResult) {
    return <div>Rezultati nisu dostupni</div>;  
  }

  return (
    <div className="test-detail container mt-5">
      <h2 className="text-center mb-4">Rezultat testa</h2>
      <p className="text-center mb-5">Test: {testResult.testName}</p>

      <ul className="list-group">
        {testResult.questionResults.map((question, index) => (
          <li key={question.id} className="list-group-item question-item">
            <h4>{index + 1}. {question.text} 
              <span className="text-muted"> ({question.points} poena)</span>
            </h4>

            {/* odabrani odgovori */}
            <div className="selected-answers">
              <h5>Odabrani odgovori:</h5>
              <ul className="list-group">
                {question.answerResults.map((answer, idx) => (
                  <li key={idx} className={`list-group-item ${getAnswerClass(answer, answer.isSelected, answer.isCorrect)}`}>
                    <p>{answer.text} - {answer.points} poena</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* ttacni odgovori */}
            <div className="correct-answers">
              <h5>Tačni odgovori:</h5>
              <ul className="list-group">
                {question.answerResults.filter(a => a.isCorrect).map((answer, idx) => (
                  <li key={idx} className="list-group-item correct-answer">
                    <p>{answer.text} - {answer.points} poena</p>
                  </li>
                ))}
              </ul>
            </div>

            <hr />
            <p><strong>Bodovi za pitanje:</strong> {question.pointsAchieved} / {question.maxPoints}</p>
          </li>
        ))}
      </ul>

      <h4 className="text-center mt-4">Ukupni bodovi: {testResult.totalPoints} / {testResult.maxTotalPoints}</h4>
    </div>
  );
};

export default TestResult;
