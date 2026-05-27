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

  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem('pyji_token');
    window.location.href = '/'; 
    throw new Error('登入已過期，請重新登入');
  }

  if (!response.ok) {
    throw data;
  }
  return data;
};