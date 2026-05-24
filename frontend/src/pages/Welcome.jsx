import React from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { IconBrandGithub } from '@tabler/icons-react';
import logo from '../assets/logo.png';

const Welcome = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://127.0.0.1:8001/api/login/google', {
        id_token: credentialResponse.credential,
      });

      const { access_token, user } = response.data;

      localStorage.setItem('pyji_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      window.location.href = '/dashboard';
    } catch (err) {
      console.error('登入失敗', err.response?.data || err.message);
    }
  };

  return (
    <div className="welcome-container">
      <img src={logo} alt="Pyji Logo" style={{ width: '500px', height: 'auto' }} />
      <h2>一個專為現代人打造的記帳網站</h2>
      <p className="highlight-text">整合銀行、信用卡與電子支付，輕鬆記錄繁忙生活中的每一筆支出。</p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('登入失敗')}/>
        <a 
          href="https://github.com/gpna1229/pyji-money-tracker" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-github"
        >
          <IconBrandGithub size={18} />
            關於本專案
        </a>
      </div>
    </div>
  );
};

export default Welcome;