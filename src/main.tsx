import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, Link } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import LoginPage from '@/modules/auth/pages/LoginPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
     <Routes>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
  </StrictMode>,
)
