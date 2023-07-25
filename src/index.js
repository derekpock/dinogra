import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import EventCoordinator from './events/EventCoordinator';

window.evcor = new EventCoordinator();
window.evcor.populateWindow(window);

// manifest.json provides metadata used when your web app is installed on a
// user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
