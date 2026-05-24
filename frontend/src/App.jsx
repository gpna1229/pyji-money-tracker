import React from 'react';
import { BrowserRouter, useLocation, Outlet } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;