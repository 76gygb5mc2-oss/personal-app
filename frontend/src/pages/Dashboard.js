import React, { useRef, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessIcon     from '@mui/icons-material/Business';
import EmojiEventsIcon  from '@mui/icons-material/EmojiEvents';
import SchoolIcon       from '@mui/icons-material/School';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AttachMoneyIcon  from '@mui/icons-material/AttachMoney';
import PsychologyIcon   from '@mui/icons-material/Psychology';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import SmartToyIcon     from '@mui/icons-material/SmartToy';
import AssessmentIcon   from '@mui/icons-material/Assessment';
import NorthEastIcon    from '@mui/icons-material/NorthEast';
import { G } from '../theme';

const sections = [
  { title: 'Business',   sub: 'Deep-dive ideas & full execution blueprints', icon: <BusinessIcon sx={{ fontSize: 32 }} />,      path: '/business',  num: '01' },
  { title: 'Best Idea',  sub: 'The top 3 business models ranked & explained', icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />, path: '/best-idea', num: '02' },
  { title: 'Financial',  sub: 'Link your card — let it track everything',      icon: <AttachMoneyIcon sx={{ fontSize: 32 }} />, path: '/financial', num: '03' },
  { title: 'Mindset',    sub: 'Daily principles that reshape how you think',   icon: <PsychologyIcon sx={{ fontSize: 32 }} />,  path: '/mindset',   num: '04' },
  { title: 'Learning',   sub: 'Read, interact, answer, get smarter',           icon: <SchoolIcon sx={{ fontSize: 32 }} />,      path: '/learning',  num: '05' },
  { title: 'Health',     sub: 'Daily workouts + full meal plans with recipes', icon: <FitnessCenterIcon sx={{ fontSize: 32 }} />, path: '/health',  num: '06' },
  { title: 'Check-in',   sub: 'Your daily 5-minute reflection ritual',         icon: <CheckCircleIcon sx={{ fontSize: 32 }} />, path: '/checkin',   num: '07' },
  { title: 'Reports',    sub: 'Visual overview of your growth this month',     icon: <AssessmentIcon sx={{ fontSize: 32 }} />,  path: '/reports',   num: '08' },
  { title: 'AI Advisor', sub: 'Ask anything. Get direct, sharp answers.',      icon: <SmartToyIcon sx={{ fontSize: 32 }} />,    path: '/ai',        num: '09' },
];

/* Magnetic hover card */
function ModuleCard({ item, onClick }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const onMove = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    ref.current.style.boxShadow = `${x * -18}px ${y * -18}px 40px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(148,204,171,0.2)`;
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
    ref.current.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(148,204,171,0.08)';
    setHovered(false);
  };

  return (
    <Box
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      sx={{
        position: 'relative', cursor: 'pointer',
        borderRadius: 4,
        background: 'rgba(13,38,24,0.72)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148,204,171,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(148,204,171,0.08)',
        p: { xs: 3, sm: 4 },
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute',
          top: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, transparent, ${G.mint}55, transparent)`,
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        },
      }}
    >
      {/* Number watermark */}
      <Typography sx={{
        position: 'absolute', bottom: 16, right: 20,
        fontSize: '4.5rem', fontWeight: 900, lineHeight: 1,
        color: 'rgba(148,204,171,0.05)',
        fontFamily: '"Georgia", serif',
        userSelect: 'none',
        transition: 'color 0.3s',
        ...(hovered && { color: 'rgba(148,204,171,0.1)' }),
      }}>
        {item.num}
      </Typography>

      {/* Icon */}
      <Box sx={{
        width: 60, height: 60, borderRadius: 3,
        background: `rgba(71,133,89,0.15)`,
        border: '1px solid rgba(148,204,171,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: G.mint, mb: 3,
        transition: 'all 0.25s',
        ...(hovered && {
          background: `rgba(71,133,89,0.28)`,
          borderColor: 'rgba(148,204,171,0.35)',
          boxShadow: `0 0 20px rgba(71,133,89,0.35)`,
        }),
      }}>
        {item.icon}
      </Box>

      {/* Text */}
      <Typography variant="h5" fontWeight={800} sx={{
        color: G.foam, mb: 1, lineHeight: 1.2,
        letterSpacing: '-0.3px',
        transition: 'color 0.2s',
        ...(hovered && { color: '#fff' }),
      }}>
        {item.title}
      </Typography>
      <Typography sx={{
        color: 'rgba(232,245,238,0.45)',
        fontSize: '0.9rem', lineHeight: 1.65,
        maxWidth: 260,
        transition: 'color 0.2s',
        ...(hovered && { color: 'rgba(232,245,238,0.65)' }),
      }}>
        {item.sub}
      </Typography>

      {/* Arrow */}
      <Box sx={{
        mt: 3, display: 'flex', alignItems: 'center', gap: 0.8,
        color: G.sage,
        transition: 'all 0.25s',
        ...(hovered && { color: G.mint, gap: 1.2 }),
      }}>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Open
        </Typography>
        <NorthEastIcon sx={{ fontSize: 14 }} />
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const hr = new Date().getHours();
  const greeting = hr < 5 ? 'Late Night' : hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <Box sx={{ minHeight: '100vh', px: { xs: 3, sm: 6, md: 8 }, py: { xs: 5, sm: 8 } }}>

      {/* ── HERO ───────────────────────────── */}
      <Box sx={{ mb: { xs: 8, md: 12 }, maxWidth: 720 }}>
        <Typography sx={{
          fontSize: '0.72rem', letterSpacing: 4, textTransform: 'uppercase',
          color: G.sage, fontWeight: 600, mb: 2,
        }}>
          {today}
        </Typography>

        <Typography sx={{
          fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' },
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-2px',
          color: G.foam,
          mb: 1,
        }}>
          {greeting},
        </Typography>

        <Typography sx={{
          fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' },
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-2px',
          background: `linear-gradient(135deg, ${G.mint} 0%, ${G.sage} 50%, ${G.leaf} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 4,
        }}>
          Sirawdink.
        </Typography>

        <Typography sx={{
          fontSize: { xs: '1rem', sm: '1.2rem' },
          color: 'rgba(232,245,238,0.45)',
          lineHeight: 1.8, maxWidth: 500, mb: 5,
          fontWeight: 400,
        }}>
          Your personal operating system. Everything you need to build, earn, grow, and become — all in one place.
        </Typography>

        {/* Stat pills */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { v: '9',   l: 'Modules',       c: G.mint },
            { v: '4+',  l: 'Business Ideas', c: G.sage },
            { v: '3',   l: 'Courses',        c: G.mist },
            { v: 'AI',  l: 'Advisor Ready',  c: G.leaf },
          ].map(s => (
            <Box key={s.l} sx={{
              px: 2.5, py: 1.2, borderRadius: 10,
              background: 'rgba(71,133,89,0.12)',
              border: '1px solid rgba(148,204,171,0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', gap: 1,
              transition: 'all 0.2s',
              '&:hover': { background: 'rgba(71,133,89,0.22)', borderColor: 'rgba(148,204,171,0.3)' },
            }}>
              <Typography fontWeight={800} sx={{ color: s.c, fontSize: '1rem' }}>{s.v}</Typography>
              <Typography sx={{ color: 'rgba(232,245,238,0.45)', fontSize: '0.8rem' }}>{s.l}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── DIVIDER LINE ─────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: { xs: 6, md: 8 } }}>
        <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, rgba(148,204,171,0.2), transparent)` }} />
        <Typography sx={{ color: 'rgba(148,204,171,0.3)', fontSize: '0.7rem', letterSpacing: 3, textTransform: 'uppercase' }}>
          Your Modules
        </Typography>
        <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(270deg, rgba(148,204,171,0.2), transparent)` }} />
      </Box>

      {/* ── MODULE GRID ──────────────────── */}
      <Box sx={{
        display: 'grid', gap: { xs: 2, sm: 3 },
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        pb: 8,
      }}>
        {sections.map(item => (
          <ModuleCard key={item.title} item={item} onClick={() => navigate(item.path)} />
        ))}
      </Box>

    </Box>
  );
}
