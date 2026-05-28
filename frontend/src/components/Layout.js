import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, Business as BusinessIcon,
  AttachMoney as MoneyIcon, RecordVoiceOver as CommunicationIcon,
  Psychology as MindsetIcon, People as PeopleIcon, School as SchoolIcon,
  FitnessCenter as HealthIcon, CheckCircle as CheckIcon,
  Assessment as ReportsIcon, SmartToy as AIIcon, Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Business', icon: <BusinessIcon />, path: '/business' },
  { text: 'Financial', icon: <MoneyIcon />, path: '/financial' },
  { text: 'Communication', icon: <CommunicationIcon />, path: '/communication' },
  { text: 'Mindset', icon: <MindsetIcon />, path: '/mindset' },
  { text: 'Relationships', icon: <PeopleIcon />, path: '/relationships' },
  { text: 'Learning', icon: <SchoolIcon />, path: '/learning' },
  { text: 'Health', icon: <HealthIcon />, path: '/health' },
  { text: 'Check-in', icon: <CheckIcon />, path: '/checkin' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'AI Advisor', icon: <AIIcon />, path: '/ai' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Sirawdink OS
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.username}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
