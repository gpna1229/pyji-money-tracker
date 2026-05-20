import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    setError(null)
    
    const googleToken = credentialResponse.credential 

    try {
      const response = await fetch('http://127.0.0.1:8001/api/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: googleToken
        }),
      })

      if (!response.ok) {
        throw new Error('後端驗證失敗，請檢查 Token 或後端 MySQL 連線')
      }

      const data = await response.json()
      
      console.log('🎉 後端登入成功，回傳資料：', data)
      
      localStorage.setItem('pyji_token', data.access_token)
      
      setUser(data.user)

    } catch (err) {
      console.error('登入失敗：', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    console.log('Google 登入失敗')
    setError('Google 驗證中斷或失敗')
  }

  const handleLogout = () => {
    localStorage.removeItem('pyji_token')
    setUser(null)
  }

  return (
    <div className="login-container">
      <h1>Pyji 記帳</h1>
      
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
      
      {loading ? (
        <p>安全驗證中，請稍候...</p>
      ) : user ? (
        <div className="welcome-box">
          <h3>歡迎回來，{user.name}！</h3>
          <p>電子信箱：{user.email}</p>
          <p style={{ color: '#4caf50', fontSize: '14px' }}>已成功與 MySQL 資料庫連線</p>
          <button onClick={handleLogout} className="logout-btn">登出系統</button>
        </div>
      ) : (
        <div className="login-box">
          <p>請使用 Google 帳號登入以開始記帳</p>
          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App