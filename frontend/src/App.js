import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestList from './components/TestsList/TestList';
import Test from './components/Test/Test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestList />} />
        <Route path="/tests/:id" element={<Test />} />
      </Routes>
    </Router>
  );
}
export default App;