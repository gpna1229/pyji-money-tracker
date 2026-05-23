import React from 'react';
import logo from '../assets/logo.png';
import { IconArrowRight, IconBrandGithub } from '@tabler/icons-react';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <img src={logo} alt="Pyji Logo" style={{width: '500px', height: 'auto'}}/>
      <h2>一個專為現代人打造的記帳網站</h2>
      <p className="highlight-text">整合銀行、信用卡與電子支付，輕鬆記錄繁忙生活中的每一筆支出。</p>

      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
        <button className="btn btn-google">
          使用 Google 登入
          <IconArrowRight size={18} />
        </button>
        
        <a href="https://github.com/gpna1229/pyji-money-tracker" target="_blank" rel="noopener noreferrer" className="btn btn-github">
          <IconBrandGithub size={18} />
            GitHub
        </a>
      </div>
    </div>
  );
};

export default Welcome;