import React, { useState, useRef, useEffect } from 'react';
import { Container, Box, Typography, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { D, FONTS } from '../theme';
import TypingAnimation from '../components/ui/TypingAnimation';
import BorderBeam from '../components/ui/BorderBeam';

const STARTER_PROMPTS = [
  "What's the best business to start with $0?",
  "How do I stay consistent with my goals?",
  "Give me a 30-day plan to improve my finances",
  "What habits do the most successful people share?",
  "How do I build a personal brand from scratch?",
  "What should I learn first to become an entrepreneur?",
];

const AI_RESPONSES = {
  "What's the best business to start with $0?": `The best $0 businesses are service-based where your skills are the product:\n\n**1. Ghost-writing / Content Creation** — Write LinkedIn posts, newsletters, or blog content for busy executives. Charge $500–$3,000/month per client.\n\n**2. Freelance Consulting** — Pick one skill (copywriting, social media, ads, web design). Land 2 clients at $1,500/month = $3K/month.\n\n**3. AI Automation Consulting** — Businesses are desperate for someone who can build AI workflows. Learn it free, charge $2K–$10K per project.\n\n**The key:** Pick what solves a real, expensive problem for a business that has money to pay you. Start with services, then productize later.`,
  default: `The most successful people all share one trait — they **act before they feel ready**. They don't wait for perfect conditions. They take imperfect action and course-correct.\n\n**What this means for you practically:**\n- Pick ONE thing you've been overthinking and do the first step today\n- Measure what you do, not how you feel\n- Treat setbacks as data, not verdicts\n\nThe gap between where you are and where you want to be isn't knowledge. It's consistent action over time.\n\nWhat specific area do you want to tackle?`,
};

function TypingDots() {
  return (
    <Box sx={{ display: 'flex', gap: 0.6, alignItems: 'center', p: 1 }}>
      {[0, 0.2, 0.4].map(d => (
        <Box key={d} sx={{
          width: 6, height: 6, borderRadius: '50%',
          bgcolor: D.text4,
          animation: 'aiPulse 1.2s ease-in-out infinite',
          animationDelay: `${d}s`,
          '@keyframes aiPulse': { '0%,100%': { opacity: 0.2 }, '50%': { opacity: 0.8 } },
        }} />
      ))}
    </Box>
  );
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! I'm your personal AI advisor. Ask me anything — business strategy, mindset, finance, health, learning. I'll give you direct, actionable answers. No fluff." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const response = AI_RESPONSES[msg] || AI_RESPONSES.default;
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setLoading(false);
    }, 900);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, fontFamily: FONTS.sans }}>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: D.text1, letterSpacing: '-0.3px' }}>
          AI Advisor
        </Typography>
        <div style={{ color: D.text4, marginTop: 4, fontSize: '0.85rem' }}>
          <TypingAnimation
            text="Your personal strategist — direct answers, no fluff."
            duration={30}
            style={{ color: D.text4 }}
          />
        </div>
      </Box>

      {/* Starter prompts */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {STARTER_PROMPTS.map(p => (
          <Chip key={p} label={p} onClick={() => send(p)} clickable size="small"
            sx={{
              bgcolor: D.bg2, border: `1px solid ${D.border1}`,
              color: D.text3, fontWeight: 400, fontSize: '0.75rem',
              fontFamily: FONTS.sans,
              '&:hover': { bgcolor: D.bg3, borderColor: D.border2, color: D.text2 },
              transition: 'all 0.15s',
            }} />
        ))}
      </Box>

      {/* Chat window */}
      <Box sx={{
        borderRadius: 3, border: `1px solid ${D.border1}`,
        bgcolor: D.bg1, mb: 2,
        minHeight: 420, maxHeight: 520,
        overflowY: 'auto',
        p: 2.5,
        display: 'flex', flexDirection: 'column', gap: 2,
        position: 'relative',
      }}>
        <BorderBeam size={150} duration={5} colorFrom="rgba(255,255,255,0.5)" colorTo="transparent" borderRadius={12} />
        {messages.map((m, i) => (
          <Box key={i} sx={{
            display: 'flex', gap: 1.5,
            alignItems: 'flex-start',
            flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
          }}>
            {/* Avatar */}
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              bgcolor: m.role === 'ai' ? D.bg3 : D.bg4,
              border: `1px solid ${D.border1}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {m.role === 'ai'
                ? <SmartToyIcon sx={{ fontSize: 15, color: D.text2 }} />
                : <PersonIcon sx={{ fontSize: 15, color: D.text3 }} />}
            </Box>

            {/* Bubble */}
            <Box sx={{
              maxWidth: '78%', px: 2, py: 1.5, borderRadius: 2.5,
              bgcolor: m.role === 'ai' ? D.bg2 : D.bg3,
              border: `1px solid ${D.border1}`,
            }}>
              {m.text.split('\n\n').map((para, pi) => (
                <Typography key={pi} sx={{
                  color: D.text2, lineHeight: 1.8, fontSize: '0.875rem',
                  mb: pi < m.text.split('\n\n').length - 1 ? 1 : 0,
                  fontFamily: FONTS.sans,
                }}>
                  {para.split(/\*\*(.*?)\*\*/g).map((part, idx) =>
                    idx % 2 === 1
                      ? <strong key={idx} style={{ color: D.text1, fontWeight: 600 }}>{part}</strong>
                      : part
                  )}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              bgcolor: D.bg3, border: `1px solid ${D.border1}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SmartToyIcon sx={{ fontSize: 15, color: D.text2 }} />
            </Box>
            <Box sx={{ px: 2, py: 1, borderRadius: 2.5, bgcolor: D.bg2, border: `1px solid ${D.border1}` }}>
              <TypingDots />
            </Box>
          </Box>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input bar */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Ask anything about business, mindset, finance, health..."
          style={{
            flex: 1, padding: '11px 16px',
            borderRadius: 10,
            background: D.bg2,
            border: `1px solid ${D.border1}`,
            color: D.text1, fontSize: '0.875rem',
            fontFamily: FONTS.sans, outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = D.border3}
          onBlur={e => e.target.style.borderColor = D.border1}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: input.trim() && !loading ? D.text1 : D.bg3,
            border: `1px solid ${D.border2}`,
            color: input.trim() && !loading ? D.bg0 : D.text4,
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          <SendIcon style={{ fontSize: 18 }} />
        </button>
      </Box>
    </Container>
  );
}
