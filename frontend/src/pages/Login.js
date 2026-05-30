import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { D, FONTS } from '../theme';

/* Moving border button — inspired by aceternity/moving-border from 21st.dev */
function MovingBorderButton({ children, onClick, disabled, type = 'button' }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative',
        width: '100%', padding: '11px 0',
        borderRadius: 10, overflow: 'hidden',
        background: hovered ? D.bg4 : D.bg3,
        border: `1px solid ${hovered ? D.border3 : D.border2}`,
        color: D.text1, fontWeight: 600,
        fontSize: '0.875rem', letterSpacing: '0.2px',
        fontFamily: FONTS.sans, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: pressed ? 'scale(0.99)' : 'none',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '0 0 20px rgba(255,255,255,0.06)' : 'none',
      }}
    >
      {children}
    </button>
  );
}

/* Dark minimal input */
function DarkInput({ label, type = 'text', value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontSize: '0.75rem', fontWeight: 500,
        color: D.text3, marginBottom: 6, fontFamily: FONTS.sans,
        letterSpacing: '0.3px',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 14px',
          borderRadius: 8, boxSizing: 'border-box',
          background: D.bg2,
          border: `1px solid ${focused ? D.border3 : D.border1}`,
          color: D.text1, fontSize: '0.875rem',
          fontFamily: FONTS.sans, outline: 'none',
          transition: 'border-color 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(255,255,255,0.04)' : 'none',
        }}
      />
    </div>
  );
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: D.bg0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.sans, position: 'relative', overflow: 'hidden',
      px: 2,
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 360,
        background: D.bg1,
        border: `1px solid ${D.border1}`,
        borderRadius: 16, padding: '36px 32px',
        position: 'relative', zIndex: 1,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: D.bg3, border: `1px solid ${D.border2}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: D.text1, fontFamily: FONTS.mono }}>SW</span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: D.text1, marginBottom: 4, letterSpacing: '-0.3px' }}>
            Sign in
          </div>
          <div style={{ fontSize: '0.8rem', color: D.text4 }}>
            Welcome back to Sirawdink OS
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 12px', borderRadius: 8, marginBottom: 16,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', fontSize: '0.8rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <DarkInput
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="your username"
          />
          <DarkInput
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <div style={{ marginTop: 20 }}>
            <MovingBorderButton type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </MovingBorderButton>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: D.text4, fontSize: '0.78rem', fontFamily: FONTS.sans,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = D.text2}
            onMouseLeave={e => e.target.style.color = D.text4}
          >
            Don't have an account? <span style={{ color: D.text2, fontWeight: 500 }}>Register</span>
          </button>
        </div>
      </div>
    </Box>
  );
}
