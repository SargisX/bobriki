import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { ToastContainer } from 'react-toastify';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/your-repo-name/sw.js')
      .then((registration) => console.log('SW registered:', registration))
      .catch((error) => console.error('SW registration failed:', error));
  });

  // Handle SW updates and force reload if necessary
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}


if (!navigator.serviceWorker) {
  alert('Service workers are not available in this browser mode.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/bobriki/">
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={2}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  </StrictMode>
);
