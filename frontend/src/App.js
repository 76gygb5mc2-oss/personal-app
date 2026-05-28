import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Business from './pages/Business';
import Financial from './pages/Financial';
import Communication from './pages/Communication';
import Mindset from './pages/Mindset';
import Relationships from './pages/Relationships';
import Learning from './pages/Learning';
import Health from './pages/Health';
import Checkin from './pages/Checkin';
import Reports from './pages/Reports';
import AIAdvisor from './pages/AIAdvisor';

// Layout
import Layout from './components/Layout';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#0a1929',
      paper: '#1e293b',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="business" element={<Business />} />
              <Route path="financial" element={<Financial />} />
              <Route path="communication" element={<Communication />} />
              <Route path="mindset" element={<Mindset />} />
              <Route path="relationships" element={<Relationships />} />
              <Route path="learning" element={<Learning />} />
              <Route path="health" element={<Health />} />
              <Route path="checkin" element={<Checkin />} />
              <Route path="reports" element={<Reports />} />
              <Route path="ai" element={<AIAdvisor />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
