import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/soho-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
