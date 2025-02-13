import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResumeUploadPage from './components/ResumeUploadPage';
import PortfolioPage from './components/PortfolioPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeUploadPage />} />
        <Route path="/portfolio/:resumeId" element={<PortfolioPage />} />
      </Routes>
    </Router>
  );
}

export default App;

