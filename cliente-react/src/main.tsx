import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './../context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Login from './components/login';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
