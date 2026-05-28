import React, { useState, useEffect, useMemo } from 'react';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import Modal from '../components/Modal';
import { apiFetch } from '../services/api';
import './Assets.css';

const ACCOUNT_CATEGORIES = ['現金', '銀行帳戶', '信用卡', '電子支付', '點數帳戶'];
const INITIAL_FORM_STATE = { name: '', category: '現金', initial_balance: 0 };

const Assets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [errors, setErrors] = useState({});
  const [assets, setAssets] = useState([]);
  const [accountForm, setAccountForm] = useState(INITIAL_FORM_STATE);

  const loadData = async () => {
    try {
      const accounts = await apiFetch('/accounts/');
      const accountsWithBalance = await Promise.all(
        accounts.map(async (acc) => {
          try {
            const balData = await apiFetch(`/accounts/${acc.id}/balance`);
            return { ...acc, balance: balData.balance || 0 };
          } catch {
            return { ...acc, balance: acc.initial_balance || 0 };
          }
        })
      );
      setAssets(accountsWithBalance);
    } catch (err) {
      console.error('資產載入失敗:', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const totalBalance = useMemo(() => 
    assets.reduce((sum, item) => sum + item.balance, 0), 
  [assets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limits = { name: 10, initial_balance: 15 };

    if (limits[name] && value.length > limits[name]) return;

    setAccountForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSave = async () => {
    setErrors({});
    const isEdit = !!selectedAccount;
    const url = isEdit ? `/accounts/${selectedAccount.id}/update` : '/accounts/create';
    
    try {
      await apiFetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        body: JSON.stringify({
          ...accountForm,
          initial_balance: Number(accountForm.initial_balance)
        })
      });
      
      await loadData();
      handleCloseModal();
    } catch (err) {
      setErrors(
        err.detail?.field 
        ? { [err.detail.field]: err.detail.message } 
        : { name: err.detail?.message || err.message || "發生未知錯誤！" }
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`確定刪除「${selectedAccount.name}」嗎？`)) return;
    try {
      await apiFetch(`/accounts/delete?id=${selectedAccount.id}`, { method: 'DELETE' });
      alert('刪除成功！');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(typeof err.detail === 'string' ? err.detail : '刪除失敗，請稍後再試！');
    }
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setSelectedAccount(account);
      setAccountForm(account);
      setIsEditMode(false);
    } else {
      setSelectedAccount(null);
      setAccountForm(INITIAL_FORM_STATE);
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedAccount(null);
    setAccountForm(INITIAL_FORM_STATE);
    setErrors({});
  };

  return (
    <>
      <header className="assets-header">
        <h1>資產總覽</h1>
        <button className="add-btn" onClick={() => handleOpenModal()}>+ 新增帳戶</button>
      </header>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditMode ? "編輯帳戶" : (selectedAccount ? "帳戶詳情" : "新增帳戶")}>
        {!selectedAccount || isEditMode ? (
          <>
            <div className="form-group">
              <label>帳戶名稱</label>
              <input name="name" type="text" value={accountForm.name} onChange={handleChange} className={errors.name ? 'input-error' : ''}/>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>帳戶類型</label>
              <select name="category" value={accountForm.category} onChange={handleChange}>
                {ACCOUNT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>初始餘額</label>
              <input name="initial_balance" type="number" value={accountForm.initial_balance} onChange={handleChange} className={errors.initial_balance ? 'input-error' : ''}/>
              {errors.initial_balance && <span className="error-text">{errors.initial_balance}</span>}
            </div>
            <button className="save-btn" onClick={handleSave}>儲存帳戶</button>
          </>
        ) : (
          <div className="account-detail">
            <p><strong>帳戶名稱：</strong>{selectedAccount.name}</p>
            <p><strong>帳戶類型：</strong>{selectedAccount.category}</p>
            <p><strong>初始資產：</strong>NT$ {selectedAccount.initial_balance.toLocaleString()}</p>
            <div className="modal-actions">
              <button onClick={() => setIsEditMode(true)} className="icon-btn edit-btn"><IconPencil size={20} /></button>
              <button onClick={handleDelete} className="icon-btn delete-btn"><IconTrash size={20} /></button>
            </div>
          </div>
        )}
      </Modal>

      <section className="summary-card">
        <span className="label">總淨資產</span>
        <h2 className="total-amount">NT$ {totalBalance.toLocaleString()}</h2>
      </section>

      <div className="assets-grid">
        {ACCOUNT_CATEGORIES.map((category) => {
          const filtered = assets.filter(item => item.category === category);
          if (filtered.length === 0) return null;
          return (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              {filtered.map(item => (
                <div key={item.id} className="account-item" onClick={() => handleOpenModal(item)} style={{cursor: 'pointer'}}>
                  <span>{item.name}</span>
                  <span className="amount">NT$ {item.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Assets;