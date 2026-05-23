import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Ledger from './pages/Ledger';
import Assets from './pages/Assets';
import './styles/app.css';

const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="app-wrapper">
      {location.pathname !== '/' && <Navbar />}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/ledger" element={<PrivateRoute><Ledger /></PrivateRoute>} />
          <Route path="/assets" element={<PrivateRoute><Assets /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;