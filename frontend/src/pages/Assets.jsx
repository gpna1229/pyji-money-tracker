import React, { useState } from 'react';
import Modal from '../components/Modal'; 
import './Assets.css';

const Assets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="assets-container">
      <header className="assets-header">
        <h1>資產總覽</h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ 新增帳戶</button>
      </header>

      {/* 彈窗內容 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="新增帳戶"
      >
        <div className="form-group">
          <label>帳戶名稱</label>
          <input type="text" placeholder="例如：台新銀行" />
        </div>
        
        <div className="form-group">
          <label>帳戶類型</label>
          <select>
            <option>現金</option>
            <option>銀行帳戶</option>
            <option>信用卡</option>
            <option>金融卡</option>
          </select>
        </div>

        <div className="form-group">
          <label>初始餘額</label>
          <input type="number" placeholder="0" />
        </div>

        <button className="save-btn">儲存帳戶</button>
      </Modal>
    </div>
  );
};

export default Assets;