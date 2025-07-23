import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalProvider } from './contexts/GlobalContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginRegister from './components/Auth/LoginRegister';
import UserProfile from './components/Profile/UserProfile';
import AdminDashboard from './components/Admin/AdminDashboard';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import LearningHub from './components/LearningHub/LearningHub';
import Chatbot from './components/Chatbot/Chatbot';
import TechFeed from './components/TechFeed/TechFeed';
import ResumeBuilder from './components/ResumeBuilder/ResumeBuilder';
import PlacementPrep from './components/PlacementPrep/PlacementPrep';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsOfService from './components/Legal/TermsOfService';
import CreatorPage from './components/Legal/CreatorPage';
import Disclaimer from './components/Legal/Disclaimer';
import Loader from './components/Layout/Loader';

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate loading delay (replace with actual data fetching if needed)
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {loading && <Loader />}
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginRegister />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/learning" element={<LearningHub />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/news" element={<TechFeed />} />
                <Route path="/resume" element={<ResumeBuilder />} />
                <Route path="/placement" element={<PlacementPrep />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/creator" element={<CreatorPage />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
              </Routes>
            </main>
            <Footer />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <AppContent />
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;