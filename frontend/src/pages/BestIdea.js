import { D, FONTS } from '../theme';
import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Chip,
  Button, Divider, LinearProgress, Accordion, AccordionSummary,
  AccordionDetails, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const bestIdeas = [
  {
    rank: 1,
    title: "AI-Powered Micro SaaS for a Niche",
    tagline: "The highest ROI business model of the decade",
    icon: "🤖",
    badge: "BEST OVERALL",
    badgeColor: "#b45309",
    whyBest: "Micro SaaS is the single best business model for an individual with no team and limited capital. You build ONE tool that solves ONE very specific problem for a defined niche. You charge $15–$49/month. You get recurring, passive revenue that grows every month. Unlike services, you don't trade time for money — you build once, sell forever. Unlike big SaaS, you don't need VC funding or a team. This is the business model that has created more millionaires in the last 5 years than any other.",
    realExamples: [
      "Transistor.fm — podcast hosting for small creators → $500K MRR (2 founders)",
      "Lemon Squeezy — payment tool for creators → Acquired for tens of millions (3-person team)",
      "Snipd — AI podcast clipper → 100K users from one founder",
      "Typefully — Twitter/X scheduling → $50K MRR, 2 people"
    ],
    bestNiches: [
      { niche: "Real Estate Agents", idea: "Auto-generate property listing descriptions from data", income: "$2K–$15K MRR" },
      { niche: "Personal Trainers", idea: "Auto-generate weekly workout plans from client goals", income: "$1K–$8K MRR" },
      { niche: "E-commerce Sellers", idea: "Auto-write SEO product descriptions at scale", income: "$3K–$20K MRR" },
      { niche: "ADHD People", idea: "Habit tracker with ADHD-specific reminders and dopamine rewards", income: "$1K–$12K MRR" },
      { niche: "Local Businesses", idea: "Auto-respond to Google reviews with personalized replies", income: "$500–$5K MRR" },
    ],
    launchPlan: [
      { week: "Week 1", task: "Identify niche — join 3 Facebook groups or Reddit subs in that niche. Spend a week reading complaints and frustrations." },
      { week: "Week 2", task: "Validate — post 'Would you pay $15/month for a tool that [does X]?' in those communities. Need 10 yeses before building." },
      { week: "Week 3–4", task: "Build MVP — use Bubble (no-code) or Next.js + Supabase. Build only the one core feature. Nothing else." },
      { week: "Week 5", task: "Launch — ProductHunt, Reddit, Indie Hackers, direct DMs to people who said yes. Offer 50% off first month." },
      { week: "Week 6+", task: "Talk to every user. Add one feature per month based on most-requested. Grow by 10–20% monthly." },
    ],
    investmentRequired: "$0–$100/month (hosting + domain + Supabase free tier)",
    revenueTimeline: "Month 1: $0–$200 | Month 3: $500–$2K | Month 6: $2K–$8K | Year 1: $5K–$25K MRR",
    successRate: 68,
    successNote: "Higher than most businesses because you validate BEFORE building. Failure means you built without validating."
  },
  {
    rank: 2,
    title: "Personal Brand + Digital Products",
    tagline: "Build an audience → sell them something once → earn forever",
    icon: "🎯",
    badge: "BEST FOR SOLO",
    badgeColor: "D.bg2",
    whyBest: "The personal brand model is the most scalable solo business. You build authority in ONE specific topic by posting content consistently. Once you have an audience (even 1,000 true fans), you sell them a digital product: course, ebook, template pack, masterclass. You create it once — it sells for years. The key insight: you don't need millions of followers. 1,000 people paying $97 for a course = $97,000. This has zero cost of goods, infinite scalability, and compounds over time.",
    realExamples: [
      "Justin Welsh — LinkedIn personal brand → $5M/year from courses and newsletters (solo, no employees)",
      "Alex Hormozi — built personal brand, now $100M+ company started from 0",
      "Codie Sanchez — business newsletter → $20M+ from courses and investments",
      "Sahil Bloom — finance/mindset brand → $5M+ from course and sponsor deals"
    ],
    bestNiches: [
      { niche: "Business & Entrepreneurship", idea: "Teach what you're learning as you go — document, don't create", income: "$5K–$100K+" },
      { niche: "Finance & Investing", idea: "Simplify complex financial concepts for young adults", income: "$3K–$50K MRR" },
      { niche: "Fitness Transformation", idea: "Before/after journey + specific protocol that worked for you", income: "$2K–$30K MRR" },
      { niche: "AI & Productivity", idea: "Teach people how to use AI tools to save 2 hours/day", income: "$5K–$100K+" },
      { niche: "Mindset & Psychology", idea: "Daily mental frameworks for high-performance in modern life", income: "$2K–$40K" },
    ],
    launchPlan: [
      { week: "Week 1–4", task: "Pick ONE platform (LinkedIn, TikTok, or YouTube). Post DAILY. Don't skip. Topic: whatever you know or are learning." },
      { week: "Month 2", task: "Grow to 500+ followers. DM everyone who engages with you. Ask them: 'What's your #1 struggle with [topic]?'" },
      { week: "Month 3", task: "Build minimum viable product: a $27 PDF guide or 1-hour video workshop answering that #1 struggle." },
      { week: "Month 4", task: "Launch to your audience. 100 followers × 5% conversion × $27 = $135. Tiny but proof of concept. Build from there." },
      { week: "Month 6+", task: "Build a full course ($97–$297). Start a weekly email newsletter. Add affiliate partnerships." },
    ],
    investmentRequired: "$0 (phone, free tools, consistency)",
    revenueTimeline: "Month 1–3: $0 | Month 4–6: $500–$2K | Year 1: $5K–$20K | Year 2: $20K–$100K+",
    successRate: 55,
    successNote: "Most people quit in month 2. The only skill that matters is showing up daily. Content compounds — early content brings traffic for years."
  },
  {
    rank: 3,
    title: "High-Ticket B2B Service",
    tagline: "One client = $2,000–$10,000/month. You only need 5 to change your life.",
    icon: "💼",
    badge: "FASTEST INCOME",
    badgeColor: "D.bg2",
    whyBest: "If you need money NOW — not in 6 months — this is the model. You offer a high-value service to businesses (not individuals). Businesses have budgets. They pay without flinching if you solve a real problem. The three highest-demand B2B services right now: AI automation consulting, paid ads management, and B2B lead generation. A single client at $3,000/month and you're making $36K/year. Get 5 clients = $180K/year. No product to build, no audience needed, just skills and outreach.",
    realExamples: [
      "Sam Ovens — consulting agency → $10M/year (started with cold outreach, zero audience)",
      "Alex Hormozi — gym consulting before Acquisition.com → $17M in 3 years",
      "Countless B2B agencies run by 1–3 people making $200K–$2M/year"
    ],
    bestNiches: [
      { niche: "AI Automation", idea: "Build AI workflows that save businesses 10+ hours/week", income: "$3K–$15K/client/month" },
      { niche: "Paid Ads (Meta/Google)", idea: "Run Facebook/Google ads for local or ecommerce businesses", income: "$1.5K–$5K/client/month" },
      { niche: "B2B Lead Generation", idea: "Build automated outbound systems that generate qualified leads", income: "$2K–$8K/client/month" },
      { niche: "Business Process Consulting", idea: "Audit and streamline operations for growing companies", income: "$5K–$20K/project" },
      { niche: "Content & SEO", idea: "Build SEO content systems that generate organic traffic", income: "$2K–$10K/client/month" },
    ],
    launchPlan: [
      { week: "Week 1", task: "Pick your service. Don't have skills yet? Choose one and spend 2 weeks learning via YouTube + doing free projects." },
      { week: "Week 2", task: "Build a proof asset: one case study, one before/after result, one example project for a real or hypothetical business." },
      { week: "Week 3", task: "Identify 50 target businesses. Find decision-maker names on LinkedIn. Write a personalized cold email for each." },
      { week: "Week 4", task: "Send 10 outreach messages/day. Follow up after 3 days. Offer a free audit or strategy call — get them on a call first." },
      { week: "Week 5+", task: "Close your first client at $1,500–$2,500 (discounted to get proof). Deliver exceptional results. Raise to full price for client 2." },
    ],
    investmentRequired: "$0–$500 (tools for your service + a website)",
    revenueTimeline: "Week 3–6: first $1,500–$2,500 client | Month 3: 2–3 clients ($5K–$8K/month) | Month 6: 4–5 clients ($12K–$20K/month)",
    successRate: 72,
    successNote: "Highest success rate when combined with a specific niche and direct outreach. Generalist agencies fail. Niche specialists thrive."
  }
];

export default function BestIdea() {
  const [selected, setSelected] = useState(0);
  const [expandedSection, setExpandedSection] = useState('why');
  const idea = bestIdeas[selected];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
          <EmojiEventsIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700} sx={{ color: D.text1 }}>
            Best Business Ideas
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: `rgba(255,255,255,0.4)` }}>
          Not just ideas — complete models with real examples, launch plans, and income timelines
        </Typography>
      </Box>

      {/* Selector */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {bestIdeas.map((idea, i) => (
          <Box
            key={i}
            onClick={() => { setSelected(i); setExpandedSection('why'); }}
            sx={{
              flex: 1, minWidth: 200, p: 2.5, borderRadius: 2, cursor: 'pointer',
              bgcolor: selected === i ? D.text1 : 'rgba(71,133,89,0.08)',
              border: `2px solid ${selected === i ? '#3b82f6' : 'rgba(71,133,89,0.18)'}`,
              transition: 'all 0.2s', '&:hover': { borderColor: D.text3 }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h3" component="span">{idea.icon}</Typography>
              <Chip label={idea.badge} size="small" sx={{ bgcolor: idea.badgeColor, color: '#fff', fontWeight: 700, fontSize: '0.6rem' }} />
            </Box>
            <Typography fontWeight={700} sx={{ color: D.text1, fontSize: '0.95rem' }}>{idea.title}</Typography>
            <Typography variant="caption" sx={{ color: `rgba(255,255,255,0.4)` }}>{idea.tagline}</Typography>
          </Box>
        ))}
      </Box>

      {/* Main Card */}
      <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(71,133,89,0.08)', borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <Chip label={`#${idea.rank} Pick`} sx={{ bgcolor: '#78350f', color: '#fcd34d', fontWeight: 700 }} />
                <Chip label={idea.badge} sx={{ bgcolor: idea.badgeColor, color: '#fff', fontWeight: 700 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ color: D.text1 }}>{idea.title}</Typography>
              <Typography sx={{ color: `rgba(255,255,255,0.4)`, mt: 0.5 }}>{idea.tagline}</Typography>
            </Box>
          </Box>

          {/* Stats Row */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {[
              { label: 'Investment', value: idea.investmentRequired, color: D.bg4 },
              { label: 'Revenue Timeline', value: idea.revenueTimeline.split('|')[0].trim() + ' → ' + idea.revenueTimeline.split('|')[3]?.trim(), color: D.text3 },
            ].map((s) => (
              <Box key={s.label} sx={{ flex: 1, minWidth: 200, bgcolor: 'rgba(71,133,89,0.08)', borderRadius: 2, p: 2.5 }}>
                <Typography variant="caption" sx={{ color: `rgba(255,255,255,0.4)`, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</Typography>
                <Typography fontWeight={700} sx={{ color: s.color, mt: 0.5 }}>{s.value}</Typography>
              </Box>
            ))}
            <Box sx={{ flex: 1, minWidth: 200, bgcolor: 'rgba(71,133,89,0.08)', borderRadius: 2, p: 2.5 }}>
              <Typography variant="caption" sx={{ color: `rgba(255,255,255,0.4)`, textTransform: 'uppercase', letterSpacing: 1 }}>Success Rate</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <LinearProgress variant="determinate" value={idea.successRate} sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(71,133,89,0.18)', '& .MuiLinearProgress-bar': { bgcolor: D.bg4 } }} />
                <Typography fontWeight={700} sx={{ color: D.bg4 }}>{idea.successRate}%</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: `rgba(255,255,255,0.5)`, fontSize: '0.7rem' }}>{idea.successNote}</Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(71,133,89,0.08)', mb: 3 }} />

          {/* Deep Sections */}
          {[
            {
              key: 'why',
              label: '🏆 Why This Is The Best Model',
              content: <Typography sx={{ color: D.text1, lineHeight: 1.9 }}>{idea.whyBest}</Typography>
            },
            {
              key: 'examples',
              label: '📌 Real People Who Did This',
              content: (
                <Box>
                  {idea.realExamples.map((ex, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                      <CheckCircleIcon sx={{ color: D.bg4, fontSize: 18, mt: 0.3 }} />
                      <Typography sx={{ color: D.text1, lineHeight: 1.7 }}>{ex}</Typography>
                    </Box>
                  ))}
                </Box>
              )
            },
            {
              key: 'niches',
              label: '🎯 Best Niche Opportunities Right Now',
              content: (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {idea.bestNiches.map((n, i) => (
                    <Box key={i} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, border: '1px solid rgba(71,133,89,0.08)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Chip label={n.niche} size="small" sx={{ bgcolor: D.bg2, color: D.text1, fontWeight: 600 }} />
                        <Typography variant="caption" sx={{ color: D.bg4, fontWeight: 700 }}>{n.income}</Typography>
                      </Box>
                      <Typography sx={{ color: `rgba(255,255,255,0.4)`, mt: 0.5 }}>{n.idea}</Typography>
                    </Box>
                  ))}
                </Box>
              )
            },
            {
              key: 'plan',
              label: '🚀 Week-by-Week Launch Plan',
              content: (
                <Box>
                  {idea.launchPlan.map((step, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2.5, alignItems: 'flex-start' }}>
                      <Box sx={{
                        minWidth: 80, height: 28, borderRadius: 2,
                        bgcolor: D.bg2, color: D.text1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700
                      }}>
                        {step.week}
                      </Box>
                      <Typography sx={{ color: D.text1, lineHeight: 1.7 }}>{step.task}</Typography>
                    </Box>
                  ))}
                </Box>
              )
            },
            {
              key: 'revenue',
              label: '📈 Revenue Timeline',
              content: (
                <Box>
                  {idea.revenueTimeline.split('|').map((phase, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
                      <ArrowForwardIcon sx={{ color: D.text3, fontSize: 16 }} />
                      <Typography sx={{ color: D.text1 }}>{phase.trim()}</Typography>
                    </Box>
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
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: `rgba(255,255,255,0.4)` }} />}>
                <Typography fontWeight={600} sx={{ color: D.text1 }}>{section.label}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {section.content}
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}
