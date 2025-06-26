import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './utils/debugHelper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Log that we're starting to render
console.log('Rendering React application...');

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React application rendered successfully');
  } catch (error) {
    console.error('Error rendering React application:', error);
  }
} else {
  console.error('Root element not found. Cannot render application.');
}