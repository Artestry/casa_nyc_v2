import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { startMockApi } from './services/mockApi';

// Initialize Mock API to intercept requests to /api/listings
startMockApi();

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
