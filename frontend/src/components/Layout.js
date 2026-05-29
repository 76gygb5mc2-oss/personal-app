import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LofiPlayer from './LofiPlayer';
import FoxPet from './FoxPet';
import {
  Box, Typography, IconButton, useMediaQuery,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Business as BusinessIcon,
  AttachMoney as MoneyIcon, Psychology as MindsetIcon, School as SchoolIcon,
  FitnessCenter as HealthIcon, CheckCircle as CheckIcon,
  Assessment as ReportsIcon, SmartToy as AIIcon,
  EmojiEvents as TrophyIcon, Menu as MenuIcon, Close as CloseIcon,
  LibraryBooks as ActivityIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { G } from '../theme';

const menuItems = [
  { text: 'Dashboard',    icon: <DashboardIcon />, path: '/' },
  { text: 'Business',     icon: <BusinessIcon />,  path: '/business' },
  { text: 'Best Idea',    icon: <TrophyIcon />,    path: '/best-idea' },
  { text: 'Work Tracker', icon: <MoneyIcon />,     path: '/financial' },
  { text: 'Activity Log', icon: <ActivityIcon />,  path: '/activity' },
  { text: 'Mindset',      icon: <MindsetIcon />,   path: '/mindset' },
  { text: 'Learning',     icon: <SchoolIcon />,    path: '/learning' },
  { text: 'Health',       icon: <HealthIcon />,    path: '/health' },
  { text: 'Debt Dashboard', icon: <CheckIcon />,   path: '/checkin' },
  { text: 'Reports',      icon: <ReportsIcon />,   path: '/reports' },
  { text: 'AI Advisor',   icon: <AIIcon />,        path: '/ai' },
];

/* ─────────────────────────────────────────────────────────
   COZY FOREST CANVAS — fireflies, rain, slow mist layers
───────────────────────────────────────────────────────── */
function CozyCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.current = { x: e.clientX, y: e.clientY }; });

    /* --- Fireflies --- */
    const fireflies = Array.from({ length: 38 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 900,
      r: Math.random() * 2.2 + 0.8,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.006 + 0.003,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      hue: 120 + Math.random() * 40,   // green hues
    }));

    /* --- Rain drops (very light) --- */
    const rain = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 900,
      len: Math.random() * 18 + 8,
      speed: Math.random() * 1.8 + 1.2,
      opacity: Math.random() * 0.07 + 0.02,
    }));

    /* --- Mist particles --- */
    const mist = Array.from({ length: 6 }, (_, i) => ({
      x: (i / 6) * 1400,
      y: H * 0.5 + Math.random() * H * 0.4,
      w: 300 + Math.random() * 400,
      h: 80 + Math.random() * 100,
      opacity: 0.025 + Math.random() * 0.03,
      speed: 0.12 + Math.random() * 0.1,
    }));

    /* --- Bokeh circles --- */
    const bokeh = Array.from({ length: 18 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 900,
      r: Math.random() * 28 + 10,
      opacity: Math.random() * 0.05 + 0.015,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    }));

    let raf, frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      /* ── BG gradient (warm dark forest) */
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0,   '#0d2618');
      bg.addColorStop(0.4, '#1a3d2b');
      bg.addColorStop(1,   '#0f2d1e');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* ── Warm candle glow at bottom-center */
      const candle = ctx.createRadialGradient(W * 0.5, H, 0, W * 0.5, H, H * 0.7);
      candle.addColorStop(0,   'rgba(95, 188, 110, 0.07)');
      candle.addColorStop(0.4, 'rgba(45, 106, 79,  0.04)');
      candle.addColorStop(1,   'transparent');
      ctx.fillStyle = candle;
      ctx.fillRect(0, 0, W, H);

      /* ── Mouse spotlight */
      const { x: mx, y: my } = mouse.current;
      const spot = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
      spot.addColorStop(0,   'rgba(148,204,171,0.08)');
      spot.addColorStop(0.5, 'rgba(71,133,89,0.04)');
      spot.addColorStop(1,   'transparent');
      ctx.fillStyle = spot;
      ctx.beginPath();
      ctx.arc(mx, my, 320, 0, Math.PI * 2);
      ctx.fill();

      /* ── Mist layers */
      mist.forEach(m => {
        m.x += m.speed;
        if (m.x > W + m.w / 2) m.x = -m.w / 2;
        const pulse = Math.sin(frame * 0.003 + m.x * 0.001) * 0.01;
        const g2 = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.w / 2);
        g2.addColorStop(0,   `rgba(148,204,171,${m.opacity + pulse})`);
        g2.addColorStop(0.6, `rgba(95,188,130,${(m.opacity + pulse) * 0.4})`);
        g2.addColorStop(1,   'transparent');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.ellipse(m.x, m.y, m.w / 2, m.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ── Bokeh blurs */
      bokeh.forEach(b => {
        b.phase += b.speed;
        const pulse = Math.sin(b.phase) * 0.015;
        const gb = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        gb.addColorStop(0,   `rgba(122,184,147,${b.opacity + pulse})`);
        gb.addColorStop(1,   'transparent');
        ctx.fillStyle = gb;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ── Rain */
      ctx.save();
      rain.forEach(r => {
        r.y += r.speed;
        if (r.y > H + r.len) r.y = -r.len;
        ctx.strokeStyle = `rgba(148,204,171,${r.opacity})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 1, r.y + r.len);
        ctx.stroke();
      });
      ctx.restore();

      /* ── Fireflies */
      fireflies.forEach(f => {
        f.phase += f.speed;
        f.x += f.vx + Math.sin(f.phase * 0.7) * 0.25;
        f.y += f.vy + Math.cos(f.phase * 0.5) * 0.2;
        if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
        if (f.y < 0) f.y = H; if (f.y > H) f.y = 0;

        /* mouse attraction */
        const dx = mx - f.x, dy = my - f.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          f.x += (dx / dist) * 0.4;
          f.y += (dy / dist) * 0.4;
        }

        const glow = Math.abs(Math.sin(f.phase));
        const alpha = 0.4 + glow * 0.55;
        const radius = f.r + glow * 1.2;

        // outer glow
        const gf = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius * 5);
        gf.addColorStop(0,   `hsla(${f.hue},70%,70%,${alpha * 0.35})`);
        gf.addColorStop(1,   'transparent');
        ctx.fillStyle = gf;
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius * 5, 0, Math.PI * 2);
        ctx.fill();

        // core dot
        ctx.fillStyle = `hsla(${f.hue},80%,80%,${alpha})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ── Subtle dot grid overlay */
      ctx.fillStyle = 'rgba(148,204,171,0.04)';
      for (let gx = 0; gx < W; gx += 44) {
        for (let gy = 0; gy < H; gy += 44) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      width: '100%', height: '100%',
    }} />
  );
}

/* ─────────────────────────────────────
   SW PG LOGO
───────────────────────────────────── */
function Logo({ size = 40 }) {
  return (
    <Box sx={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.28),
      background: `linear-gradient(135deg, ${G.fern} 0%, ${G.forest} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 ${size * 0.5}px rgba(71,133,89,0.5), 0 4px 14px rgba(0,0,0,0.4)`,
      border: `1px solid rgba(148,204,171,0.25)`,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      '&::after': {
        content: '""', position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%)',
      }
    }}>
      <Typography sx={{
        fontWeight: 900, color: G.foam, zIndex: 1,
        fontSize: size * 0.27, letterSpacing: '-0.5px',
        fontFamily: '"Georgia", serif',
        textShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }}>SW</Typography>
    </Box>
  );
}

/* ─────────────────────────────────────
   LAYOUT
───────────────────────────────────── */
export default function Layout() {
  const [open, setOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout }  = useAuth();
  const isMobile  = useMediaQuery('(max-width:900px)');

  const handleLogout = () => { logout(); navigate('/login'); };

  const navContent = (
    <Box sx={{
      width: 260, height: '100%', display: 'flex', flexDirection: 'column',
      background: 'rgba(13,38,24,0.97)',
      backdropFilter: 'blur(24px)',
      borderRight: `1px solid rgba(148,204,171,0.1)`,
    }}>
      {/* Brand */}
      <Box sx={{ p: 3.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Logo size={44} />
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: G.foam, letterSpacing: '-0.3px', lineHeight: 1.1 }}>
            SW PG
          </Typography>
          <Typography sx={{ fontSize: '0.58rem', color: 'rgba(232,245,238,0.35)', letterSpacing: 3, textTransform: 'uppercase' }}>
            Personal OS
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setOpen(false)} sx={{ ml: 'auto', color: 'rgba(232,245,238,0.4)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ mx: 2.5, height: 1, bgcolor: 'rgba(148,204,171,0.08)' }} />

      <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
        {menuItems.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setOpen(false); }}
                sx={{
                  borderRadius: 2.5, px: 2, py: 1.1,
                  bgcolor: active ? 'rgba(71,133,89,0.2)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(148,204,171,0.3)' : 'transparent'}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(71,133,89,0.12)',
                    borderColor: 'rgba(148,204,171,0.18)',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? G.mint : 'rgba(232,245,238,0.3)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{
                  fontWeight: active ? 700 : 400,
                  color: active ? G.foam : 'rgba(232,245,238,0.5)',
                  fontSize: '0.875rem', letterSpacing: '0.2px',
                }} />
                {active && <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: G.mint }} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User badge + logout */}
      <Box sx={{ p: 2.5 }}>
        <Box sx={{
          p: 2, borderRadius: 3,
          bgcolor: 'rgba(71,133,89,0.12)',
          border: '1px solid rgba(148,204,171,0.12)',
          display: 'flex', alignItems: 'center', gap: 1.5,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(220,50,50,0.12)', borderColor: 'rgba(248,113,113,0.2)' },
          transition: 'all 0.2s',
        }} onClick={handleLogout}>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%',
            background: `linear-gradient(135deg, ${G.fern}, ${G.pine})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: G.foam, fontWeight: 800, fontSize: '0.75rem' }}>
              {(user?.username || 'S')[0].toUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: G.foam, fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>
              {user?.username || 'Sirawdink'}
            </Typography>
            <Typography sx={{ color: 'rgba(232,245,238,0.35)', fontSize: '0.7rem' }}>
              Tap to sign out
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: G.forest }}>
      <CozyCanvas />

      {/* ── Desktop sidebar */}
      {!isMobile && (
        <Box sx={{
          width: 260, flexShrink: 0, position: 'fixed', top: 0, left: 0,
          height: '100vh', zIndex: 10,
        }}>
          {navContent}
        </Box>
      )}

      {/* ── Mobile drawer */}
      {isMobile && (
        <Drawer open={open} onClose={() => setOpen(false)}
          sx={{ '& .MuiDrawer-paper': { border: 'none' } }}>
          {navContent}
        </Drawer>
      )}

      {/* ── Main */}
      <Box sx={{
        flex: 1, ml: { md: '260px' },
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
      }}>
        {/* Top bar on mobile */}
        {isMobile && (
          <Box sx={{
            position: 'sticky', top: 0, zIndex: 10,
            px: 2, py: 1.5,
            bgcolor: 'rgba(13,38,24,0.88)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(148,204,171,0.1)',
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            <IconButton onClick={() => setOpen(true)} sx={{ color: G.mint }}>
              <MenuIcon />
            </IconButton>
            <Logo size={30} />
            <Typography fontWeight={700} sx={{ color: G.foam, flex: 1 }}>
              {menuItems.find(m => m.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
          </Box>
        )}

        <Outlet />
      </Box>

      {/* ── Lo-fi player (all pages) */}
      <LofiPlayer />

      {/* ── Fox pet (all pages) */}
      <FoxPet />
    </Box>
  );
}
