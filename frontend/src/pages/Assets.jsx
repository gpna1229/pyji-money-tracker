import React, { useState, useEffect } from 'react';

import Modal from '../components/Modal';
import { apiFetch } from '../services/api';
import './Assets.css';

const Assets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '現金', initial_balance: 0 });

  const categories = ['現金', '銀行帳戶', '信用卡', '電子支付', '點數帳戶'];

  const loadData = async () => {
    try {
      const accData = await apiFetch('/accounts/');

      const balancePromises = accData.map(async (acc) => {
        try {
          const balData = await apiFetch(`/accounts/${acc.id}/balance`);
          return { ...acc, balance: balData.balance || 0 };
        } catch {
         return { ...acc, balance: acc.initial_balance || 0 };
        }
      });
      setAssets(await Promise.all(balancePromises));
    } catch (err) {
      console.error('載入資產失敗:', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await apiFetch('/accounts/create', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          initial_balance: Number(formData.initial_balance)
        })
      });
      alert('新增成功！');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalBalance = assets.reduce((sum, item) => sum + item.balance, 0);

  return (
    <div className="assets-container">
      <header className="assets-header">
        <h1>資產總覽</h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ 新增帳戶</button>
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="新增帳戶">
        <div className="form-group">
          <label>帳戶名稱</label>
          <input name="name" type="text" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>帳戶類型</label>
          <select name="category" onChange={handleChange}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>初始餘額</label>
          <input name="initial_balance" type="number" onChange={handleChange} />
        </div>
        <button className="save-btn" onClick={handleSave}>儲存帳戶</button>
      </Modal>

      <section className="summary-card">
        <span className="label">總淨資產</span>
        <h2 className="total-amount">NT$ {totalBalance.toLocaleString()}</h2>
      </section>

      <div className="assets-grid">
        {categories.map((category) => {
          const filtered = assets.filter(item => item.category === category);
          if (filtered.length === 0) return null;
          return (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              {filtered.map(item => (
                <div key={item.id} className="account-item">
                  <span>{item.name}</span>
                  <span className="amount">NT$ {item.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assets;