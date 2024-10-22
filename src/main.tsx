import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/bobriki/sw.js");
      console.log("Service worker registered with scope:", registration.scope);
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
} else {
  console.warn("Service workers are not supported in this browser.");
}



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/bobriki/'>
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
  </StrictMode>,
)
