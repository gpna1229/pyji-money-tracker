import React, { useState, useEffect } from 'react';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import Modal from '../components/Modal';
import { apiFetch } from '../services/api';
import './Assets.css';

const Assets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [errors, setErrors] = useState({});
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
      setErrors({});
      const url = isEditMode ? `/accounts/${selectedAccount.id}/update` : '/accounts/create';
      const method = isEditMode ? 'PATCH' : 'POST';
      
      await apiFetch(url, {
        method: method,
        body: JSON.stringify({
          ...formData,
          initial_balance: Number(formData.initial_balance)
        })
      });

      if (isEditMode) {
        setSelectedAccount({ ...formData, id: selectedAccount.id, balance: selectedAccount.balance });
        setIsEditMode(false);
        loadData();
      } else {
        setIsModalOpen(false);
        loadData();
        handleCloseModal();
      }
    } catch (err) {
      setErrors({ name: err.message });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`確定刪除「${selectedAccount.name}」嗎？`)) return;
    try {
      await apiFetch(`/accounts/delete?id=${selectedAccount.id}`, { method: 'DELETE' });
      alert('帳戶刪除成功！');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || '刪除失敗，請稍後再試！');
    }
  };

  const openAccountDetail = (account) => {
    setSelectedAccount(account);
    setFormData(account);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedAccount(null);
    setFormData({ name: '', category: '現金', initial_balance: 0 });
    setErrors({});
  };

  const totalBalance = assets.reduce((sum, item) => sum + item.balance, 0);

  return (
    <div className="assets-container">
      <header className="assets-header">
        <h1>資產總覽</h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ 新增帳戶</button>
      </header>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditMode ? "編輯帳戶" : (selectedAccount ? "帳戶詳情" : "新增帳戶")}>
        {!selectedAccount || isEditMode ? (
          <>
            <div className="form-group">
              <label>帳戶名稱</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} className={errors.name ? 'input-error' : ''}/>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>帳戶類型</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>初始餘額</label>
              <input name="initial_balance" type="number" value={formData.initial_balance} onChange={handleChange} />
            </div>
            <button className="save-btn" onClick={handleSave}>儲存帳戶</button>
          </>
        ) : (
          <div className="account-detail">
            <p>帳戶名稱：{selectedAccount.name}</p>
            <p>帳戶類型：{selectedAccount.category}</p>
            <p>初始資產：NT$ {selectedAccount.initial_balance.toLocaleString()}</p>
            <div className="modal-actions">
              <button onClick={() => setIsEditMode(true)} className="icon-btn edit-btn" title="編輯">
                <IconPencil size={20} />
              </button>
              <button onClick={handleDelete} className="icon-btn delete-btn" title="刪除">
                <IconTrash size={20} />
              </button>
            </div>
          </div>
        )}
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
                <div key={item.id} className="account-item" onClick={() => openAccountDetail(item)} style={{cursor: 'pointer'}}>
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