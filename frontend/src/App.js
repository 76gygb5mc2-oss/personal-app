import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Business  from './pages/Business';
import BestIdea  from './pages/BestIdea';
import Financial from './pages/Financial';
import Mindset   from './pages/Mindset';
import Learning  from './pages/Learning';
import Health    from './pages/Health';
import Checkin   from './pages/Checkin';
import Reports   from './pages/Reports';
import AIAdvisor from './pages/AIAdvisor';
import ActivityLog from './pages/ActivityLog';
import Layout    from './components/Layout';
import LoginPage from './pages/LoginPage';
import { D, FONTS } from './theme';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#ffffff', contrastText: '#000000' },
    secondary:  { main: 'rgba(255,255,255,0.7)', contrastText: '#000000' },
    background: { default: '#080808', paper: '#141414' },
    text:       { primary: '#ffffff', secondary: 'rgba(255,255,255,0.5)' },
    success:    { main: '#22c55e' },
    error:      { main: '#ef4444' },
    divider:    'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: FONTS.sans,
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 600, letterSpacing: '-0.3px' },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.7)', borderColor: 'rgba(255,255,255,0.12)' },
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0e0e0e',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, textTransform: 'none', fontWeight: 500,
          fontFamily: FONTS.sans,
          transition: 'all 0.2s',
        },
        contained: {
          background: '#1a1a1a', color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: 'none',
          '&:hover': { background: '#222222', boxShadow: '0 0 16px rgba(255,255,255,0.06)' },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.7)',
          '&:hover': { borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)' },
        },
      }
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 500, borderRadius: 6, fontFamily: FONTS.sans } } },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#141414',
            color: '#ffffff',
            fontFamily: FONTS.sans,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.4)', borderWidth: 1 },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.3)', fontFamily: FONTS.sans },
          '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255,255,255,0.6)' },
          '& .MuiInputBase-input': { color: '#ffffff', fontFamily: FONTS.sans },
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px !important',
          backgroundColor: '#141414',
          color: '#ffffff',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { boxShadow: '0 4px 24px rgba(0,0,0,0.5)' },
        }
      }
    },
    MuiAccordionSummary: { styleOverrides: { root: { color: '#ffffff' } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)' },
        bar:  { borderRadius: 4, background: 'rgba(255,255,255,0.7)' },
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(255,255,255,0.08)' },
        indicator: { backgroundColor: '#ffffff', height: 1 },
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', fontWeight: 400, fontFamily: FONTS.sans,
          color: 'rgba(255,255,255,0.4)',
          '&.Mui-selected': { color: '#ffffff', fontWeight: 500 },
        }
      }
    },
    MuiDivider:  { styleOverrides: { root: { borderColor: 'rgba(255,255,255,0.08)' } } },
    MuiCheckbox: { styleOverrides: { root: { color: 'rgba(255,255,255,0.2)', '&.Mui-checked': { color: '#ffffff' } } } },
    MuiSelect:   { styleOverrides: { root: { color: '#ffffff', fontFamily: FONTS.sans }, icon: { color: 'rgba(255,255,255,0.4)' } } },
    MuiList:     { styleOverrides: { root: { backgroundColor: 'transparent' } } },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontFamily: FONTS.sans },
        standardInfo: { backgroundColor: 'rgba(59,130,246,0.08)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(59,130,246,0.2)' },
        standardError: { backgroundColor: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
      }
    },
  }
});

/* Protected route — redirects to /login if not logged in */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user, login } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={login} />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index         element={<Dashboard />} />
        <Route path="business"       element={<Business />} />
        <Route path="best-idea"      element={<BestIdea />} />
        <Route path="financial"      element={<Financial />} />
        <Route path="mindset"        element={<Mindset />} />
        <Route path="learning"       element={<Learning />} />
        <Route path="health"         element={<Health />} />
        <Route path="spotify-callback" element={<Health />} />
        <Route path="activity"       element={<ActivityLog />} />
        <Route path="checkin"        element={<Checkin />} />
        <Route path="reports"        element={<Reports />} />
        <Route path="ai"             element={<AIAdvisor />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
