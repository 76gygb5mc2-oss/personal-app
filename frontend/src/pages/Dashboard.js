import React, { useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessIcon      from '@mui/icons-material/Business';
import EmojiEventsIcon   from '@mui/icons-material/EmojiEvents';
import SchoolIcon        from '@mui/icons-material/School';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AttachMoneyIcon   from '@mui/icons-material/AttachMoney';
import PsychologyIcon    from '@mui/icons-material/Psychology';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import SmartToyIcon      from '@mui/icons-material/SmartToy';
import AssessmentIcon    from '@mui/icons-material/Assessment';
import NorthEastIcon     from '@mui/icons-material/NorthEast';
import { D, FONTS } from '../theme';

const sections = [
  { title: 'Business',   sub: 'Deep-dive ideas & full execution blueprints', icon: <BusinessIcon />,      path: '/business',  num: '01' },
  { title: 'Best Idea',  sub: 'The top 3 business models ranked & explained', icon: <EmojiEventsIcon />,  path: '/best-idea', num: '02' },
  { title: 'Financial',  sub: 'Link your card — let it track everything',      icon: <AttachMoneyIcon />,  path: '/financial', num: '03' },
  { title: 'Mindset',    sub: 'Daily principles that reshape how you think',   icon: <PsychologyIcon />,   path: '/mindset',   num: '04' },
  { title: 'Learning',   sub: 'Read, interact, answer, get smarter',           icon: <SchoolIcon />,       path: '/learning',  num: '05' },
  { title: 'Health',     sub: 'Daily workouts + full meal plans with recipes', icon: <FitnessCenterIcon />,path: '/health',    num: '06' },
  { title: 'Check-in',   sub: 'Your daily 5-minute reflection ritual',         icon: <CheckCircleIcon />,  path: '/checkin',   num: '07' },
  { title: 'Reports',    sub: 'Visual overview of your growth this month',     icon: <AssessmentIcon />,   path: '/reports',   num: '08' },
  { title: 'AI Advisor', sub: 'Ask anything. Get direct, sharp answers.',      icon: <SmartToyIcon />,     path: '/ai',        num: '09' },
];

/* ── Meteor effect (from 21st.dev/aceternity/meteors) ── */
function Meteors({ number = 18 }) {
  const meteors = Array.from({ length: number }, (_, i) => ({
    id: i,
    left: Math.floor(Math.random() * 800 - 400),
    delay: (Math.random() * 0.8 + 0.2).toFixed(2),
    duration: Math.floor(Math.random() * 8 + 4),
  }));

  return (
    <>
      <style>{`
        @keyframes meteor {
          0%   { transform: rotate(215deg) translateX(0); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
        }
        .meteor-span {
          position: absolute;
          top: 0;
          height: 1px;
          width: 1px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.6);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.05);
          animation: meteor linear infinite;
        }
        .meteor-span::before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.5), transparent);
        }
      `}</style>
      {meteors.map(m => (
        <span
          key={m.id}
          className="meteor-span"
          style={{
            left: m.left + 'px',
            animationDelay: m.delay + 's',
            animationDuration: m.duration + 's',
          }}
        />
      ))}
    </>
  );
}

/* ── Dark minimal module card (bento-grid style from 21st.dev) ── */
function ModuleCard({ item, onClick }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 0, y: 0 });

  const onMouseMove = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSpotPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  };
  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
    setHovered(false);
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 16,
        background: D.bg2,
        border: `1px solid ${hovered ? D.border2 : D.border1}`,
        boxShadow: hovered
          ? '0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.6)'
          : '0 2px 12px rgba(0,0,0,0.4)',
        padding: '28px 28px 24px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        overflow: 'hidden',
        fontFamily: FONTS.sans,
      }}
    >
      {/* Spotlight from 21st.dev/aceternity/spotlight */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(300px circle at ${spotPos.x}px ${spotPos.y}px, rgba(255,255,255,0.04), transparent 60%)`,
        }} />
      )}

      {/* Top gradient line on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: hovered
          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'
          : 'transparent',
        transition: 'background 0.3s',
      }} />

      {/* Number watermark */}
      <div style={{
        position: 'absolute', bottom: 16, right: 20,
        fontSize: '5rem', fontWeight: 900, lineHeight: 1,
        color: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.025)',
        fontFamily: FONTS.mono,
        userSelect: 'none',
        transition: 'color 0.3s',
        letterSpacing: '-3px',
      }}>
        {item.num}
      </div>

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? D.border2 : D.border1}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered ? D.text1 : D.text3,
        marginBottom: 20,
        transition: 'all 0.25s',
        fontSize: 20,
      }}>
        {item.icon}
      </div>

      {/* Title */}
      <div style={{
        fontSize: '1.05rem', fontWeight: 600,
        color: hovered ? D.text1 : D.text2,
        marginBottom: 8, letterSpacing: '-0.2px',
        transition: 'color 0.2s',
      }}>
        {item.title}
      </div>

      {/* Sub */}
      <div style={{
        fontSize: '0.82rem', lineHeight: 1.65,
        color: hovered ? D.text3 : D.text4,
        maxWidth: 260, transition: 'color 0.2s',
        marginBottom: 20,
      }}>
        {item.sub}
      </div>

      {/* CTA arrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: hovered ? 6 : 4,
        color: hovered ? D.text2 : D.text4,
        fontSize: '0.72rem', fontWeight: 600,
        letterSpacing: 1.5, textTransform: 'uppercase',
        transition: 'all 0.25s',
      }}>
        <span>Open</span>
        <NorthEastIcon style={{ fontSize: 12 }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const hr = new Date().getHours();
  const greeting = hr < 5 ? 'Late Night' : hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <Box sx={{
      minHeight: '100vh',
      px: { xs: 3, sm: 5, md: 7 },
      py: { xs: 5, sm: 7 },
      fontFamily: FONTS.sans,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Meteor background */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <Meteors number={16} />
      </Box>

      {/* Subtle radial glow top */}
      <Box sx={{
        position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Box sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <Box sx={{ mb: { xs: 8, md: 12 }, maxWidth: 680 }}>
          <Typography sx={{
            fontSize: '0.68rem', letterSpacing: 4, textTransform: 'uppercase',
            color: D.text4, fontWeight: 500, mb: 3, fontFamily: FONTS.mono,
          }}>
            {today}
          </Typography>

          <Typography sx={{
            fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem' },
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-2px', color: D.text1, mb: 1,
            fontFamily: FONTS.sans,
          }}>
            {greeting},
          </Typography>

          <Typography sx={{
            fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem' },
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-2px', mb: 4,
            fontFamily: FONTS.sans,
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.35) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Sirawdink.
          </Typography>

          <Typography sx={{
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            color: D.text4, lineHeight: 1.8,
            maxWidth: 480, mb: 5, fontWeight: 400,
          }}>
            Your personal operating system. Everything you need to build, earn, grow, and become — all in one place.
          </Typography>

          {/* Stat pills */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {[
              { v: '9',  l: 'Modules' },
              { v: '4+', l: 'Ideas' },
              { v: '3',  l: 'Courses' },
              { v: 'AI', l: 'Ready' },
            ].map(s => (
              <Box key={s.l} sx={{
                px: 2, py: 0.8, borderRadius: 2,
                background: D.bg3,
                border: `1px solid ${D.border1}`,
                display: 'flex', alignItems: 'center', gap: 1,
                transition: 'all 0.2s',
                '&:hover': { background: D.bg4, borderColor: D.border2 },
              }}>
                <Typography fontWeight={600} sx={{ color: D.text1, fontSize: '0.85rem', fontFamily: FONTS.mono }}>{s.v}</Typography>
                <Typography sx={{ color: D.text4, fontSize: '0.75rem' }}>{s.l}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── DIVIDER ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: { xs: 5, md: 7 } }}>
          <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${D.border1}, transparent)` }} />
          <Typography sx={{ color: D.text4, fontSize: '0.65rem', letterSpacing: 3, textTransform: 'uppercase', fontFamily: FONTS.mono }}>
            Modules
          </Typography>
          <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(270deg, ${D.border1}, transparent)` }} />
        </Box>

        {/* ── MODULE GRID (bento-grid style) ── */}
        <Box sx={{
          display: 'grid', gap: { xs: 1.5, sm: 2 },
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' },
          pb: 8,
        }}>
          {sections.map(item => (
            <ModuleCard key={item.title} item={item} onClick={() => navigate(item.path)} />
          ))}
        </Box>

      </Box>
    </Box>
  );
}
