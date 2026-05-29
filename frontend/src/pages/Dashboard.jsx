import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { apiFetch } from '../services/api';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch('/transactions/monthly_stats');
        setStats(data);
      } catch (err) {
        console.error('統計資料載入失敗:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="dashboard-loading">載入數據中...</div>;
  if (!stats) return <div className="dashboard-error">無法載入統計資料</div>;

  const pieData = {
    labels: Object.keys(stats.category_data),
    datasets: [{
      data: Object.values(stats.category_data),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
      hoverOffset: 4
    }]
  };

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="card">
          <h3>本月總收入</h3>
          <p className="db-income">+NT$ {stats.total_income.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>本月總支出</h3>
          <p className="db-expense">-NT$ {stats.total_expense.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="card chart-container">
          <h3>本月支出佔比</h3>
          <div className="chart-wrapper">
            <Pie 
              data={pieData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.label || '';
                        let value = context.parsed || 0;
                        return `${label}: $${value.toLocaleString()}`; 
                      }
                    }
                  }
                }
              }} 
            />
          </div>
          <p className="chart-hint">將滑鼠移至圖表上方，即可查看各類別的詳細消費金額。</p>
        </div>
        
        <div className="card">
          <h3>近期交易 (前5筆)</h3>
          <ul className="recent-list">
            {stats.recent_transactions.map((t) => (
              <li key={t.id}>
                <div className="recent-info">
                  <span className="date">{t.transaction_date}</span>
                  <span className="category">
                    {t.category}{t.counterparty ? `：${t.counterparty}` : ''}
                  </span>
                  {t.note && <span className="note" style={{fontSize: '14px', color: '#5d6d6d'}}>{t.note}</span>}
                </div>
                <span className={t.type === 'EXPENSE' ? 'expense' : 'income'}>
                  {t.type === 'EXPENSE' ? '-' : '+'}{t.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;