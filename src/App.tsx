import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardMarketplaceFeed from './components/DashboardMarketplaceFeed';
import RfpCreateForm from './components/RfpCreateForm';
import CrmKanbanView from './components/CrmKanbanView';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import './index.css';

type ViewType = 'dashboard' | 'createRfp' | 'crm';

function App() {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedRole, setSelectedRole] = useState<string>('Builder');

  // If user is not authenticated, render Login page
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardMarketplaceFeed />} />
        <Route path="/createRfp" element={<RfpCreateForm />} />
        <Route path="/crm" element={<CrmKanbanView />} />
      </Routes>
    </Router>
  );
}

export default App;
