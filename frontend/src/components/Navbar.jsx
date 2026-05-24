import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconHome, IconNotebook, IconCoins } from '@tabler/icons-react';

const Navbar = () => {
  return (
    <aside className="sidebar">
      <div className="brand-area">Pyji</div>
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
    </aside>
  );
};

export default Navbar;