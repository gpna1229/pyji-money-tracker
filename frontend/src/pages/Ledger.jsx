import React, { useState, useEffect, useMemo } from 'react';

import { IconChevronLeft, IconChevronRight, IconPencil, IconTrash } from '@tabler/icons-react';

import Modal from '../components/Modal';
import { apiFetch } from '../services/api';
import './Ledger.css';

const TYPE_MAP = { EXPENSE: '支出', INCOME: '收入', TRANSFER: '轉帳', LOAN: '借貸' };
const CATEGORY_OPTIONS = {
  EXPENSE: ['飲食', '交通', '娛樂', '社交', '購物', '固定支出', '其他'],
  INCOME: ['薪資', '獎金', '利息與回饋', '轉帳', '其他']
};

const Ledger = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [txForm, setTxForm] = useState({
    transaction_date: new Date().toISOString().split('T')[0],
    accounting_date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    counterparty: '',
    amount: 0,
    account_id: '',
    category: '飲食',
    note: ''
  });

  const loadData = async () => {
    try {
      const [txData, accData] = await Promise.all([apiFetch('/transactions/'), apiFetch('/accounts/')]);
      setTransactions(txData);
      setAccounts(accData);
    } catch (err) { console.error('載入失敗:', err); }
  };

  useEffect(() => { loadData(); }, []);

  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.transaction_date);
      const isSameMonth = txDate.getMonth() === currentDate.getMonth() && txDate.getFullYear() === currentDate.getFullYear();
      const isTypeMatch = activeTab === 'ALL' || tx.type === activeTab;
      return isSameMonth && isTypeMatch;
    });
  }, [transactions, currentDate, activeTab]);

  const handleMonthChange = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const handleOpenAddModal = () => {
    setTxForm({
      transaction_date: new Date().toISOString().split('T')[0],
      accounting_date: new Date().toISOString().split('T')[0],
      type: 'EXPENSE',
      counterparty: '',
      amount: 0,
      account_id: accounts.length > 0 ? accounts[0].id : '',
      category: '飲食',
      note: ''
    });
    setSelectedTx(null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx) => {
    setSelectedTx(tx);
    setTxForm({ ...tx });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleChange = (e) => setTxForm({ ...txForm, [e.target.name]: e.target.value });

  const handleTypeChange = (newType) => {
    setTxForm({ ...txForm, type: newType, category: CATEGORY_OPTIONS[newType][0] });
  };

  const handleSave = async () => {
    try {
      const dataToSubmit = { ...txForm };
      delete dataToSubmit.account_name;
      dataToSubmit.amount = Number(dataToSubmit.amount);

      const url = selectedTx ? `/transactions/${selectedTx.id}/update` : '/transactions/create';
      
      await apiFetch(url, { 
        method: selectedTx ? 'PATCH' : 'POST', 
        body: JSON.stringify(dataToSubmit) 
      });
      
      setIsModalOpen(false);
      loadData();
    } catch (err) { alert('儲存失敗！'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('確定刪除此筆交易？')) return;
    try {
      await apiFetch(`/transactions/delete?id=${selectedTx.id}`, { method: 'DELETE' });
      setIsModalOpen(false);
      loadData();
    } catch (err) { alert('刪除失敗'); }
  };

  return (
    <div className="ledger-page">
      <header className="ledger-header">
        <h1>交易明細</h1>
        <button className="add-btn" onClick={handleOpenAddModal}>+ 新增交易</button>
      </header>
      <div className="ledger-controls">
        <button onClick={() => handleMonthChange(-1)}>
          <IconChevronLeft size={20} />
        </button>
        <h2>{currentDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}</h2> 
        <button onClick={() => handleMonthChange(1)}>
          <IconChevronRight size={20} />
        </button>
      </div>
      <div className="tabs">
        {['ALL', 'EXPENSE', 'INCOME'].map(tab => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab === 'ALL' ? '全部' : (tab === 'EXPENSE' ? '支出' : '收入')}
          </button>
        ))}
      </div>
      <div className="tx-list">
        <div className="tx-header-row">
          <span>日期</span><span>對象</span><span>備註</span><span>金額</span><span>分類</span><span>帳戶</span>
        </div>
        {filteredData.map(tx => (
          <div key={tx.id} className={`tx-item ${tx.type.toLowerCase()}`} onClick={() => handleOpenEditModal(tx)}>
            <span>{tx.transaction_date}</span>
            <span>{tx.counterparty || '-'}</span>
            <span className="note-text">{tx.note || '-'}</span>
            <span className={`amount ${tx.type.toLowerCase()}`}>
              {tx.type === 'EXPENSE' ? '-' : '+'}{tx.amount.toLocaleString()}
            </span>
            <span>{tx.category}</span>
            <span>{tx.account_name || '預設'}</span>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? (selectedTx ? "編輯交易" : "新增交易") : "交易詳情"}>
        {isEditMode ? (
          <div className="ledger-form">
            <div className="modal-tabs">
              {['EXPENSE', 'INCOME'].map(type => (
                <button key={type} className={txForm.type === type ? 'active' : ''} onClick={() => handleTypeChange(type)}>
                  {TYPE_MAP[type]}
                </button>
              ))}
            </div>
            <div className="form-row">
              <div className="form-group"><label>交易日期</label><input type="date" name="transaction_date" value={txForm.transaction_date} onChange={handleChange} /></div>
              <div className="form-group"><label>憑證日期</label><input type="date" name="accounting_date" value={txForm.accounting_date} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label>交易對象</label><input type="text" name="counterparty" value={txForm.counterparty} onChange={handleChange} /></div>
            <div className="form-group"><label>交易分類</label>
              <select name="category" value={txForm.category} onChange={handleChange}>
                {CATEGORY_OPTIONS[txForm.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="amount-row">
              <div className="form-group"><label>交易金額</label><input type="number" name="amount" value={txForm.amount} onChange={handleChange} /></div>
              <div className="form-group"><label>交易帳戶</label>
                <select name="account_id" value={txForm.account_id} onChange={handleChange}>
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>備註說明</label><input type="text" name="note" value={txForm.note} onChange={handleChange} /></div>
            <button className="save-btn" onClick={handleSave}>儲存交易</button>
          </div>
        ) : (
          <div className="tx-detail">
            <p><strong>交易日期：</strong>{selectedTx?.transaction_date}</p>
            <p><strong>憑證日期：</strong>{selectedTx?.accounting_date}</p>
            <p><strong>交易型態：</strong>{TYPE_MAP[selectedTx?.type]}</p>
            <p><strong>交易金額：</strong>{selectedTx?.amount.toLocaleString()}</p>
            <p><strong>交易帳戶：</strong>{selectedTx?.account_name}</p>
            <p><strong>交易分類：</strong>{selectedTx?.category}</p>
            <p><strong>交易對象：</strong>{selectedTx?.counterparty || '-'}</p>
            <p><strong>備註說明：</strong>{selectedTx?.note || '-'}</p>
            <div className="modal-actions">
              <button onClick={() => setIsEditMode(true)} className="icon-btn edit-btn"><IconPencil size={20} /></button>
              <button onClick={handleDelete} className="icon-btn delete-btn"><IconTrash size={20} /></button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Ledger;