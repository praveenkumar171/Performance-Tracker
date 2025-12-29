import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
    }}>
      {/* LEFT SIDE - Form (Grey) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3a3a3a',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#4a4a4a',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          padding: '50px 40px',
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center', color: 'white', fontWeight: 700 }}>
            Welcome Back
          </h1>
          <p style={{ textAlign: 'center', color: '#00BFFF', marginBottom: '30px', fontSize: '14px' }}>
            Performance Tracker
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: 600, fontSize: '14px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #666',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: 600, fontSize: '14px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #666',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p style={{
                color: '#ff6b6b',
                marginBottom: '16px',
                fontSize: '13px',
                padding: '10px',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderRadius: '4px',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#888' : '#00BFFF',
                color: loading ? '#ccc' : '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#999' }}>
              Don't have an account?{' '}
              <a
                href="/register"
                style={{ color: '#00BFFF', textDecoration: 'none', fontWeight: 600 }}
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Image Background */}
      <div style={{
        flex: 1,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 800%27%3E%3Crect fill=%27%23000%27 width=%271200%27 height=%27800%27/%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
      }}>
        {/* Deadpool Character - ASCII Art Style */}
        <div style={{
          fontSize: '14px',
          fontFamily: 'monospace',
          color: '#fff',
          whiteSpace: 'pre',
          textAlign: 'center',
          lineHeight: '1.2',
          textShadow: '0 0 10px rgba(0, 191, 255, 0.3)',
        }}>
          {`
    ╔════════════════════════════════╗
    ║     PERFORMANCE TRACKER        ║
    ║        DEADPOOL EDITION        ║
    ╚════════════════════════════════╝

    "If I'm not supposed to eat all the
     red starburst, why are they red?"
    
         🔫 Stay Focused 🔫
         Track Your Goals
         Kill Your Targets
          `}
        </div>
      </div>
    </div>
  );
};

export default Login;
