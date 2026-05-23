import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/assets" element={<Assets />} />
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