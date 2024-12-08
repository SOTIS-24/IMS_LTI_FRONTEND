import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestList from './components/TestsList/TestList';
import Test from './components/Test/Test';
import TestForm from './components/TestForm/TestForm';
import TeacherLandingPage from './components/LandingPage/TeacherLandingPage';
import StudentLandingPage from './components/LandingPage/StudentLandingPage';
import TestResult from './components/TestResult/TestResult';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tests" element={<TestList />} />
        <Route path="/tests/:id" element={<Test />} />
        <Route path="/test-form/:id" element={<TestForm />} />
        <Route path="/test-result-details/:testId" element={<TestResult />} />
        <Route path="/teacher-landing-page/:role/:username/:courseId" element={<TeacherLandingPage />} />
        <Route path="/student-landing-page/:role/:username/:courseId" element={<StudentLandingPage />} />
      </Routes>
    </Router>
  );
}
export default App;