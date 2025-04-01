import React, { useState } from 'react';
import DashboardMarketplaceFeed from './components/DashboardMarketplaceFeed';
import RfpCreateForm from './components/RfpCreateForm';
import CrmKanbanView from './components/CrmKanbanView';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">Construction ERP</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-2 sm:px-3 py-2 rounded-md text-sm font-medium ${activeView === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Feed
              </button>
              <button
                onClick={() => setActiveView('crm')}
                className={`px-2 sm:px-3 py-2 rounded-md text-sm font-medium ${activeView === 'crm' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                CRM/Projects
              </button>
              <button
                onClick={() => setActiveView('createRfp')}
                className={`px-2 sm:px-3 py-2 rounded-md text-sm font-medium ${activeView === 'createRfp' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Post RFP
              </button>
            </div>
          </div>
          <div className="sm:hidden flex items-center justify-end pt-2 pb-1 border-t border-gray-200">
            <label htmlFor="roleSelectSmall" className="mr-2 text-xs font-medium text-gray-700">Sim Role:</label>
            <select
              id="roleSelectSmall"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Builder">Builder</option>
              <option value="Contractor">Contractor</option>
              <option value="Supplier">Supplier</option>
              <option value="Customer">Customer</option>
              <option value="Engineer">Engineer</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {activeView === 'dashboard' && <DashboardMarketplaceFeed />}
          {activeView === 'crm' && <CrmKanbanView />}
          {activeView === 'createRfp' && <RfpCreateForm />}
        </div>
      </main>

      <footer className="bg-white mt-8 py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          &copy; 2025 Construction ERP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
