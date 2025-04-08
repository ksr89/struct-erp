import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Optionally import an ErrorBoundary component if available
// import ErrorBoundary from './components/ErrorBoundary';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        {/* Wrap App in an ErrorBoundary if you have one */}
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
