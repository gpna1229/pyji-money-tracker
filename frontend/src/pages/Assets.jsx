import React, { useState } from 'react';
import Modal from '../components/Modal'; 
import './Assets.css';

const Assets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '現金',
    initial_balance: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('pyji_token');
    try {
      const response = await fetch('http://127.0.0.1:8001/api/accounts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('新增成功！');
        setIsModalOpen(false);
      } else {
        alert('儲存失敗，請檢查後端連線');
      }
    } catch (error) {
      console.error('API 錯誤:', error);
    }
  };

  return (
    <div className="assets-container">
      <header className="assets-header">
        <h1>資產總覽</h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ 新增帳戶</button>
      </header>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="新增帳戶"
      >
        <div className="form-group">
          <label>帳戶名稱</label>
          <input type="text" placeholder="例如：台新銀行" onChange={handleChange}/>
        </div>
        
        <div className="form-group">
          <label>帳戶類型</label>
          <select name="type" onChange={handleChange}>
            <option>現金</option>
            <option>銀行帳戶</option>
            <option>信用卡</option>
            <option>點數帳戶</option>
          </select>
        </div>
        <div className="form-group">
          <label>初始餘額</label>
          <input type="number" placeholder="0" onChange={handleChange}/>
        </div>
        <button className="save-btn" onClick={handleSave}>儲存帳戶</button>
      </Modal>
    </div>
  );
};

export default Assets;