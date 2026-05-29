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
import { G }     from './theme';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: G.mid,    contrastText: G.foam },
    secondary:  { main: G.pine,  contrastText: G.foam },
    background: { default: G.forest, paper: 'rgba(13,38,24,0.85)' },
    text:       { primary: G.foam, secondary: G.mint },
    success:    { main: G.mid },
    divider:    'rgba(148,204,171,0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.5px', color: G.foam },
    h5: { fontWeight: 700, letterSpacing: '-0.3px', color: G.foam },
    h6: { fontWeight: 700, color: G.foam },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(13,38,24,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid rgba(148,204,171,0.12)`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.2s, transform 0.2s',
          '&:hover': { boxShadow: '0 8px 36px rgba(0,0,0,0.4)' },
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(13,38,24,0.72)',
          backdropFilter: 'blur(20px)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10, textTransform: 'none', fontWeight: 700,
          transition: 'all 0.2s',
          '&:hover': { transform: 'translateY(-1px)' },
        },
        contained: {
          background: G.btnGrad, color: G.foam,
          boxShadow: '0 2px 10px rgba(45,106,79,0.35)',
          '&:hover': { boxShadow: '0 4px 18px rgba(45,106,79,0.45)' },
        },
        outlined: {
          borderColor: 'rgba(148,204,171,0.25)',
          color: G.mint,
          '&:hover': { borderColor: G.mint, bgcolor: 'rgba(71,133,89,0.08)' },
        },
      }
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(13,38,24,0.6)',
            color: G.foam,
            '& fieldset': { borderColor: 'rgba(148,204,171,0.18)' },
            '&:hover fieldset': { borderColor: G.mint },
            '&.Mui-focused fieldset': { borderColor: G.mint, borderWidth: 2 },
          },
          '& .MuiInputLabel-root': { color: G.sage },
          '& .MuiInputLabel-root.Mui-focused': { color: G.mint },
          '& .MuiInputBase-input': { color: G.foam },
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid rgba(148,204,171,0.14)`,
          borderRadius: '12px !important',
          backgroundColor: 'rgba(13,38,24,0.65)',
          backdropFilter: 'blur(16px)',
          color: G.foam,
          '&:before': { display: 'none' },
          '&.Mui-expanded': { boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
        }
      }
    },
    MuiAccordionSummary: { styleOverrides: { root: { color: G.foam } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: 'rgba(71,133,89,0.1)' },
        bar:  { borderRadius: 8, background: G.btnGrad },
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: { borderBottom: `1px solid rgba(148,204,171,0.14)` },
        indicator: { backgroundColor: G.mint, height: 3, borderRadius: 3 },
      }
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, color: G.sage, '&.Mui-selected': { color: G.mint } }
      }
    },
    MuiDivider:  { styleOverrides: { root: { borderColor: 'rgba(148,204,171,0.12)' } } },
    MuiCheckbox: { styleOverrides: { root: { color: `rgba(148,204,171,0.25)`, '&.Mui-checked': { color: G.mid } } } },
    MuiSelect:   { styleOverrides: { root: { color: G.foam }, icon: { color: G.sage } } },
    MuiList:     { styleOverrides: { root: { backgroundColor: 'transparent' } } },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
        standardInfo: { backgroundColor: 'rgba(13,38,24,0.8)', color: G.mint, border: '1px solid rgba(148,204,171,0.2)' },
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
