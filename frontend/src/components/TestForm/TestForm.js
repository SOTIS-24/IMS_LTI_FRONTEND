import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import { environment } from '../../env/environment';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './TestForm.css';

const TestForm = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const { id } = useParams();  
  const navigate = useNavigate(); 

  useEffect(() => {
    if (id != -1) {
      const fetchTestData = async () => {
        try {
          const response = await fetch(environment.apiHost + `tests/${id}`);
          if (!response.ok) {
            throw new Error("Greska prilikom preuzimanja testa.");
          }
          const testData = await response.json();
          setTestName(testData.name);
          setTestDescription(testData.description);
          setSelectedCourse(testData.courseId);
          setIsPublished(testData.isPublished);
          setQuestions(testData.questions);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchTestData();
    }
  }, [id]);  

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        points: 0,
        answers: [],
      },
    ]);
  };

  const addAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({
      text: '',
      points: 0,
      isCorrect: false,
    });
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const testData = {
      Name: testName,
      Description: testDescription,
      CourseId: localStorage.courseId,
      TeacherUsername: localStorage.username,
      IsPublished: isPublished,
      Id: id != -1 ? id : null,
      Questions: questions.map((question) => ({
        Text: question.text,
        Points: question.points,
        Answers: question.answers.map((answer) => ({
          Text: answer.text,
          Points: answer.points,
          IsCorrect: answer.isCorrect,
        })),
      })),
    };

    try {
      const method = id != -1 ? 'PUT' : 'POST'; 
      const url = id != -1 ? `${environment.apiHost}tests/update` : `${environment.apiHost}tests/add`; 
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        throw new Error("Greška prilikom čuvanja testa");
      }

      toast.success(id === '-1' ? 'Test je uspješno sačuvan' : 'Test je uspješno ažuriran');

      // kasnjenje radi navigacije, radi nje se u suprotnom ne prikaze poruka
      setTimeout(() => {
        navigate('/tests');
      }, 2000);

     
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{id !== '-1' ? 'Izmjena testa' : 'Dodavanje novog testa'}</h2>
      <p className="mb-4">
        {isPublished 
          ? "U ovoj formi možete izmijeniti postojeći test. Ako su test i njegovi odgovori već objavljeni, nećete moći napraviti promjene."
          : "Dodajte novi test popunjavanjem sljedećih polja. Dodajte pitanja i odgovore, a zatim sačuvajte test."
        }
      </p>
      {error && <div className="alert alert-danger">{error}</div>}
  
      <div className="card shadow-sm rounded" style={{ backgroundColor: "#f0f2f4" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="testName" className="form-label">Naziv testa:</label>
              <input
                type="text"
                id="testName"
                className="form-control"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="testDescription" className="form-label">Opis testa:</label>
              <textarea
                id="testDescription"
                className="form-control"
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
              />
            </div>
  
            <div className="mb-4">
              <h5>Pitanja</h5>
              {questions.map((question, index) => (
                <div key={index} className="question-card mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="w-75">
                      <label htmlFor={`question-${index}`} className="form-label">Pitanje {index + 1}:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={question.text}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index].text = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                        placeholder="Unesite pitanje"
                      />
                    </div>
                    <button type="button" className="btn-add btn-outline-primary" onClick={() => addAnswer(index)}>
                      DODAJ ODGOVOR
                    </button>
                  </div>
  
                  <div className="mb-3">
                    <label htmlFor={`points-${index}`} className="form-label">Bodovi:</label>
                    <input
                      type="number"
                      id={`points-${index}`}
                      className="form-control"
                      value={question.points}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].points = parseFloat(e.target.value);
                        setQuestions(updatedQuestions);
                      }}
                      placeholder="0"
                    />
                  </div>
  
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="answer-card mb-3">
                      <label className="form-label">Odgovor {answerIndex + 1}:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={answer.text}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index].answers[answerIndex].text = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                        placeholder="Unesite odgovor"
                      />
  
                      <div className="mb-3">
                        <label htmlFor={`answer-points-${index}-${answerIndex}`} className="form-label">Bodovi za odgovor:</label>
                        <input
                          type="number"
                          id={`answer-points-${index}-${answerIndex}`}
                          className="form-control"
                          value={answer.points}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].answers[answerIndex].points = parseFloat(e.target.value);
                            setQuestions(updatedQuestions);
                          }}
                          placeholder="0"
                        />
                      </div>
  
                      <div>
                        <input
                          type="checkbox"
                          checked={answer.isCorrect}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].answers[answerIndex].isCorrect = e.target.checked;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        <label className="ms-2"> Tačno</label>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
  
            <div className="mb-3">
              <button type="button" className="btn btn-outline-primary" onClick={addQuestion}>
                DODAJ PITANJE
              </button>
            </div>
  
            <button type="submit" className="btn btn-outline-success" disabled={isPublished}>
              {id !== '-1' ? 'Sačuvaj promjene' : 'Sačuvaj test'}
            </button>
          </form>
        </div>
      </div>
  
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

export default TestForm;