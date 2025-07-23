import React from 'react';
import ReactDOM from 'react-dom/client';

// This single import loads all the styles for the entire application.
import './index.css';

// App.js is the main component that contains our router and auth provider.
import App from './App';

// reportWebVitals is a utility for measuring performance, fine to keep.
import reportWebVitals from './reportWebVitals';

// This is the standard React 18 way to initialize the application.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside React's StrictMode for development checks.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();