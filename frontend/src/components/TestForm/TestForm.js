import React, { useState, useEffect } from 'react';
import { environment } from '../../env/environment';
import './TestForm.css';

const TestForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(environment.apiHost + 'courses');
        if (!response.ok) {
          throw new Error("Greska prilikom preuzimanja predmeta.");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, []);

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

  return (
    <div className="test-form">
      <h2>Dodavanje novog testa</h2>
      {error && <div className="error">{error}</div>}
      
      <form>
        <div>
          <label htmlFor="course">Predmet:</label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">Izaberite predmet</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

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

        <button type="submit">Sačuvaj test</button>
      </form>
    </div>
  );
};

export default TestForm;
