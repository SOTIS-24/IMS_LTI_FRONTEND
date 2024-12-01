import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage'
import TestList from './components/TestsList/TestList';
import Test from './components/Test/Test';
import TestForm from './components/TestForm/TestForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tests" element={<TestList />} />
        <Route path="/tests/:id" element={<Test />} />
        <Route path="/test-form/:id" element={<TestForm />} />
      </Routes>
    </Router>
  );
}
export default App;