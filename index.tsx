import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mock API is now handled via the apiFetch utility in services/mockApi.ts
// to avoid conflicts with strict window.fetch policies.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);