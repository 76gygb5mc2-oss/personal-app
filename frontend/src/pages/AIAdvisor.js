import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { G } from '../theme';

const STARTER_PROMPTS = [
  "What's the best business to start with $0?",
  "How do I stay consistent with my goals?",
  "Give me a 30-day plan to improve my finances",
  "What habits do the most successful people share?",
  "How do I build a personal brand from scratch?",
  "What should I learn first to become an entrepreneur?",
];

const AI_RESPONSES = {
  "What's the best business to start with $0?": `Great question. The best $0 businesses are service-based where your skills are the product:

**1. Ghost-writing / Content Creation** — Write LinkedIn posts, newsletters, or blog content for busy executives. Charge $500–$3,000/month per client. Zero startup cost.

**2. Freelance Consulting** — Pick one skill (copywriting, social media, ads, web design). Land 2 clients at $1,500/month and you're making $3K/month.

**3. AI Automation Consulting** — Businesses are desperate for someone who can build AI workflows to save them time. You learn it (free via YouTube), then charge $2K–$10K per project.

**The key:** Don't pick what sounds cool. Pick what solves a real, expensive problem for a business that has money to pay you. Start with services, then productize later.

Want me to build you a 30-day action plan for any of these?`,

  default: `Here's my honest take on that:

The most successful people I've studied all share one common trait — they **act before they feel ready**. They don't wait for perfect conditions, more knowledge, or the right moment. They take imperfect action and course-correct as they go.

**What this means for you practically:**
- Pick ONE thing you've been overthinking and do the first step today
- Measure what you do, not how you feel
- Treat setbacks as data, not verdicts

The gap between where you are and where you want to be isn't knowledge. It's almost always consistent action over time.

What specific area do you want to tackle? I can give you a concrete plan.`
};

export default function AIAdvisor() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! I'm your personal AI advisor. I know your goals, your modules, and what you're working on. Ask me anything — business strategy, mindset, finance, health, learning. I'll give you direct, actionable answers. No fluff." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: G.foam }}>🤖 AI Advisor</Typography>
        <Typography sx={{ color: G.sage, mt: 0.5 }}>Your personal strategist — ask anything, get direct answers</Typography>
      </Box>

      {/* Starter prompts */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {STARTER_PROMPTS.map(p => (
          <Chip key={p} label={p} onClick={() => send(p)} clickable
            sx={{ bgcolor: 'rgba(71,133,89,0.1)', border: `1px solid ${G.cardBorder}`, color: G.foam, fontWeight: 500,
              '&:hover': { bgcolor: `rgba(71,133,89,0.12)`, borderColor: G.green } }} />
        ))}
      </Box>

      {/* Chat window */}
      <Card sx={{ borderRadius: 3, border: `1px solid ${G.cardBorder}`, mb: 2, minHeight: 420 }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 420, maxHeight: 520, overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start',
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <Box sx={{ minWidth: 36, height: 36, borderRadius: '50%',
                bgcolor: m.role === 'ai' ? G.green : G.purple,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.role === 'ai'
                  ? <SmartToyIcon sx={{ color: G.pearl, fontSize: 18 }} />
                  : <PersonIcon sx={{ color: G.pearl, fontSize: 18 }} />}
              </Box>
              <Box sx={{ maxWidth: '80%', p: 2.5, borderRadius: 3,
                bgcolor: m.role === 'ai' ? G.pearl : G.purple,
                border: `1px solid ${m.role === 'ai' ? G.cardBorder : 'transparent'}` }}>
                {m.text.split('\n\n').map((para, pi) => (
                  <Typography key={pi} sx={{ color: m.role === 'ai' ? G.textDark : G.pearl, lineHeight: 1.8, mb: pi < m.text.split('\n\n').length - 1 ? 1 : 0 }}>
                    {para.split(/\*\*(.*?)\*\*/g).map((part, idx) =>
                      idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                    )}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: G.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SmartToyIcon sx={{ color: G.pearl, fontSize: 18 }} />
              </Box>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(71,133,89,0.1)', border: `1px solid ${G.cardBorder}` }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[0, 0.2, 0.4].map(d => (
                    <Box key={d} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: G.green,
                      animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${d}s`,
                      '@keyframes pulse': { '0%,100%': { opacity: 0.3 }, '50%': { opacity: 1 } } }} />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Card>

      {/* Input */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <TextField fullWidth placeholder="Ask anything about business, mindset, finance, health..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(13,38,24,0.72)',
            '& fieldset': { borderColor: 'rgba(148,204,171,0.18)' },
            '&:hover fieldset': { borderColor: G.green },
            '&.Mui-focused fieldset': { borderColor: G.green } } }} />
        <Button variant="contained" onClick={() => send()} disabled={!input.trim() || loading}
          sx={{ px: 3, borderRadius: 3, bgcolor: G.green, '&:hover': { bgcolor: G.greenDark }, minWidth: 56 }}>
          <SendIcon />
        </Button>
      </Box>
    </Container>
  );
}
