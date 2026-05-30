import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LofiPlayer from './LofiPlayer';
import FoxPet from './FoxPet';
import {
  Box, Typography, IconButton, useMediaQuery, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Business as BusinessIcon,
  AttachMoney as MoneyIcon, Psychology as MindsetIcon, School as SchoolIcon,
  FitnessCenter as HealthIcon, CheckCircle as CheckIcon,
  Assessment as ReportsIcon, SmartToy as AIIcon,
  EmojiEvents as TrophyIcon, Menu as MenuIcon, Close as CloseIcon,
  LibraryBooks as ActivityIcon, Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { D, FONTS } from '../theme';

const menuItems = [
  { text: 'Dashboard',     icon: <DashboardIcon />, path: '/' },
  { text: 'Business',      icon: <BusinessIcon />,  path: '/business' },
  { text: 'Best Idea',     icon: <TrophyIcon />,    path: '/best-idea' },
  { text: 'Work Tracker',  icon: <MoneyIcon />,     path: '/financial' },
  { text: 'Activity Log',  icon: <ActivityIcon />,  path: '/activity' },
  { text: 'Mindset',       icon: <MindsetIcon />,   path: '/mindset' },
  { text: 'Learning',      icon: <SchoolIcon />,    path: '/learning' },
  { text: 'Health',        icon: <HealthIcon />,    path: '/health' },
  { text: 'Debt Dashboard',icon: <CheckIcon />,     path: '/checkin' },
  { text: 'Reports',       icon: <ReportsIcon />,   path: '/reports' },
  { text: 'AI Advisor',    icon: <AIIcon />,        path: '/ai' },
];

/* ── Logo mark ── */
function Logo({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: D.bg3,
      border: `1px solid ${D.border2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontWeight: 700, color: D.text1,
        fontSize: size * 0.3, letterSpacing: '-0.5px',
        fontFamily: FONTS.mono,
      }}>SW</span>
    </div>
  );
}

/* ── Sidebar nav content ── */
function NavContent({ onClose, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{
      width: 240, height: '100%',
      display: 'flex', flexDirection: 'column',
      background: D.sidebarBg,
      borderRight: `1px solid ${D.sidebarBorder}`,
      fontFamily: FONTS.sans,
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={30} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: D.text1, letterSpacing: '-0.2px' }}>
            SW PG
          </div>
          <div style={{ fontSize: '0.62rem', color: D.text4, letterSpacing: 2, textTransform: 'uppercase' }}>
            Personal OS
          </div>
        </div>
        {isMobile && (
          <IconButton onClick={onClose} size="small" sx={{ color: D.text4, '&:hover': { color: D.text2 } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: D.border0, margin: '0 16px 8px' }} />

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        {menuItems.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.text}
              onClick={() => { navigate(item.path); if (isMobile) onClose?.(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 10px', borderRadius: 8,
                background: active ? D.bg3 : 'transparent',
                border: `1px solid ${active ? D.border1 : 'transparent'}`,
                cursor: 'pointer', marginBottom: 2,
                transition: 'all 0.15s',
                color: active ? D.text1 : D.text3,
                fontSize: '0.82rem', fontWeight: active ? 500 : 400,
                fontFamily: FONTS.sans, textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = D.bg2; e.currentTarget.style.color = D.text2; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = D.text3; } }}
            >
              <span style={{ fontSize: 16, display: 'flex', opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.text}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: D.text2, flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>

      {/* User + logout */}
      <div style={{ padding: '12px 8px' }}>
        <div style={{ height: 1, background: D.border0, marginBottom: 12 }} />
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 8,
            background: 'transparent', border: `1px solid transparent`,
            cursor: 'pointer', transition: 'all 0.15s',
            fontFamily: FONTS.sans,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: D.bg4, border: `1px solid ${D.border1}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, color: D.text2, flexShrink: 0,
          }}>
            {(user?.username || 'S')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, color: D.text2 }}>{user?.username || 'Sirawdink'}</div>
            <div style={{ fontSize: '0.65rem', color: D.text4 }}>Sign out</div>
          </div>
          <LogoutIcon style={{ fontSize: 14, color: D.text4 }} />
        </button>
      </div>
    </div>
  );
}

/* ── Main layout ── */
export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: D.bg1, fontFamily: FONTS.sans }}>

      {/* Desktop sidebar */}
      {!isMobile && (
        <Box sx={{ width: 240, flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 10 }}>
          <NavContent isMobile={false} />
        </Box>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          sx={{ '& .MuiDrawer-paper': { border: 'none', background: 'transparent' } }}
        >
          <NavContent isMobile onClose={() => setOpen(false)} />
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, ml: { md: '240px' }, minHeight: '100vh', position: 'relative' }}>

        {/* Mobile top bar */}
        {isMobile && (
          <Box sx={{
            position: 'sticky', top: 0, zIndex: 10,
            px: 2, py: 1.5,
            bgcolor: 'rgba(8,8,8,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${D.border0}`,
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            <IconButton onClick={() => setOpen(true)} size="small" sx={{ color: D.text3 }}>
              <MenuIcon />
            </IconButton>
            <Logo size={26} />
            <Typography sx={{ color: D.text2, fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>
              {menuItems.find(m => m.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
          </Box>
        )}

        <Outlet />
      </Box>

      <LofiPlayer />
      <FoxPet />
    </Box>
  );
}
