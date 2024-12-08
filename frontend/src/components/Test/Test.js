import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { environment } from '../../env/environment';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './Test.css';

const Test = () => {
  const { id } = useParams(); 
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
    const username = localStorage.username;

    const finalTestResult = {
      testId: test.id,        
      questionResults: testResult,
      studentUsername: username
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
        throw new Error("Greška prilikom čuvanja rada testa");
      }

      //toast.success('Test je uspješno završen');
      console.log("anja 9+ " + finalTestResult.testId)

     //setTimeout(() => {
      if(id)
        navigate(`/test-result-details/` + finalTestResult.testId);
      else
      toast("Greska id")
      //}, 2000);
      
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleAnswer = (question, answer) => {
    const updatedResults = [...testResult];
    const questionIndex = updatedResults.findIndex((qr) => qr.question.id == question.id);
    console.log(updatedResults);
  
    if (questionIndex == -1) {
      updatedResults.push({
        question: question,
        answers: [answer], 
      });
    } else {
      const selectedAnswers = updatedResults[questionIndex].answers;
      const answerIndex = selectedAnswers.findIndex(a => a.id === answer.id);
      
      if (answerIndex === -1) {
        selectedAnswers.push(answer); 
      } else {
        selectedAnswers.splice(answerIndex, 1); 
      }
  
      updatedResults[questionIndex] = {
        ...updatedResults[questionIndex],
        answers: selectedAnswers,
      };
    }
  
    setTestResult(updatedResults);
  };
  

  const getAnswerClass = (question, answer) => {
    const selectedAnswers = testResult.find((result) => result.question.id == question.id)?.answers || [];
    
    if (selectedAnswers.some((selectedAnswer) => selectedAnswer.id == answer.id)) {
      return 'selected-answer'; 
    }
    
    return ''; 
  };

  
  

  return (
    <div className="test-detail container mt-5">
          <h2 className="text-center mb-4">{test.name}</h2>
          <p className="text-center mb-5">{test.description}</p>
          <ul className="list-group">
            {test.questions.map((question, index) => (
              <li key={question.id} className="list-group-item question-item">
                <h4>{index + 1}. {question.text} <span className="text-muted">({question.points} poena)</span></h4>
                <ul className="list-group">
                  {question.answers.map((answer) => (
                    <li 
                      key={answer.id} 
                      onClick={(e) => handleAnswer(question, answer)} 
                      className={`list-group-item clickable ${getAnswerClass(question, answer)}`}
                    >
                      <p>{answer.text}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button type="submit" className="btn btn-outline-success" onClick={(e) => handleFinishClick(e)}>Završi test</button>
        
          <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
      />    
    </div>
  );
};

export default Test;
