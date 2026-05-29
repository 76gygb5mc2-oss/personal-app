import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { G } from '../theme';

/* Firefly canvas — same as Layout but self-contained */
function FireflyBg() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    const flies = Array.from({ length: 45 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 1, phase: Math.random() * Math.PI * 2,
      spd: Math.random() * 0.005 + 0.003,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.3,
      hue: 120 + Math.random() * 40,
    }));
    const mist = Array.from({ length: 5 }, (_, i) => ({
      x: (i / 5) * W, y: H * 0.6 + Math.random() * H * 0.3,
      w: 350 + Math.random() * 300, spd: 0.1 + Math.random() * 0.08,
    }));

    let raf, frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0d2618'); bg.addColorStop(1, '#0a1f12');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      mist.forEach(m => {
        m.x += m.spd; if (m.x > W + m.w / 2) m.x = -m.w / 2;
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.w / 2);
        g.addColorStop(0, 'rgba(148,204,171,0.025)'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath();
        ctx.ellipse(m.x, m.y, m.w / 2, 60, 0, 0, Math.PI * 2); ctx.fill();
      });

      flies.forEach(f => {
        f.phase += f.spd; f.x += f.vx + Math.sin(f.phase) * 0.15; f.y += f.vy;
        if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
        if (f.y < 0) f.y = H; if (f.y > H) f.y = 0;
        const glow = Math.abs(Math.sin(f.phase));
        const gf = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
        gf.addColorStop(0, `hsla(${f.hue},70%,65%,${glow * 0.3})`);
        gf.addColorStop(1, 'transparent');
        ctx.fillStyle = gf; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `hsla(${f.hue},80%,78%,${0.4 + glow * 0.55})`;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r + glow, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

// User "database" stored in localStorage
const USERS_KEY = 'swpg_accounts';
const getUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; } };
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

// Real SHA-256 hash using browser crypto API (NOT btoa/base64)
async function hashPassword(password) {
  const salt = 'sirawdink-os-2024'; // static salt for local app
  const msgBuffer = new TextEncoder().encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({ username: '', password: '', confirm: '', pin: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleLogin = async () => {
    if (!form.username || !form.password) { setError('Enter username and password'); return; }
    setLoading(true);
    try {
      const users = getUsers();
      const u = users[form.username.toLowerCase()];
      if (!u) { setError('Account not found. Please register first.'); setLoading(false); return; }
      const hashed = await hashPassword(form.password);
      if (u.password !== hashed) { setError('Incorrect password.'); setLoading(false); return; }
      onLogin({ username: u.username, pin: u.pin });
    } catch (e) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.username || form.username.length < 3) { setError('Username must be at least 3 characters'); return; }
    if (!form.password || form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!form.pin || form.pin.length !== 4 || !/^\d{4}$/.test(form.pin)) { setError('PIN must be exactly 4 digits'); return; }

    const users = getUsers();
    if (users[form.username.toLowerCase()]) { setError('Username already taken'); return; }

    setLoading(true);
    try {
      const hashed = await hashPassword(form.password);
      users[form.username.toLowerCase()] = {
        username: form.username,
        password: hashed, // SHA-256 hash via crypto.subtle
        pin: form.pin,
        createdAt: new Date().toISOString(),
      };
      saveUsers(users);
      setSuccess('Account created! You can now log in.');
      setForm({ username: '', password: '', confirm: '', pin: '' });
      setMode('login');
    } catch (e) {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2, bgcolor: 'rgba(13,38,24,0.7)', color: G.foam,
      '& fieldset': { borderColor: 'rgba(148,204,171,0.2)' },
      '&:hover fieldset': { borderColor: G.mint },
      '&.Mui-focused fieldset': { borderColor: G.mint, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { color: G.sage },
    '& .MuiInputLabel-root.Mui-focused': { color: G.mint },
    '& input': { color: G.foam },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <FireflyBg />

      <Box sx={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 420, mx: 3,
      }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{
            width: 68, height: 68, borderRadius: 4, mx: 'auto', mb: 2,
            background: `linear-gradient(135deg, ${G.fern} 0%, ${G.forest} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 40px rgba(71,133,89,0.5), 0 8px 24px rgba(0,0,0,0.5)`,
            border: '1px solid rgba(148,204,171,0.25)',
          }}>
            <Typography sx={{ fontWeight: 900, color: G.foam, fontSize: '1.3rem', fontFamily: '"Georgia", serif' }}>
              SW
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: G.foam, letterSpacing: '-0.5px' }}>
            SW PG
          </Typography>
          <Typography sx={{ color: G.sage, fontSize: '0.8rem', letterSpacing: 3, textTransform: 'uppercase' }}>
            Personal OS
          </Typography>
        </Box>

        {/* Card */}
        <Box sx={{
          bgcolor: 'rgba(13,38,24,0.82)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(148,204,171,0.14)',
          borderRadius: 4,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          p: 4,
        }}>
          {/* Mode toggle */}
          <Box sx={{ display: 'flex', mb: 4, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 0.5 }}>
            {[
              { key: 'login', label: 'Sign In', icon: <LoginIcon sx={{ fontSize: 16 }} /> },
              { key: 'register', label: 'Register', icon: <PersonAddIcon sx={{ fontSize: 16 }} /> },
            ].map(m => (
              <Box key={m.key} onClick={() => { setMode(m.key); setError(''); setSuccess(''); }}
                sx={{
                  flex: 1, py: 1, borderRadius: 1.5, cursor: 'pointer', textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8,
                  bgcolor: mode === m.key ? 'rgba(71,133,89,0.25)' : 'transparent',
                  border: `1px solid ${mode === m.key ? 'rgba(148,204,171,0.3)' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}>
                {m.icon}
                <Typography sx={{ fontSize: '0.85rem', fontWeight: mode === m.key ? 700 : 500,
                  color: mode === m.key ? G.mint : G.sage }}>
                  {m.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(100,20,20,0.5)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', '& .MuiAlert-icon': { color: '#f87171' } }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(20,60,30,0.6)', color: G.mint, border: `1px solid rgba(148,204,171,0.3)` }}>{success}</Alert>}

          {/* Username */}
          <TextField fullWidth label="Username" value={form.username}
            onChange={e => set('username', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && mode === 'login' && handleLogin()}
            sx={inputSx} />

          {/* Password */}
          <TextField fullWidth label="Password" type={showPw ? 'text' : 'password'} value={form.password}
            onChange={e => set('password', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && mode === 'login' && handleLogin()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw(!showPw)} edge="end" sx={{ color: G.sage }}>
                    {showPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={inputSx} />

          {/* Register-only fields */}
          {mode === 'register' && (
            <>
              <TextField fullWidth label="Confirm Password" type="password" value={form.confirm}
                onChange={e => set('confirm', e.target.value)} sx={inputSx} />

              <Box sx={{ mb: 1 }}>
                <Typography sx={{ color: G.sage, fontSize: '0.78rem', mb: 1 }}>
                  🔐 Set a 4-digit PIN for your Financial page
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 2 }}>
                  {[0, 1, 2, 3].map(i => (
                    <Box
                      key={i}
                      sx={{
                        width: 52, height: 56, borderRadius: 2,
                        bgcolor: 'rgba(13,38,24,0.7)',
                        border: `2px solid ${form.pin.length > i ? G.mint : 'rgba(148,204,171,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', color: G.foam, fontWeight: 800,
                        transition: 'border-color 0.2s',
                      }}
                    >
                      {form.pin[i] ? '●' : ''}
                    </Box>
                  ))}
                </Box>
                {/* PIN numpad */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1 }}>
                  {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, idx) => (
                    <Box key={idx} onClick={() => {
                      if (k === '') return;
                      if (k === '⌫') { set('pin', form.pin.slice(0, -1)); return; }
                      if (form.pin.length < 4) set('pin', form.pin + k);
                    }} sx={{
                      py: 1.5, borderRadius: 2, textAlign: 'center', cursor: k === '' ? 'default' : 'pointer',
                      bgcolor: k === '' ? 'transparent' : 'rgba(71,133,89,0.1)',
                      border: `1px solid ${k === '' ? 'transparent' : 'rgba(148,204,171,0.15)'}`,
                      color: G.foam, fontWeight: 700, fontSize: '1rem',
                      transition: 'all 0.15s',
                      '&:hover': k !== '' ? { bgcolor: 'rgba(71,133,89,0.25)', borderColor: 'rgba(148,204,171,0.35)' } : {},
                    }}>{k}</Box>
                  ))}
                </Box>
              </Box>
            </>
          )}

          {/* Submit */}
          <Button fullWidth variant="contained" disabled={loading}
            onClick={mode === 'login' ? handleLogin : handleRegister}
            sx={{
              mt: 2, py: 1.6, borderRadius: 2, fontWeight: 800, fontSize: '1rem',
              background: `linear-gradient(135deg, ${G.fern} 0%, ${G.pine} 100%)`,
              color: G.foam, letterSpacing: 0.5,
              boxShadow: '0 4px 20px rgba(45,106,79,0.45)',
              '&:hover': { boxShadow: '0 6px 28px rgba(45,106,79,0.6)', transform: 'translateY(-1px)' },
              '&.Mui-disabled': { bgcolor: 'rgba(71,133,89,0.2)', color: G.sage },
            }}>
            {loading ? <CircularProgress size={22} sx={{ color: G.mint }} /> :
              mode === 'login' ? '→ Sign In' : '→ Create Account'}
          </Button>

          {mode === 'login' && (
            <Typography sx={{ textAlign: 'center', mt: 2.5, color: 'rgba(148,204,171,0.4)', fontSize: '0.78rem' }}>
              Don't have an account? Click <Box component="span" onClick={() => setMode('register')}
                sx={{ color: G.mint, cursor: 'pointer', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}>
                Register
              </Box> to create one.
            </Typography>
          )}
        </Box>

        <Typography sx={{ textAlign: 'center', mt: 3, color: 'rgba(148,204,171,0.25)', fontSize: '0.72rem' }}>
          Personal & private — data stays on this device
        </Typography>
      </Box>
    </Box>
  );
}
