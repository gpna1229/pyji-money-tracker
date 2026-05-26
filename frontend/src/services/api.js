const BASE_URL = 'http://127.0.0.1:8001/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('pyji_token')}`
});

export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers }
  });

  if (response.status === 401) {
    localStorage.removeItem('pyji_token');
    window.location.href = '/'; 
    throw new Error('登入已過期，請重新登入');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || '操作失敗');
  }
  return response.json();
};