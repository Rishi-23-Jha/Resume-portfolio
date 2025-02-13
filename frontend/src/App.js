import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ResumeUploadPage from './components/ResumeUploadPage';
import PortfolioPage from './components/PortfolioPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ResumeUploadPage />
              </PrivateRoute>
            }
          />

          <Route path="/portfolio/:resumeId" element={<PortfolioPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;