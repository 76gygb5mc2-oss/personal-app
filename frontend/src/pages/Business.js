import { G } from '../theme';
import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Chip,
  Accordion, AccordionSummary, AccordionDetails, Button,
  LinearProgress, Divider, IconButton, Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const businessIdeas = [
  {
    id: 1,
    title: "AI-Powered Resume & Career Coaching Service",
    tagline: "Help people land jobs using AI tools most don't know how to use",
    difficulty: "Low",
    startupCost: "$0–$200",
    potential: "$3,000–$15,000/month",
    timeToRevenue: "2–4 weeks",
    category: "Service",
    why: "93% of resumes never get past automated ATS filters. Most job seekers have no idea how to optimize for this. You use AI tools like ChatGPT + Teal + Jobscan to completely rewrite their resume, LinkedIn, and give a 1-hour coaching call. People pay $100–$500 per session and they get results. You need zero startup cost — just skills.",
    market: "350 million active job seekers globally. The career coaching market is $15 billion/year and growing. The shift to AI-assisted hiring means demand for this is exploding right now — most coaches are NOT using AI, giving you a massive edge.",
    steps: [
      "Set up a simple Notion portfolio page showing before/after resume examples",
      "Create a $149 starter package: resume rewrite + ATS optimization + 30-min call",
      "Post in 5 Facebook Groups (Job Seekers, LinkedIn Tips, etc.) with a free mini-audit offer",
      "Do 3 free audits, get testimonials, screenshot results",
      "Raise price to $249 and run paid Facebook ad targeting 'job seekers' in your city",
      "Scale to group workshops at $49/person — 10 people = $490 for 2 hours"
    ],
    risks: [
      "Clients may expect guaranteed job offers — be clear about what you deliver",
      "Market is competitive — your edge is speed and AI tools, not generic advice",
      "Time-intensive until you productize with templates"
    ],
    tools: ["ChatGPT-4", "Teal (free)", "Jobscan", "Canva (resume design)", "Calendly", "Stripe"],
    scalingPath: "Month 1: 5 clients ($750). Month 3: 15 clients/month ($3,750). Month 6: Add group workshops + digital resume template packs ($8,000/month). Year 1: License your system to other career coaches.",
    differentiator: "You combine AI speed with human insight — you can turn around a fully optimized resume in 24 hours. No traditional career coach can compete with that turnaround."
  },
  {
    id: 2,
    title: "Local Business 'Digital Presence' Agency",
    tagline: "Small businesses are invisible online — you fix that in 48 hours",
    difficulty: "Low–Medium",
    startupCost: "$0–$500",
    potential: "$5,000–$20,000/month",
    timeToRevenue: "1–3 weeks",
    category: "Agency",
    why: "70% of small businesses have outdated or non-existent websites. Restaurants, barbers, contractors, nail salons — they're losing customers every day to competitors who show up on Google. You build a simple 5-page website + Google Business setup + basic SEO in 48 hours and charge $500–$1,500. Then offer $150/month maintenance. This is repeatable and scalable.",
    market: "33 million small businesses in the US alone. Even capturing 0.001% of this market = 330 clients. At $800 average project + $150/month maintenance on 20 clients = $3,800 recurring before any new projects.",
    steps: [
      "Pick a niche: restaurants, barbershops, or contractors in your area",
      "Build one example website using Webflow or WordPress (use a fake/demo business)",
      "Walk into 5 local businesses and show them their Google search results — show them what they're missing",
      "Offer a '$299 launch special' to the first 3 clients — do exceptional work",
      "Get Google reviews and photos from those clients",
      "Move price to $800 + $150/month and start door-to-door or cold email outreach",
      "Hire a freelancer on Fiverr to help build when you get 5+ active clients"
    ],
    risks: [
      "Clients can be slow to respond or provide content — set clear timelines in contract",
      "Technical issues if you're not web-savvy — use no-code tools to reduce this",
      "Churn on maintenance packages — focus on delivering real results (calls, bookings)"
    ],
    tools: ["Webflow or Framer (no-code)", "Google Business Profile", "Semrush (free tier)", "Canva", "Stripe", "Google Analytics"],
    scalingPath: "Month 1: 3 projects ($900). Month 2: 6 projects + 3 maintenance ($1,950). Month 6: 4 projects/month + 15 maintenance clients ($5,450/month). Year 1: Build a small team of 2 freelancers, take on 10 projects/month.",
    differentiator: "You specialize in ONE local niche and become the go-to expert. A barbershop owner trusts you more when you say 'I've built 10 barbershop websites' vs. 'I build all websites'."
  },
  {
    id: 3,
    title: "Micro SaaS: Niche Productivity Tool",
    tagline: "Build one small tool that solves one specific painful problem",
    difficulty: "Medium",
    startupCost: "$50–$300",
    potential: "$1,000–$30,000/month (recurring)",
    timeToRevenue: "1–3 months",
    category: "Software",
    why: "Micro SaaS is the most underrated business model right now. You don't build a full product — you build a tiny, laser-focused tool that solves ONE thing better than anything else. Examples: a tool that auto-formats LinkedIn posts, a meal planner that generates grocery lists, a habit tracker for ADHD people. $19/month × 500 users = $9,500 MRR. That's life-changing income from one tool.",
    market: "The SaaS industry is $200+ billion. But the real opportunity is in niches — tools for real estate agents, for Airbnb hosts, for personal trainers. These niches are underserved and users pay happily.",
    steps: [
      "Spend 1 week identifying ONE painful manual task in a niche you understand",
      "Validate by posting in Reddit/Facebook groups: 'Would you pay $15/month for a tool that does X?'",
      "Build an MVP in 2–4 weeks using no-code (Bubble, Glide) or low-code (Next.js + Supabase)",
      "Launch on ProductHunt and relevant subreddits with a 50% off first-month deal",
      "Collect feedback aggressively — talk to every single early user",
      "Iterate monthly based on feedback, add the top-requested feature each month"
    ],
    risks: [
      "Building without validating first — always validate demand before building",
      "Churn if the tool doesn't save meaningful time — measure this early",
      "Competition from larger tools — win on focus and simplicity"
    ],
    tools: ["Bubble (no-code)", "Supabase (database)", "Stripe (payments)", "Lemon Squeezy (billing)", "Intercom (support)", "PostHog (analytics)"],
    scalingPath: "Month 1–2: 10 beta users ($0). Month 3: 50 paying users at $19 = $950 MRR. Month 6: 200 users = $3,800 MRR. Year 1: 500 users = $9,500 MRR. Add annual plans to boost cash flow.",
    differentiator: "Micro SaaS wins through extreme focus. Users love a tool that does one thing perfectly over a bloated app that does 50 things poorly."
  },
  {
    id: 4,
    title: "Content Ghost-Writing for Executives & Founders",
    tagline: "They have the stories, you have the words — $500–$3,000 per client per month",
    difficulty: "Low",
    startupCost: "$0",
    potential: "$5,000–$25,000/month",
    timeToRevenue: "1–2 weeks",
    category: "Service",
    why: "LinkedIn has 900 million users but only 3 million post weekly. CEOs, founders, and executives KNOW they should post but have no time or don't know how to write. They will pay $500–$3,000/month for someone to write their LinkedIn posts, newsletter, and thought leadership articles. You interview them for 30 mins/week, extract insights, and turn it into 3–5 posts. This is one of the highest-paid, lowest-cost service businesses available.",
    market: "There are 58 million companies on LinkedIn. The top 1% of creators get 80% of engagement. Every executive wants to be in that 1% — most just need someone to do it for them.",
    steps: [
      "Build your own LinkedIn presence for 30 days — post 5x/week about anything you know",
      "DM 20 local business owners or executives: 'I noticed you're not posting on LinkedIn — I help people like you build an audience. Want a free sample post?'",
      "Write one free post for them. Make it excellent. Show results.",
      "Pitch a $500/month package: 3 posts/week + 1 newsletter",
      "Land 3 clients ($1,500/month). Deliver results. Get referrals.",
      "Raise rates to $1,500/month as you build a track record"
    ],
    risks: [
      "Maintaining each client's unique voice — spend time studying how they talk",
      "Clients may want to micro-manage every post — set clear revision policy upfront",
      "Income is client-dependent — build to 5+ clients before quitting anything"
    ],
    tools: ["Notion (content calendar)", "Taplio (LinkedIn scheduling)", "ChatGPT (first draft)", "Hemingway App (editing)", "Shield Analytics (tracking)", "Calendly"],
    scalingPath: "Month 1: 2 clients ($1,000). Month 3: 5 clients ($5,000). Month 6: 8 clients + hire 1 junior writer ($12,000). Year 1: Run a ghost-writing agency with 3 writers and 20+ clients ($30,000/month).",
    differentiator: "You're not selling 'content' — you're selling the executive's personal brand growth. Tie your service to measurable outcomes: followers, inbound leads, speaking invites."
  }
];

const getDailyIdea = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return businessIdeas[dayOfYear % businessIdeas.length];
};

export default function Business() {
  const [idea, setIdea] = useState(getDailyIdea());
  const [ideaIndex, setIdeaIndex] = useState(businessIdeas.indexOf(getDailyIdea()));
  const [saved, setSaved] = useState(false);
  const [expandedSection, setExpandedSection] = useState('why');

  const nextIdea = () => {
    const next = (ideaIndex + 1) % businessIdeas.length;
    setIdeaIndex(next);
    setIdea(businessIdeas[next]);
    setSaved(false);
    setExpandedSection('why');
  };

  const difficultyColor = { Low: G.mid, 'Low–Medium': '#84cc16', Medium: '#eab308', High: '#ef4444' };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: G.foam }}>
            💼 Business Ideas
          </Typography>
          <Typography variant="body2" sx={{ color: 'G.textLight', mt: 0.5 }}>
            Deep-dive analysis — not just ideas, but full execution blueprints
          </Typography>
        </Box>
        <Tooltip title="See next idea">
          <IconButton onClick={nextIdea} sx={{ bgcolor: 'rgba(71,133,89,0.08)', border: '1px solid rgba(71,133,89,0.18)', '&:hover': { bgcolor: 'rgba(71,133,89,0.18)' } }}>
            <RefreshIcon sx={{ color: 'G.textLight' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Idea Card */}
      <Card sx={{ bgcolor: 'rgba(71,133,89,0.12)', border: '1px solid rgba(71,133,89,0.08)', borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Top badges */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            <Chip label={idea.category} size="small" sx={{ bgcolor: G.pine, color: G.foam, fontWeight: 600 }} />
            <Chip
              label={`Difficulty: ${idea.difficulty}`}
              size="small"
              sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: difficultyColor[idea.difficulty] || 'G.textLight', fontWeight: 600 }}
            />
            <Chip label={`Revenue in ${idea.timeToRevenue}`} size="small" sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: '#a78bfa', fontWeight: 600 }} />
          </Box>

          {/* Title */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: G.foam, flex: 1, pr: 2 }}>
              {idea.title}
            </Typography>
            <IconButton onClick={() => setSaved(!saved)} size="small" sx={{ color: saved ? '#f59e0b' : 'G.textMid' }}>
              {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>
          <Typography variant="body1" sx={{ color: 'G.textLight', mb: 3, fontStyle: 'italic' }}>
            {idea.tagline}
          </Typography>

          {/* Key Metrics */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {[
              { icon: <AttachMoneyIcon sx={{ fontSize: 18 }} />, label: 'Startup Cost', value: idea.startupCost, color: G.mid },
              { icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, label: 'Monthly Potential', value: idea.potential, color: G.sage },
              { icon: <LightbulbIcon sx={{ fontSize: 18 }} />, label: 'Time to Revenue', value: idea.timeToRevenue, color: '#f59e0b' },
            ].map((metric) => (
              <Box key={metric.label} sx={{ bgcolor: 'rgba(71,133,89,0.08)', borderRadius: 2, p: 2, minWidth: 180, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: metric.color }}>
                  {metric.icon}
                  <Typography variant="caption" sx={{ color: 'G.textLight', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {metric.label}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: metric.color }}>
                  {metric.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ borderColor: 'rgba(71,133,89,0.08)', mb: 3 }} />

          {/* Deep Dive Sections */}
          {[
            {
              key: 'why',
              label: '🎯 Why This Works',
              icon: <LightbulbIcon />,
              content: <Typography sx={{ color: 'G.textDark', lineHeight: 1.8 }}>{idea.why}</Typography>
            },
            {
              key: 'market',
              label: '📊 Market Opportunity',
              icon: <TrendingUpIcon />,
              content: <Typography sx={{ color: 'G.textDark', lineHeight: 1.8 }}>{idea.market}</Typography>
            },
            {
              key: 'steps',
              label: '🚀 Step-by-Step Action Plan',
              icon: <BuildIcon />,
              content: (
                <Box>
                  {idea.steps.map((step, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                      <Box sx={{
                        minWidth: 28, height: 28, borderRadius: '50%',
                        bgcolor: G.pine, color: G.foam,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700, mt: 0.2
                      }}>
                        {i + 1}
                      </Box>
                      <Typography sx={{ color: 'G.textDark', lineHeight: 1.7 }}>{step}</Typography>
                    </Box>
                  ))}
                </Box>
              )
            },
            {
              key: 'scaling',
              label: '📈 Scaling Path',
              icon: <TrendingUpIcon />,
              content: <Typography sx={{ color: 'G.textDark', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{idea.scalingPath}</Typography>
            },
            {
              key: 'diff',
              label: '⚡ Your Competitive Edge',
              icon: <CheckCircleIcon />,
              content: <Typography sx={{ color: 'G.textDark', lineHeight: 1.8 }}>{idea.differentiator}</Typography>
            },
            {
              key: 'risks',
              label: '⚠️ Risks & How to Handle Them',
              icon: <WarningIcon />,
              content: (
                <Box>
                  {idea.risks.map((risk, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
                      <WarningIcon sx={{ color: '#f59e0b', fontSize: 18, mt: 0.3 }} />
                      <Typography sx={{ color: 'G.textDark', lineHeight: 1.7 }}>{risk}</Typography>
                    </Box>
                  ))}
                </Box>
              )
            },
            {
              key: 'tools',
              label: '🛠 Tools You Need',
              icon: <BuildIcon />,
              content: (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {idea.tools.map((tool, i) => (
                    <Chip key={i} label={tool} sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: 'G.textLight', border: '1px solid rgba(71,133,89,0.18)' }} />
                  ))}
                </Box>
              )
            }
          ].map((section) => (
            <Accordion
              key={section.key}
              expanded={expandedSection === section.key}
              onChange={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              sx={{ bgcolor: 'rgba(71,133,89,0.08)', border: '1px solid rgba(71,133,89,0.18)', borderRadius: '8px !important', mb: 1, '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'G.textLight' }} />}>
                <Typography fontWeight={600} sx={{ color: G.foam }}>{section.label}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {section.content}
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'G.textMid' }}>
          Idea {ideaIndex + 1} of {businessIdeas.length} • New idea added weekly
        </Typography>
        <Button
          variant="contained"
          onClick={nextIdea}
          sx={{ bgcolor: G.pine, '&:hover': { bgcolor: G.fern }, textTransform: 'none', fontWeight: 600 }}
          endIcon={<RefreshIcon />}
        >
          Next Idea
        </Button>
      </Box>
    </Container>
  );
}
