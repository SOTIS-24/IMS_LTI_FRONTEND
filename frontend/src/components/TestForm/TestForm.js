import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import necessary hooks
import { environment } from '../../env/environment';
import './TestForm.css';

const TestForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();  // Retrieve `id` from URL params
  const navigate = useNavigate();  // To navigate after form submission

  // Fetch courses when component mounts
  useEffect(() => {
    // Fetch existing test data if we are editing an existing test
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
          setQuestions(testData.questions);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchTestData();
    }
  }, [id]);  // Run this effect when `id` changes (or when the component mounts)

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
      const method = id != -1 ? 'PUT' : 'POST';  // Use PUT if editing, POST if creating
      const url = id != -1 ? `${environment.apiHost}tests/update` : `${environment.apiHost}tests/add`;  // Endpoint based on whether it's edit or create
      
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

      const savedTest = await response.text();
   
      console.log("Saved test");
      

      // Redirect to tests list page after successful save
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="test-form">
      <h2>{id ? 'Izmena testa' : 'Dodavanje novog testa'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="testName">Naziv testa:</label>
          <input
            type="text"
            id="testName"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="testDescription">Opis testa:</label>
          <textarea
            id="testDescription"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
          />
        </div>

        <div className="questions-container">
          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <div className="question-text">
                <span className="question-number">Pitanje {index + 1}:</span>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].text = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                  placeholder="Unesite pitanje"
                />
              </div>

              <div>
                <label htmlFor={`points-${index}`} className="points-label">Bodovi:</label>
                <input
                  type="number"
                  id={`points-${index}`}
                  value={question.points}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].points = parseFloat(e.target.value);
                    setQuestions(updatedQuestions);
                  }}
                  placeholder="0"
                />
              </div>

              <div className="button-container">
                <button
                  type="button"
                  className="add-answer-btn"
                  onClick={() => addAnswer(index)}
                >
                  Dodaj odgovor
                </button>
              </div>

              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="answer-container">
                  <span className="answer-number">Odgovor {answerIndex + 1}:</span>
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index].answers[answerIndex].text = e.target.value;
                      setQuestions(updatedQuestions);
                    }}
                    placeholder="Unesite odgovor"
                  />
                  <div>
                    <label htmlFor={`answer-points-${index}-${answerIndex}`} className="points-label">
                      Bodovi za odgovor:
                    </label>
                    <input
                      type="number"
                      id={`answer-points-${index}-${answerIndex}`}
                      value={answer.points}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].answers[answerIndex].points = parseFloat(e.target.value);
                        setQuestions(updatedQuestions);
                      }}
                      placeholder="0"
                    />
                  </div>
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index].answers[answerIndex].isCorrect = e.target.checked;
                      setQuestions(updatedQuestions);
                    }}
                  />
                  <label>Tačno</label>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="button-container">
          <button type="button" className="add-question-btn" onClick={addQuestion}>
            Dodaj pitanje
          </button>
        </div>

        <button type="submit">{id ? 'Sačuvaj promene' : 'Sačuvaj test'}</button>
      </form>
    </div>
  );
};

export default TestForm;
