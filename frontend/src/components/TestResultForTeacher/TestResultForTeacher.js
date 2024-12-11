import React, { useState, useEffect } from 'react';
import { environment } from '../../env/environment';
import { useParams, useNavigate } from 'react-router-dom';
import './TestResultForTeacher.css'; 

const TestResultForTeacher = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [testStatistics, setTestStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(environment.apiHost + `testResults/result-statistics/`+ testId);  
        if (!response.ok) {
          throw new Error('Greška prilikom dobijanja rezultata testa');
        }
        const data = await response.json();
        setTestStatistics(data);  
      } catch (err) {
        setError(err.message);  
      } finally {
        setLoading(false);  
      }
    };

    fetchTest();
  }, [testId]); 

  const getAnswerClass = (answer) => {
    return answer.isCorrect ? 'correct-answer' : 'incorrect-answer'; 
  };

  const handleFinishResultClick = () => {
    navigate(`/tests`);
  };

  const getPercentage = (questionId, answerId) => {
   //console.log(testStatistics.answerStatistics);
   if(!testStatistics || !testStatistics.answerStatistics)
    return 0;
     return testStatistics.answerStatistics.find((a) => {
         return a.questionId === questionId && a.answerId === answerId;
     });
  }

  if (loading) {
    return <div>Učitavanje rezultata...</div>;  
  }

  if (error) {
    return <div>Greška: {error}</div>;  
  }

  if (!testStatistics) {
    return <div>Rezultati nisu dostupni</div>;  
  }

  

  return (
    <div className="test-detail container mt-5">
      <h2 className="text-center mb-4">Rezultat testa</h2>                 {/* dodati naslov testa..I POPRAVITI PRIKAZ ODARBANIH I TACNIH SVIH ODG*/}

        <div className='statistics'>
        <div>
            <h5>Maksimalno poena</h5>
            <p>{testStatistics.test.points}</p>
        </div>

        <div className='students'>
            <div>
                <h5>Broj studenata</h5>
                <p>{testStatistics.numberOfStudents}</p>
            </div>
            <button className='finish-button'>Vidi spisak studenata</button>
        </div>
        </div>

        <div className='min-and-max-points'>
            <div>
                <h5>Maksimalno osvojeno poena</h5>
                <p>{testStatistics.maxResult}</p>
            </div>

            <div>
                <h5>Minimalno osvojeno poena</h5>
                <p>{testStatistics.minResult}</p>
            </div>
        </div>

      <ul className="list-group">
        {testStatistics.test.questions.map((question, index) => (
          <li key={question.id} className="list-group-item question-item">
            <h4>{index + 1}. {question.text} 
              <span className="text-muted"> ({question.points} poena)</span>
            </h4>


            {/* Odabrani odgovori */}
            <div className="selected-answers">
              <h5>Odgovori:</h5>
              <ul className="list-group">
                {question.answers.map((answer, idx) => (
                  <li key={idx} className={`list-group-item ${getAnswerClass(answer)}`}>
                    <div>
                        <p>{answer.text} </p>
                        <p> {answer.points} poena</p>
                        <p>{getPercentage(question.id, answer.id)} % of students</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <hr />
          </li>
        ))}
      </ul>
      <button type="button" className="btn-add btn-outline-primary btn-center" onClick={() => handleFinishResultClick()}>ZAVRŠI PREGLED REZULTATA</button>

    </div>
  );
};

export default TestResultForTeacher;
