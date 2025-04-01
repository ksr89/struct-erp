import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Optionally import an ErrorBoundary component if available
// import ErrorBoundary from './components/ErrorBoundary';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* Wrap App in an ErrorBoundary if you have one */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
