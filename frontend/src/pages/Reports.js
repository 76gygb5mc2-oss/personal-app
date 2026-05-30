import React from 'react';
import { Container, Typography, Box, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { D, FONTS } from '../theme';
import NumberTicker from '../components/ui/NumberTicker';
import ShinyText from '../components/ui/ShinyText';
import BorderBeam from '../components/ui/BorderBeam';

const stats = [
  { label: 'Business Ideas Read', value: 4,  max: 10, icon: <TrendingUpIcon />,    color: D.text1 },
  { label: 'Mindset Principles',  value: 2,  max: 4,  icon: <PsychologyIcon />,    color: D.text2 },
  { label: 'Learning Lessons',    value: 3,  max: 8,  icon: <SchoolIcon />,        color: D.text2 },
  { label: 'Workouts Logged',     value: 5,  max: 7,  icon: <FitnessCenterIcon />, color: D.text2 },
  { label: 'Finance Tracked',     value: 3,  max: 30, icon: <AttachMoneyIcon />,   color: D.text3 },
];

const weekActivity = [
  { day: 'Mon', score: 85 }, { day: 'Tue', score: 60 }, { day: 'Wed', score: 95 },
  { day: 'Thu', score: 40 }, { day: 'Fri', score: 75 }, { day: 'Sat', score: 90 }, { day: 'Sun', score: 30 },
];

/* Thin progress bar */
function StatCard({ s }) {
  const pct = Math.round((s.value / s.max) * 100);
  return (
    <div style={{
      borderRadius: 12, background: D.bg2, border: `1px solid ${D.border1}`,
      padding: '20px 20px 18px', fontFamily: FONTS.sans,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: D.bg3, border: `1px solid ${D.border1}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: D.text3, fontSize: 16,
        }}>
          {s.icon}
        </div>
        <span style={{ fontSize: '0.82rem', color: D.text3, fontWeight: 400 }}>{s.label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 700, color: D.text1, lineHeight: 1 }}>{s.value}</span>
        <span style={{ fontSize: '0.8rem', color: D.text4 }}>/ {s.max}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: D.text4, fontFamily: FONTS.mono }}>{pct}%</span>
      </div>
      {/* Progress track */}
      <div style={{ height: 3, borderRadius: 2, background: D.bg4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${pct}%`,
          background: pct >= 70 ? D.text1 : pct >= 40 ? D.text2 : D.text4,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

/* Bar chart day */
function DayBar({ d }) {
  const opacity = d.score >= 80 ? 1 : d.score >= 60 ? 0.5 : 0.15;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: '100%', borderRadius: 3,
        background: `rgba(255,255,255,${opacity})`,
        height: `${(d.score / 100) * 80}px`,
        transition: 'all 0.3s',
        cursor: 'pointer',
      }} />
      <span style={{ fontSize: '0.68rem', color: D.text4, fontFamily: FONTS.mono }}>{d.day}</span>
    </div>
  );
}

export default function Reports() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, fontFamily: FONTS.sans }}>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: D.text1, letterSpacing: '-0.3px' }}>
          Reports
        </Typography>
        <Typography sx={{ color: D.text4, mt: 0.5, fontSize: '0.85rem' }}>
          Your progress across all modules this month
        </Typography>
      </Box>

      {/* Overall score hero */}
      <div style={{
        borderRadius: 14, background: D.bg2, border: `1px solid ${D.border1}`,
        padding: '28px 32px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden',
      }}>
        <BorderBeam size={180} duration={6} colorFrom="rgba(255,255,255,0.4)" colorTo="transparent" borderRadius={14} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div>
          <div style={{ fontSize: '5rem', fontWeight: 700, color: D.text1, lineHeight: 1, fontFamily: FONTS.mono }}>
            <NumberTicker value={72} />
          </div>
          <div style={{ fontSize: '0.8rem', color: D.text4, marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>Overall Score</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 6 }}>
            <ShinyText>Good Progress 📈</ShinyText>
          </div>
          <div style={{ fontSize: '0.875rem', color: D.text3, lineHeight: 1.7 }}>
            You're consistent in fitness and learning. Finance tracking needs more attention this week.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {['Streak: 5 days 🔥', 'Best: Fitness'].map(tag => (
              <span key={tag} style={{ padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', background: D.bg3, border: `1px solid ${D.border1}`, color: D.text3, fontFamily: FONTS.sans }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Module breakdown */}
      <Typography variant="h6" fontWeight={500} sx={{ color: D.text2, mb: 2, fontSize: '0.875rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Module Breakdown
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1.5, mb: 4 }}>
        {stats.map(s => <StatCard key={s.label} s={s} />)}
      </Box>

      {/* Weekly activity */}
      <Typography variant="h6" fontWeight={500} sx={{ color: D.text2, mb: 2, fontSize: '0.875rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        This Week
      </Typography>
      <div style={{
        borderRadius: 14, background: D.bg2, border: `1px solid ${D.border1}`,
        padding: '20px 24px', fontFamily: FONTS.sans,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100, marginBottom: 16 }}>
          {weekActivity.map(d => <DayBar key={d.day} d={d} />)}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'High (80+)',    opacity: 1 },
            { label: 'Medium (60–79)', opacity: 0.5 },
            { label: 'Low (<60)',      opacity: 0.15 },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: `rgba(255,255,255,${l.opacity})` }} />
              <span style={{ fontSize: '0.72rem', color: D.text4, fontFamily: FONTS.mono }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
