import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, CircularProgress } from '@mui/material';
import { dashboardService } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardService.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Week Financial</Typography>
            <Typography>Income: ${data?.week_income?.toFixed(2) || 0}</Typography>
            <Typography>Expenses: ${data?.week_expenses?.toFixed(2) || 0}</Typography>
            <Typography color={data?.week_net >= 0 ? 'success.main' : 'error.main'}>
              Net: ${data?.week_net?.toFixed(2) || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Today's Tasks</Typography>
            <Typography>{data?.today_tasks?.length || 0} tasks due today</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Habits</Typography>
            <Typography>
              {data?.habits?.completed || 0} / {data?.habits?.total || 0} completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Projects</Typography>
            {data?.active_projects?.map(project => (
              <Box key={project.id} sx={{ my: 1 }}>
                <Typography>{project.name} - {project.progress_percentage}%</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
