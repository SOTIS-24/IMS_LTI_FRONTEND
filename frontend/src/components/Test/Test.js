import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { environment } from '../../env/environment';
import './Test.css';

const Test = () => {
  const { id } = useParams(); //  id koji sam poslala kroz url
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState([]);

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

  const handleFinishClick = async (e) => {
    e.preventDefault();

    const finalTestResult = {
      test: test,        
      questionResults: testResult
    };

    try {
      const method = 'POST'; 
      const url = `${environment.apiHost}testResults/finish`;
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalTestResult),
      });

      if (!response.ok) {
        throw new Error("Greška prilikom cuvanja rada testa");
      }

      const finishedTest = await response.text();
   
      console.log("Finished test");
      

      // Redirect to tests list page after successful save
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAnswer = (question, answer) => {
    const updatedResults = [...testResult];
    const questionIndex = updatedResults.findIndex((qr) => qr.question.id == question.id);
    console.log(updatedResults);
  
    if (questionIndex == -1) {
      updatedResults.push({
        question: question,
        answers: [answer], // Store multiple answers
      });
    } else {
      const selectedAnswers = updatedResults[questionIndex].answers;
      const answerIndex = selectedAnswers.findIndex(a => a.id === answer.id);
      
      if (answerIndex === -1) {
        selectedAnswers.push(answer); // Add answer
      } else {
        selectedAnswers.splice(answerIndex, 1); // Remove answer if already selected
      }
  
      updatedResults[questionIndex] = {
        ...updatedResults[questionIndex],
        answers: selectedAnswers,
      };
    }
  
    setTestResult(updatedResults);
  };
  

  const getAnswerClass = (question, answer) => {
    // Find the selected answers for the current question
    const selectedAnswers = testResult.find((result) => result.question.id == question.id)?.answers || [];
    
    // Check if the current answer is in the selected answers list
    if (selectedAnswers.some((selectedAnswer) => selectedAnswer.id == answer.id)) {
      return 'selected-answer'; // Apply a class for the selected answer
    }
    
    return ''; // No class for unselected answers
  };
  

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
                <li key={answer.id} onClick={(e) => handleAnswer(question, answer)} className={getAnswerClass(question, answer)}>
                  <p>{answer.text}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div class="actions">
        <button className="finish-button" onClick={(e) => handleFinishClick(e)}>Finish</button>
      </div>
    </div>
  );
};

export default Test;
