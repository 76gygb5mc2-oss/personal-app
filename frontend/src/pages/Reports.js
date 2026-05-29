import React from 'react';
import { Container, Typography, Box, Card, CardContent, Chip, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { G } from '../theme';

const stats = [
  { label: 'Business Ideas Read', value: 4, max: 10, icon: <TrendingUpIcon />, color: G.green },
  { label: 'Mindset Principles', value: 2, max: 4, icon: <PsychologyIcon />, color: G.foam },
  { label: 'Learning Lessons', value: 3, max: 8, icon: <SchoolIcon />, color: '#0369a1' },
  { label: 'Workouts Logged', value: 5, max: 7, icon: <FitnessCenterIcon />, color: '#b91c1c' },
  { label: 'Finance Tracked', value: 3, max: 30, icon: <AttachMoneyIcon />, color: G.sage },
];

const weekActivity = [
  { day: 'Mon', score: 85 }, { day: 'Tue', score: 60 }, { day: 'Wed', score: 95 },
  { day: 'Thu', score: 40 }, { day: 'Fri', score: 75 }, { day: 'Sat', score: 90 }, { day: 'Sun', score: 30 },
];

export default function Reports() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: G.foam }}>📊 Reports</Typography>
        <Typography sx={{ color: G.sage, mt: 0.5 }}>Your progress across all modules this month</Typography>
      </Box>

      {/* Overall Score */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ background: G.heroGrad, p: 4, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h1" fontWeight={900} sx={{ color: G.pearl, lineHeight: 1, fontSize: '5rem' }}>72</Typography>
            <Typography sx={{ color: 'rgba(245,240,232,0.6)', fontWeight: 600 }}>Overall Score</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: G.pearl, mb: 0.5 }}>Good Progress 📈</Typography>
            <Typography sx={{ color: 'rgba(245,240,232,0.7)', lineHeight: 1.7 }}>
              You're consistent in fitness and learning. Your finance tracking needs more attention this week.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Chip label="Streak: 5 days 🔥" sx={{ bgcolor: 'rgba(71,133,89,0.3)', color: '#a8d8b8', fontWeight: 700 }} />
              <Chip label="Best: Fitness" sx={{ bgcolor: 'rgba(245,240,232,0.15)', color: G.pearl, fontWeight: 600 }} />
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Module Stats */}
      <Typography variant="h6" fontWeight={700} sx={{ color: G.foam, mb: 2 }}>Module Breakdown</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
        {stats.map(s => (
          <Card key={s.label} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${s.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </Box>
                <Typography fontWeight={700} sx={{ color: G.foam, fontSize: '0.9rem' }}>{s.label}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                <Typography sx={{ color: G.sage, alignSelf: 'flex-end', mb: 0.5 }}>/ {s.max}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={(s.value / s.max) * 100}
                sx={{ height: 6, borderRadius: 3, bgcolor: `${s.color}18`, '& .MuiLinearProgress-bar': { bgcolor: s.color } }} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Weekly Activity */}
      <Typography variant="h6" fontWeight={700} sx={{ color: G.foam, mb: 2 }}>This Week's Activity</Typography>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 120 }}>
            {weekActivity.map(d => (
              <Box key={d.day} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: '100%', borderRadius: 1.5, transition: 'all 0.3s',
                  bgcolor: d.score >= 80 ? G.green : d.score >= 60 ? G.greyBlue : G.pearlDark,
                  height: `${(d.score / 100) * 90}px`,
                  '&:hover': { filter: 'brightness(1.1)', transform: 'scaleY(1.05)', cursor: 'pointer' } }} />
                <Typography variant="caption" fontWeight={600} sx={{ color: G.sage }}>{d.day}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            {[{ label: 'High (80+)', color: G.green }, { label: 'Medium (60–79)', color: G.sage }, { label: 'Low (<60)', color: G.pearlDark }].map(l => (
              <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: l.color }} />
                <Typography variant="caption" sx={{ color: G.sage }}>{l.label}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
