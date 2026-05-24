import React from 'react';
import { Routes, Route, Navigate, BrowserRouter, useLocation, Outlet } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Ledger from './pages/Ledger';
import Assets from './pages/Assets';
import './styles/app.css';

const Layout = () => {
  const location = useLocation();
  if (location.pathname === '/') return <Outlet />;
  
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/assets" element={<Assets />} />
            </Route>
          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;