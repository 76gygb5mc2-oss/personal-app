import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Chip, Button, Accordion, AccordionSummary, AccordionDetails, LinearProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { D, FONTS } from '../theme';

const dailyPrinciples = [
  {
    title: "Your environment shapes your identity",
    category: "Environment",
    principle: "You don't rise to the level of your goals — you fall to the level of your systems. The single most powerful thing you can do today is design your environment to make the right behaviors automatic and the wrong behaviors invisible.",
    practice: "Remove one friction point from a good habit and add one friction point to a bad habit. Example: put your phone charger in another room at night. Put a book on your pillow.",
    deepDive: "James Clear's research shows that 40-50% of our daily actions are habits — automatic responses to environmental cues. The people who seem to have extraordinary willpower aren't fighting urges constantly — they've simply designed environments where the urge rarely appears. A person who never has junk food in the house doesn't need willpower to avoid it.",
    challenge: "Tonight: audit your immediate environment. What is within arm's reach that pulls you toward distraction, unhealthy habits, or procrastination? Change one thing physically before you sleep.",
    quote: "\"You do not rise to the level of your goals. You fall to the level of your systems.\" — James Clear"
  },
  {
    title: "The 2-minute rule for momentum",
    category: "Action",
    principle: "The hardest part of any action is starting. Once you begin, momentum carries you forward. The 2-minute rule states: if anything feels too big, commit to just 2 minutes. The goal isn't to do 2 minutes — it's to use 2 minutes to break the inertia of not starting.",
    practice: "Identify your most-avoided task this week. Set a timer for exactly 2 minutes and begin. Most people continue well past 2 minutes once started — but the commitment to stop at 2 makes starting feel safe.",
    deepDive: "The prefrontal cortex — the part of your brain responsible for planning and decision-making — gets overwhelmed by large tasks. It's not laziness. It's a cognitive protection mechanism. The 2-minute rule bypasses this by making the initial commitment so small that resistance is irrational. The behavior change is real: action creates motivation, not the other way around.",
    challenge: "Right now: what is the one task you've been putting off? Open it, start it, and give it 2 minutes. Report back mentally on how you feel afterward vs. before.",
    quote: "\"Action is not just the effect of motivation; it is also the cause of it.\" — Mark Manson"
  },
  {
    title: "Reframe failure as data",
    category: "Resilience",
    principle: "The most successful people in any field fail more than average people — not less. They fail faster, learn faster, and iterate faster. The mindset shift: failure is not the opposite of success. It is part of success. Every failed attempt is data about what doesn't work, which is exactly the information you need.",
    practice: "After your next setback, write down: (1) What happened? (2) What did I learn? (3) What will I do differently? This converts emotional reactions into strategic intelligence.",
    deepDive: "Carol Dweck's 30 years of research on growth mindset shows that people who view abilities as developable outperform those who view them as fixed — across every domain studied. The key variable isn't talent or IQ. It's the interpretation of failure. Fixed mindset: 'I failed = I am a failure.' Growth mindset: 'I failed = I found a way that doesn't work yet.'",
    challenge: "Write down your most recent failure. Under it, write 3 things it taught you. Then write what you would do differently. You've just turned a loss into a lesson.",
    quote: "\"I have not failed. I've just found 10,000 ways that won't work.\" — Thomas Edison"
  },
  {
    title: "The 1% rule — tiny gains compound",
    category: "Progress",
    principle: "Improving by 1% every day for a year doesn't make you 365% better. It makes you 37x better. Compounding applies to skills, habits, relationships, and wealth. Most people overestimate what they can do in a day and massively underestimate what they can do in a year of consistent 1% improvements.",
    practice: "Choose one skill or habit. Define what 1% improvement looks like today. Do exactly that. Not 10%, not a major overhaul — just 1%. Repeat tomorrow.",
    deepDive: "The British cycling team that dominated the 2012 Olympics used a philosophy called 'the aggregation of marginal gains.' They improved everything by 1%: bike seats, hand-washing technique, pillow firmness for better sleep, even the paint on the truck that carried bikes. The compound effect of dozens of 1% improvements led to unprecedented dominance.",
    challenge: "Pick one area: fitness, business, a skill, or a relationship. What is ONE thing you could do today that is 1% better than yesterday? Write it down. Do it.",
    quote: "\"Success is the product of daily habits — not once-in-a-lifetime transformations.\" — James Clear"
  },
];

const getDailyContent = () => {
  const day = Math.floor(Date.now() / 86400000) % dailyPrinciples.length;
  return dailyPrinciples[day];
};

export default function Mindset() {
  const [expanded, setExpanded] = useState('principle');
  const [idx, setIdx] = useState(Math.floor(Date.now() / 86400000) % dailyPrinciples.length);
  const [reflected, setReflected] = useState(false);
  const content = dailyPrinciples[idx];

  const sections = [
    { key: 'principle', label: '🧠 The Principle', body: content.principle },
    { key: 'practice',  label: '✏️ Today\'s Practice', body: content.practice },
    { key: 'deep',      label: '📖 Deep Dive', body: content.deepDive },
    { key: 'challenge', label: '⚡ Your Challenge', body: content.challenge },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: D.text1 }}>🧠 Mindset</Typography>
        <Typography sx={{ color: D.text3, mt: 0.5 }}>Daily principles that compound into who you become</Typography>
      </Box>

      {/* Daily Card */}
      <Card sx={{ borderRadius: 3, border: `1px solid ${'rgba(255,255,255,0.08)'}`, mb: 3, overflow: 'hidden' }}>
        {/* Top bar */}
        <Box sx={{ background: D.gradHero, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Chip label={content.category} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontWeight: 700, mb: 1 }} />
              <Typography variant="h5" fontWeight={800} sx={{ color: '#ffffff', lineHeight: 1.3 }}>
                {content.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {dailyPrinciples.map((_, i) => (
                <Box key={i} onClick={() => { setIdx(i); setExpanded('principle'); setReflected(false); }}
                  sx={{ width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
                    bgcolor: i === idx ? '#ffffff' : 'rgba(255,255,255,0.15)',
                    border: `2px solid ${i === idx ? D.border3 : D.border1}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' }
                  }}>
                  <Typography sx={{ color: '#ffffff', fontSize: '0.65rem', fontWeight: 700 }}>{i + 1}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1.5, fontStyle: 'italic' }}>
            {content.quote}
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {sections.map(s => (
            <Accordion key={s.key} expanded={expanded === s.key}
              onChange={() => setExpanded(expanded === s.key ? null : s.key)}
              sx={{ bgcolor: 'rgba(255,255,255,0.04)', mb: 1, border: `1px solid ${'rgba(255,255,255,0.08)'}` }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: D.text3 }} />}>
                <Typography fontWeight={700} sx={{ color: D.text1 }}>{s.label}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: D.text2, lineHeight: 1.9 }}>{s.body}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Button variant="contained" fullWidth onClick={() => setReflected(true)}
            sx={{ mt: 2, py: 1.5, bgcolor: '#ffffff', '&:hover': { bgcolor: '#111111' } }}>
            {reflected ? '✅ Challenge Accepted!' : '⚡ I Accept Today\'s Challenge'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
