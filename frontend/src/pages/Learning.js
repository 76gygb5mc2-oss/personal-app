import { D, FONTS } from '../theme';
import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField,
  Button, Chip, LinearProgress, Divider, Alert, IconButton, Tooltip,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StarIcon from '@mui/icons-material/Star';

const courses = [
  {
    id: 1,
    title: "Business Fundamentals",
    description: "Master the core principles that every entrepreneur needs to succeed",
    icon: "💼",
    color: "D.bg2",
    lessons: [
      {
        title: "What is a Business Model?",
        content: `A business model is the plan a company uses to make money. It answers three core questions:

**1. Who are your customers?**
The specific group of people or companies that will pay you for what you offer. Not "everyone" — but a focused group with a specific problem.

**2. What do you give them?**
Your value proposition — the unique thing that solves their problem better, faster, or cheaper than the alternative.

**3. How do you make money?**
Your revenue model. This includes:
• **One-time sales** — you sell a product once (e.g., furniture store)
• **Subscriptions** — recurring monthly/yearly fee (e.g., Netflix, Spotify)
• **Freemium** — free tier converts to paid (e.g., Dropbox)
• **Marketplace** — take a cut of transactions between buyers and sellers (e.g., Airbnb)
• **Advertising** — offer free service, sell ads (e.g., Google, YouTube)
• **Licensing** — charge for the right to use your IP (e.g., patents, software)

The most successful businesses often combine multiple models. Example: Apple sells hardware (one-time) + software/apps (marketplace fee) + iCloud (subscription).`,
        questions: [
          {
            q: "What are the 3 core questions a business model must answer?",
            correctKeywords: ["customer", "value", "money", "revenue", "who", "what", "how"],
            hint: "Think about WHO you serve, WHAT you offer, and HOW you earn.",
            sampleAnswer: "A business model answers: WHO are your customers, WHAT value do you give them, and HOW do you make money from that value."
          },
          {
            q: "What is the difference between a one-time sale and a subscription model?",
            correctKeywords: ["recurring", "once", "monthly", "repeat", "subscription", "one-time", "regular"],
            hint: "Think about how often money comes in.",
            sampleAnswer: "A one-time sale happens once and you earn that revenue just once. A subscription charges customers regularly (monthly or yearly), creating predictable, recurring revenue."
          },
          {
            q: "Give an example of a business that uses multiple revenue models and explain why.",
            correctKeywords: ["multiple", "combine", "both", "also", "plus", "example"],
            hint: "Think of companies like Apple, Amazon, or Google — they earn money in more than one way.",
            sampleAnswer: "Amazon uses multiple models: retail (one-time sales), Prime (subscription), AWS (pay-per-use), and Marketplace (fees from third-party sellers). This diversifies revenue and reduces dependence on any one stream."
          }
        ]
      },
      {
        title: "Understanding Supply and Demand",
        content: `Supply and demand is the most fundamental force in any market. Mastering it helps you price smarter, spot opportunities, and avoid failures.

**Demand** = How much of a product or service customers want at a given price.
When price goes UP → demand usually goes DOWN.
When price goes DOWN → demand usually goes UP.

**Supply** = How much of a product or service is available in the market.
When price goes UP → suppliers want to produce MORE.
When price goes DOWN → suppliers produce LESS.

**Market Equilibrium** = The price where supply and demand are balanced.

**Why this matters for entrepreneurs:**

🔥 **High demand + Low supply = Your opportunity**
This is a market gap. If people desperately want something that barely exists, you can charge premium prices. Example: early iPhone, electric vehicles in 2015, AI tools in 2022.

📉 **Low demand + High supply = Danger zone**
Competing here means a price war. You have to be cheaper than everyone else — a race to the bottom that destroys profits.

💡 **Real-world application:**
When starting a business, find a gap where demand exists but supply is limited. This is why niche businesses often outperform general ones — a niche has specific demand that mass-market suppliers ignore.`,
        questions: [
          {
            q: "If you are selling handmade leather wallets and suddenly 10 other sellers flood the market with the same product, what happens to prices and why?",
            correctKeywords: ["decrease", "drop", "lower", "fall", "competition", "supply", "increase"],
            hint: "Think about what happens when supply goes up but demand stays the same.",
            sampleAnswer: "Prices will decrease because supply increased while demand stayed the same. More competition means each seller must lower prices to attract buyers, leading to a price war."
          },
          {
            q: "What is a 'market gap' and how would you find one?",
            correctKeywords: ["gap", "demand", "supply", "unmet", "need", "opportunity", "missing", "lack"],
            hint: "Think about where demand exists but supply doesn't keep up.",
            sampleAnswer: "A market gap is where demand exists but supply is limited or poor quality. You find one by researching complaints people have, studying underserved niches, and looking for problems with no good current solution."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Financial Intelligence",
    description: "Understand money, investing, and how to build wealth",
    icon: "💰",
    color: "#065f46",
    lessons: [
      {
        title: "Cash Flow vs Profit",
        content: `This is the single most misunderstood concept in business — and it kills profitable companies.

**Profit** = Revenue minus all expenses. It's what's left on paper.
**Cash Flow** = Actual money moving in and out of your bank account.

**You can be profitable and still go bankrupt.**
Here's how: You sell $100,000 of product. Your clients have 90-day payment terms. Your suppliers need to be paid in 30 days. You show a $20,000 profit — but you have $0 in the bank and $80,000 in unpaid invoices. You can't pay rent, salaries, or suppliers. This is a cash flow crisis.

**The Cash Flow Statement tracks:**
• **Operating cash flow** — money from your core business activities
• **Investing cash flow** — money spent on assets (equipment, property)
• **Financing cash flow** — money from loans or investors

**Rules for healthy cash flow:**
1. Get paid FAST — offer discounts for early payment, charge upfront when possible
2. Pay SLOW — negotiate longer payment terms with suppliers
3. Keep 3–6 months of operating expenses in reserve
4. Know your burn rate — how fast you spend money each month

**Example:**
A restaurant makes $50,000/month revenue with $42,000 in expenses = $8,000 profit.
But if equipment breaks and costs $25,000 to repair, their cash flow is -$17,000 that month even though they're a "profitable" business.`,
        questions: [
          {
            q: "Can a profitable business go bankrupt? Explain how.",
            correctKeywords: ["yes", "cash", "flow", "timing", "payment", "invoice", "bankrupt", "can"],
            hint: "Think about the difference between money on paper vs money in the bank.",
            sampleAnswer: "Yes. A business can be profitable on paper but go bankrupt due to cash flow problems. If clients delay payments while the business must pay suppliers immediately, there's no cash to cover expenses — even if the balance sheet shows a profit."
          },
          {
            q: "What is a 'burn rate' and why does every startup founder need to know it?",
            correctKeywords: ["spend", "monthly", "rate", "how fast", "expenses", "runway", "burn"],
            hint: "Think about how quickly you run out of money.",
            sampleAnswer: "Burn rate is how much money a business spends per month. Founders need to know it to calculate their runway — how many months until they run out of money. If burn rate is $10,000/month and you have $60,000 in the bank, you have 6 months to become profitable or raise more money."
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Sales & Persuasion",
    description: "Learn how to sell anything to anyone — ethically and effectively",
    icon: "🎯",
    color: "#7c2d12",
    lessons: [
      {
        title: "The Psychology of Buying",
        content: `People don't buy products — they buy outcomes, emotions, and identity. Understanding this changes everything about how you sell.

**The 6 Principles of Persuasion (Robert Cialdini):**

**1. Reciprocity** — People feel obligated to give back when you give first.
→ Give value upfront (free advice, free sample, helpful content). People feel compelled to reciprocate with a purchase.

**2. Social Proof** — People follow what others do.
→ Reviews, testimonials, case studies, "500 customers" badges. Nobody wants to be the guinea pig — show them others have gone before.

**3. Authority** — People trust experts.
→ Credentials, publications, media mentions, demonstrated expertise. Build your authority through content and results.

**4. Scarcity** — People want what's limited.
→ "Only 3 left", "Offer ends Friday", limited edition. This triggers fear of missing out (FOMO). Use honestly — fake scarcity destroys trust.

**5. Consistency** — People follow through on commitments.
→ Get small yeses before the big ask. "Can I ask you one question?" leads to a conversation. "Would you like to save money?" leads to a sale.

**6. Liking** — People buy from people they like.
→ Find common ground, be genuinely interested in them, match their communication style.

**The real key:** Most people sell features. Winners sell outcomes.
Bad: "This mattress has memory foam with 12-inch coils."
Good: "You'll wake up completely rested, zero back pain, ready to crush the day."`,
        questions: [
          {
            q: "What is the difference between selling features vs selling outcomes? Give an example.",
            correctKeywords: ["outcome", "result", "benefit", "feature", "difference", "instead"],
            hint: "Features are what something IS. Outcomes are what it DOES for you.",
            sampleAnswer: "Features describe what a product has. Outcomes describe what it does for you. Example: A gym's feature is 'state-of-the-art equipment' but the outcome is 'You'll lose 20 pounds in 3 months and feel confident in any room.' Outcomes connect emotionally and motivate action."
          },
          {
            q: "How would you use the principle of social proof to sell a new product that has no reviews yet?",
            correctKeywords: ["beta", "free", "testimonial", "early", "users", "review", "proof", "give"],
            hint: "Think about how to get your first real reviews or proof quickly.",
            sampleAnswer: "Offer the product free or at a deep discount to 5–10 people in exchange for honest testimonials. Document their results, get photos or video, and use those as social proof. Even 3–5 real reviews are powerful for a new product."
          }
        ]
      }
    ]
  }
];

function QuizQuestion({ question, onAnswer, answered, isCorrect, feedback }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim().length < 10) return;
    onAnswer(answer);
  };

  return (
    <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, border: '1px solid rgba(71,133,89,0.08)' }}>
      <Typography fontWeight={600} sx={{ color: D.text1, mb: 2 }}>
        ❓ {question.q}
      </Typography>

      {!answered ? (
        <>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Type your answer here — explain it in your own words..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(71,133,89,0.08)',
                color: D.text1,
                '& fieldset': { borderColor: 'rgba(71,133,89,0.18)' },
                '&:hover fieldset': { borderColor: `rgba(255,255,255,0.5)` },
                '&.Mui-focused fieldset': { borderColor: D.text3 },
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={answer.trim().length < 10}
              sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, textTransform: 'none', fontWeight: 600 }}
              endIcon={<ArrowForwardIcon />}
            >
              Submit Answer
            </Button>
            <Typography variant="caption" sx={{ color: `rgba(255,255,255,0.5)` }}>
              {answer.length < 10 ? `${10 - answer.length} more chars needed` : '✓ Ready to submit'}
            </Typography>
          </Box>
          {question.hint && (
            <Typography variant="caption" sx={{ color: `rgba(255,255,255,0.5)`, mt: 1, display: 'block' }}>
              💡 Hint: {question.hint}
            </Typography>
          )}
        </>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
            {isCorrect
              ? <CheckCircleIcon sx={{ color: D.bg4 }} />
              : <CancelIcon sx={{ color: '#ef4444' }} />}
            <Typography fontWeight={700} sx={{ color: isCorrect ? D.bg4 : '#ef4444' }}>
              {isCorrect ? 'Great answer! You got it.' : 'Not quite — here\'s what was missing:'}
            </Typography>
          </Box>
          <Box sx={{ bgcolor: 'rgba(71,133,89,0.08)', borderRadius: 2, p: 2, mb: 2 }}>
            <Typography variant="caption" sx={{ color: `rgba(255,255,255,0.4)`, textTransform: 'uppercase', letterSpacing: 1 }}>Your answer</Typography>
            <Typography sx={{ color: `rgba(255,255,255,0.4)`, mt: 0.5 }}>{feedback.userAnswer}</Typography>
          </Box>
          {!isCorrect && (
            <Box sx={{ bgcolor: 'rgba(45,106,79,0.12)', borderRadius: 2, p: 2, border: '1px solid D.bg2' }}>
              <Typography variant="caption" sx={{ color: D.text2, textTransform: 'uppercase', letterSpacing: 1 }}>Sample Answer</Typography>
              <Typography sx={{ color: '#86efac', mt: 0.5 }}>{question.sampleAnswer}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default function Learning() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [lessonComplete, setLessonComplete] = useState(false);

  const checkAnswer = (answer, question) => {
    const lower = answer.toLowerCase();
    const matchedKeywords = question.correctKeywords.filter(kw => lower.includes(kw.toLowerCase()));
    return matchedKeywords.length >= Math.ceil(question.correctKeywords.length * 0.4);
  };

  const handleAnswer = (lessonIdx, questionIdx, answer) => {
    const lesson = selectedLesson;
    const question = lesson.questions[questionIdx];
    const isCorrect = checkAnswer(answer, question);

    const key = `${lessonIdx}-${questionIdx}`;
    const newAnswers = { ...questionAnswers, [key]: { answered: true, isCorrect, userAnswer: answer } };
    setQuestionAnswers(newAnswers);

    // Check if all questions answered
    const allAnswered = lesson.questions.every((_, qi) => newAnswers[`${lessonIdx}-${qi}`]?.answered);
    if (allAnswered) setLessonComplete(true);
  };

  const startLesson = (course, lesson) => {
    setSelectedCourse(course);
    setSelectedLesson(lesson);
    setQuestionAnswers({});
    setLessonComplete(false);
  };

  const backToCourses = () => {
    setSelectedCourse(null);
    setSelectedLesson(null);
    setLessonComplete(false);
    setQuestionAnswers({});
  };

  const score = selectedLesson
    ? selectedLesson.questions.filter((_, qi) => questionAnswers[`0-${qi}`]?.isCorrect).length
    : 0;

  if (selectedLesson) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button onClick={backToCourses} sx={{ color: `rgba(255,255,255,0.4)`, mb: 3, textTransform: 'none' }}>
          ← Back to Courses
        </Button>

        <Box sx={{ mb: 1 }}>
          <Chip label={selectedCourse.title} size="small" sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: `rgba(255,255,255,0.4)`, mb: 1 }} />
          <Typography variant="h4" fontWeight={700} sx={{ color: D.text1 }}>
            {selectedLesson.title}
          </Typography>
        </Box>

        {/* Lesson Content */}
        <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(71,133,89,0.08)', borderRadius: 3, mb: 4, mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="overline" sx={{ color: D.text3, letterSpacing: 2 }}>📖 LESSON</Typography>
            <Box sx={{ mt: 2 }}>
              {selectedLesson.content.split('\n\n').map((para, i) => (
                <Typography key={i} sx={{
                  color: D.text1, lineHeight: 1.9, mb: 2,
                  '& strong': { color: D.text1, fontWeight: 700 }
                }}>
                  {para.split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                    pi % 2 === 1
                      ? <strong key={pi}>{part}</strong>
                      : part
                  )}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Questions */}
        <Typography variant="h5" fontWeight={700} sx={{ color: D.text1, mb: 3 }}>
          🧠 Test Your Understanding
        </Typography>
        <Typography variant="body2" sx={{ color: `rgba(255,255,255,0.4)`, mb: 3 }}>
          Answer in your own words — no copy-paste, no one-word answers. This is how you actually learn.
        </Typography>

        {selectedLesson.questions.map((question, qi) => {
          const key = `0-${qi}`;
          const ans = questionAnswers[key];
          return (
            <QuizQuestion
              key={qi}
              question={question}
              answered={ans?.answered || false}
              isCorrect={ans?.isCorrect || false}
              feedback={ans}
              onAnswer={(answer) => handleAnswer(0, qi, answer)}
            />
          );
        })}

        {lessonComplete && (
          <Card sx={{ bgcolor: score === selectedLesson.questions.length ? '#0f2b1a' : '#1e1b0f', border: `1px solid ${score === selectedLesson.questions.length ? D.bg2 : '#78350f'}`, borderRadius: 3, mt: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 48, color: score === selectedLesson.questions.length ? D.bg4 : '#f59e0b', mb: 1 }} />
              <Typography variant="h5" fontWeight={700} sx={{ color: D.text1, mb: 1 }}>
                {score === selectedLesson.questions.length ? 'Perfect Score! 🎉' : 'Lesson Complete'}
              </Typography>
              <Typography sx={{ color: `rgba(255,255,255,0.4)` }}>
                {score} / {selectedLesson.questions.length} correct — {Math.round((score / selectedLesson.questions.length) * 100)}%
              </Typography>
              <Button
                variant="contained"
                onClick={backToCourses}
                sx={{ mt: 3, bgcolor: D.bg2, textTransform: 'none', fontWeight: 600 }}
              >
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: D.text1 }}>
          📚 Learning
        </Typography>
        <Typography variant="body2" sx={{ color: `rgba(255,255,255,0.4)`, mt: 0.5 }}>
          Read the lesson → Answer questions → Get instant feedback. Active learning, not passive reading.
        </Typography>
      </Box>

      {/* ── PERSONAL TUTOR SECTION ── */}
      <Card sx={{
        bgcolor: 'rgba(45,106,79,0.15)',
        border: '1px solid rgba(71,133,89,0.35)',
        borderRadius: 3,
        mb: 4,
        overflow: 'visible',
        position: 'relative',
      }}>
        <Box sx={{
          position: 'absolute', top: -14, left: 24,
          bgcolor: D.bg2, borderRadius: 2, px: 2, py: 0.5,
          display: 'flex', alignItems: 'center', gap: 1,
        }}>
          <SchoolIcon sx={{ fontSize: 16, color: D.text1 }} />
          <Typography variant="caption" fontWeight={700} sx={{ color: D.text1, letterSpacing: 1, textTransform: 'uppercase' }}>
            Personal Tutor
          </Typography>
        </Box>

        <CardContent sx={{ p: 4, pt: 4.5 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: D.text1, mb: 0.5 }}>
            🎓 Your AI Tutor, Examiner & Learning Manager
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(200,230,210,0.7)', mb: 3 }}>
            Upload any book, PDF, or document — I'll teach it to you one lesson at a time, test your understanding, and track your mastery.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            {[
              { icon: <AutoStoriesIcon sx={{ fontSize: 20, color: D.bg4 }} />, label: 'Analyze & build a learning roadmap', desc: 'Every book is broken into structured lessons with clear objectives.' },
              { icon: <PsychologyIcon sx={{ fontSize: 20, color: D.bg4 }} />, label: 'Teach one lesson at a time', desc: 'Simple explanations + real-world examples. I wait for you before moving on.' },
              { icon: <TrackChangesIcon sx={{ fontSize: 20, color: D.bg4 }} />, label: 'Test with 3 question types', desc: 'Comprehension, application, and critical-thinking — graded 0–100 with full feedback.' },
              { icon: <StarIcon sx={{ fontSize: 20, color: D.bg4 }} />, label: 'Track your mastery', desc: 'Progress, scores, weak topics, and spaced repetition. Mastery = 85%+ consistently.' },
            ].map((item, i) => (
              <Box key={i} sx={{
                display: 'flex', alignItems: 'flex-start', gap: 2,
                p: 2, borderRadius: 2, bgcolor: 'rgba(71,133,89,0.08)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <Box sx={{ mt: 0.2 }}>{item.icon}</Box>
                <Box>
                  <Typography fontWeight={600} sx={{ color: D.text1, fontSize: '0.9rem' }}>{item.label}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(200,230,210,0.6)' }}>{item.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Accordion sx={{ bgcolor: 'rgba(71,133,89,0.08)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px !important', mb: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: D.text3 }} />}>
              <Typography fontWeight={600} sx={{ color: D.text1, fontSize: '0.9rem' }}>
                📊 What I track for you
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  'Current book & chapter','Lessons completed','Quiz scores (0–100)',
                  'Average score','Strongest topics','Weakest topics',
                  'Mastery percentage','Spaced repetition reviews','Difficulty progression',
                ].map((item) => (
                  <Chip key={item} label={item} size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: D.text2, border: '1px solid rgba(71,133,89,0.25)', fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Box sx={{
            p: 2, borderRadius: 2,
            bgcolor: 'rgba(234,179,8,0.08)',
            border: '1px solid rgba(234,179,8,0.2)',
            display: 'flex', alignItems: 'center', gap: 2, mb: 3,
          }}>
            <EmojiEventsIcon sx={{ color: '#f59e0b', fontSize: 28, flexShrink: 0 }} />
            <Box>
              <Typography fontWeight={700} sx={{ color: '#fde68a', fontSize: '0.9rem' }}>Mastery Rule</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(253,230,138,0.7)' }}>
                A topic is not mastered until you score at least <strong>85%</strong> consistently AND can explain and apply it yourself.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AutoStoriesIcon />}
              sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              onClick={() => alert('Send a book or PDF in the chat to get started!')}
            >
              Upload a Book to Start
            </Button>
            <Typography variant="caption" sx={{ color: 'rgba(200,230,210,0.5)' }}>
              Supports PDF, EPUB, or pasted text
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* ── COURSES ── */}
      <Typography variant="h6" fontWeight={700} sx={{ color: D.text1, mb: 2 }}>📖 Courses</Typography>

      {courses.map((course) => (
        <Card key={course.id} sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(71,133,89,0.08)', borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h3" component="span">{course.icon}</Typography>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ color: D.text1 }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" sx={{ color: `rgba(255,255,255,0.4)` }}>{course.description}</Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(71,133,89,0.08)', mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {course.lessons.map((lesson, li) => (
                <Box
                  key={li}
                  onClick={() => startLesson(course, lesson)}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    p: 2, borderRadius: 2, bgcolor: 'rgba(71,133,89,0.08)', border: '1px solid rgba(71,133,89,0.18)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', borderColor: D.text3, transform: 'translateX(4px)' }
                  }}
                >
                  <Box>
                    <Typography fontWeight={600} sx={{ color: D.text1 }}>{lesson.title}</Typography>
                    <Typography variant="caption" sx={{ color: `rgba(255,255,255,0.5)` }}>
                      {lesson.questions.length} questions
                    </Typography>
                  </Box>
                  <ArrowForwardIcon sx={{ color: `rgba(255,255,255,0.5)` }} />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
