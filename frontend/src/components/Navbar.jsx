import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IconHome, IconNotebook, IconCoins, IconLogout } from '@tabler/icons-react';

import './Navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('pyji_token');
    localStorage.removeItem('user');

    window.location.href = '/';

    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="brand-area">
        Pyji
      </div>
      <div className="nav-list">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <IconHome size={20} /> 首頁
        </NavLink>
        <NavLink to="/ledger" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <IconNotebook size={20} /> 每月帳本
        </NavLink>
        <NavLink to="/assets" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <IconCoins size={20} /> 資產總覽
        </NavLink>
      </div>
      <div className="logout-area">
        <button 
          className="nav-item logout-button" 
          onClick={handleLogout} 
          style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer' }}
        >
          <IconLogout size={20} /> 登出
        </button>
      </div>
    </aside>
  );
};

export default Navbar;