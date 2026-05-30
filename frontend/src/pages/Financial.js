import { D, FONTS } from '../theme';
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField,
  Button, Chip, Divider, Tab, Tabs, Alert, IconButton,
  LinearProgress, InputAdornment, CircularProgress, List,
  ListItem, Switch, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NightlightIcon from '@mui/icons-material/Nightlight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useAuth } from '../context/AuthContext';
import CryptoJS from 'crypto-js';

/* ── Encryption ─────────────────────────────────────────── */
const STORAGE_KEY = 'swpg_work_v1';
const getKey = (pin, user) => CryptoJS.SHA256(`${user}:${pin}:swpg-work-2024`).toString();
const save = (data, key) => localStorage.setItem(STORAGE_KEY, CryptoJS.AES.encrypt(JSON.stringify(data), key).toString());
const load = (key) => { try { const e = localStorage.getItem(STORAGE_KEY); if (!e) return null; const b = CryptoJS.AES.decrypt(e, key); const s = b.toString(CryptoJS.enc.Utf8); return s ? JSON.parse(s) : null; } catch { return null; } };

/* ── PIN Lock ───────────────────────────────────────────── */
function PinLock({ onUnlock }) {
  const { user } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (locked && timer > 0) { const t = setTimeout(() => setTimer(s => s - 1), 1000); return () => clearTimeout(t); }
    if (locked && timer === 0) setLocked(false);
  }, [locked, timer]);

  const addDigit = (d) => {
    if (locked || pin.length >= 4) return;
    const next = pin + d; setPin(next); setError('');
    if (next.length === 4) {
      setTimeout(() => {
        if (next === user?.pin) { onUnlock(next); }
        else {
          setShake(true); setTimeout(() => setShake(false), 600);
          const na = attempts + 1; setAttempts(na);
          if (na >= 3) { setLocked(true); setTimer(30); setError('Too many attempts. Locked 30s.'); }
          else setError(`Wrong PIN. ${3 - na} left.`);
          setPin('');
        }
      }, 120);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ p: 5, borderRadius: 5, textAlign: 'center', maxWidth: 340, width: '100%', mx: 3, bgcolor: 'rgba(14,14,14,0.98)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', animation: shake ? 'shake 0.5s ease' : 'none', '@keyframes shake': { '0%,100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-10px)' }, '40%': { transform: 'translateX(10px)' }, '60%': { transform: 'translateX(-8px)' }, '80%': { transform: 'translateX(8px)' } } }}>
        <Box sx={{ width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2.5, background: `linear-gradient(135deg, ${D.bg3} 0%, ${D.bg0} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px rgba(71,133,89,0.4)`, border: '1px solid rgba(255,255,255,0.12)' }}>
          {locked ? <ShieldIcon sx={{ color: '#f87171', fontSize: 30 }} /> : <LockIcon sx={{ color: D.text2, fontSize: 30 }} />}
        </Box>
        <Typography variant="h5" fontWeight={800} sx={{ color: D.text1, mb: 0.5 }}>Work Tracker</Typography>
        <Typography sx={{ color: D.text3, fontSize: '0.85rem', mb: 3.5 }}>{locked ? `Locked — ${timer}s` : 'Enter your 4-digit PIN'}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          {[0,1,2,3].map(i => <Box key={i} sx={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${pin.length > i ? D.text2 : 'rgba(255,255,255,0.18)'}`, bgcolor: pin.length > i ? D.text2 : 'transparent', transition: 'all 0.15s', boxShadow: pin.length > i ? `0 0 8px ${D.text2}` : 'none' }} />)}
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2.5, bgcolor: 'rgba(100,20,20,0.5)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)', fontSize: '0.82rem', py: 0.5 }}>{error}</Alert>}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1.2 }}>
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
            <Box key={i} onClick={() => { if (k === '') return; if (k === '⌫') setPin(p => p.slice(0,-1)); else addDigit(String(k)); }}
              sx={{ py: 1.8, borderRadius: 2.5, textAlign: 'center', cursor: k === '' || locked ? 'default' : 'pointer', bgcolor: k === '' ? 'transparent' : 'rgba(71,133,89,0.1)', border: `1px solid ${k === '' ? 'transparent' : 'rgba(255,255,255,0.10)'}`, color: D.text1, fontWeight: 700, fontSize: '1.2rem', opacity: locked && k !== '' ? 0.4 : 1, transition: 'all 0.15s', '&:hover': k !== '' && !locked ? { bgcolor: 'rgba(71,133,89,0.25)', transform: 'scale(1.05)' } : {}, userSelect: 'none' }}>{k}</Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* ── Helpers ────────────────────────────────────────────── */
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_DEFAULTS = {
  Monday:    { off: true,  start: '',      end: '',      break: 0 },
  Tuesday:   { off: false, start: '07:00', end: '20:00', break: 30 },
  Wednesday: { off: true,  start: '',      end: '',      break: 0 },
  Thursday:  { off: false, start: '12:00', end: '19:00', break: 0 },
  Friday:    { off: false, start: '19:00', end: '07:00', break: 30 },
  Saturday:  { off: false, start: '07:00', end: '19:00', break: 30 },
  Sunday:    { off: false, start: '07:00', end: '20:00', break: 30 },
};

const EXPENSE_CATEGORIES = ['Gas','Food','Bills','Car','Rent','Debt Payment','Savings','Other'];
const EXPENSE_ICONS = { Gas:'⛽', Food:'🍔', Bills:'💡', Car:'🚗', Rent:'🏠', 'Debt Payment':'💳', Savings:'🐖', Other:'📦' };

function parseTime(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function calcHours(start, end, breakMins) {
  if (!start || !end) return 0;
  let s = parseTime(start), e = parseTime(end);
  if (e <= s) e += 1440; // crosses midnight
  const raw = (e - s) / 60;
  return Math.max(0, raw - (breakMins || 0) / 60);
}

function isNightShift(start, end) {
  if (!start || !end) return false;
  const s = parseTime(start), e = parseTime(end);
  return e < s || s >= 18 * 60; // crosses midnight or starts at/after 6pm
}

function isLongShift(hours) { return hours >= 10; }

function fmt(n) { return n.toFixed(2); }
function fmtHrs(h) { const hh = Math.floor(h); const mm = Math.round((h - hh) * 60); return `${hh}h ${mm}m`; }

/* ── Week Builder ───────────────────────────────────────── */
function buildWeek(schedule) {
  let total = 0, dayHrs = 0, nightHrs = 0, longShifts = 0;
  const days = DAYS.map(day => {
    const d = schedule[day] || DAY_DEFAULTS[day];
    if (d.off) return { day, hours: 0, night: false, long: false, off: true };
    const h = calcHours(d.start, d.end, d.break);
    const night = isNightShift(d.start, d.end);
    const long = isLongShift(h);
    total += h;
    if (night) nightHrs += h; else dayHrs += h;
    if (long) longShifts++;
    return { day, hours: h, night, long, off: false, start: d.start, end: d.end, break: d.break };
  });
  const overtime = Math.max(0, total - 40);
  const regularHrs = Math.min(total, 40);
  return { days, total, dayHrs, nightHrs, longShifts, overtime, regularHrs };
}

/* ── Pay Calculator ─────────────────────────────────────── */
function calcPay(week, wage, otRate) {
  const ot = otRate || 1.5;
  const gross = (week.regularHrs * wage) + (week.overtime * wage * ot);
  const biweekly = gross * 2;
  const monthly = gross * 4.33;
  // rough tax estimate (20% bracket)
  const taxRate = gross > 800 ? 0.22 : gross > 400 ? 0.18 : 0.12;
  const estimatedTax = gross * taxRate;
  const net = gross - estimatedTax;
  return { gross, biweekly, monthly, estimatedTax, net, taxRate };
}

/* ── Weekly Review AI ───────────────────────────────────── */
function WeeklyReview({ week, pay, expenses, wage, savings }) {
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const savingsAmt = expenses.filter(e => e.category === 'Savings').reduce((s, e) => s + e.amount, 0);
  const remaining = pay.net - totalExpenses;
  const savingsRate = pay.net > 0 ? (savingsAmt / pay.net) * 100 : 0;

  const notes = [];

  // Hours check
  if (week.total === 0) notes.push({ icon: '⚠️', type: 'warning', text: 'No hours logged this week. Add your schedule above.' });
  else if (week.total > 50) notes.push({ icon: '😓', type: 'warning', text: `You worked ${fmtHrs(week.total)} this week — that's a lot. Make sure you're resting and not burning out.` });
  else if (week.total < 20 && week.total > 0) notes.push({ icon: '📉', type: 'warning', text: `Only ${fmtHrs(week.total)} worked this week — lighter paycheck coming. Plan accordingly.` });
  else notes.push({ icon: '✅', type: 'success', text: `Solid week — ${fmtHrs(week.total)} worked. ${week.overtime > 0 ? `Includes ${fmtHrs(week.overtime)} overtime at ${(1.5).toFixed(1)}x pay.` : 'No overtime this week.'}` });

  // Pay check
  if (wage === 0) notes.push({ icon: '💵', type: 'warning', text: 'Enter your hourly wage to see paycheck estimates.' });
  else notes.push({ icon: '💰', type: 'success', text: `Estimated gross this week: $${fmt(pay.gross)}. After ~${(pay.taxRate * 100).toFixed(0)}% taxes, take-home ≈ $${fmt(pay.net)}.` });

  // Expense check
  if (totalExpenses === 0) notes.push({ icon: '📋', type: 'info', text: 'No expenses logged. Add your gas, food, bills etc. to see what you actually keep.' });
  else {
    if (remaining < 0) notes.push({ icon: '🚨', type: 'error', text: `Spending MORE than you earn by $${fmt(Math.abs(remaining))}. Cut expenses immediately.` });
    else if (remaining < pay.net * 0.1) notes.push({ icon: '⚠️', type: 'warning', text: `Only $${fmt(remaining)} left after expenses — that's tight. Look for things to cut.` });
    else notes.push({ icon: '✅', type: 'success', text: `$${fmt(remaining)} remaining after all expenses. Good buffer.` });
  }

  // Savings
  if (savingsRate === 0 && pay.net > 0) notes.push({ icon: '🐖', type: 'warning', text: 'No savings logged. Try to save at least 10–20% of take-home each week.' });
  else if (savingsRate > 0 && savingsRate < 10) notes.push({ icon: '📈', type: 'warning', text: `Saving ${savingsRate.toFixed(1)}% — below the 10% minimum. Try to increase it.` });
  else if (savingsRate >= 20) notes.push({ icon: '🏆', type: 'success', text: `Excellent! Saving ${savingsRate.toFixed(1)}% of take-home. Keep it up.` });
  else if (savingsRate >= 10) notes.push({ icon: '✅', type: 'success', text: `Saving ${savingsRate.toFixed(1)}% — on track. Push toward 20% when possible.` });

  // Savings goal
  if (savings.goal > 0) {
    const pct = Math.min((savings.current / savings.goal) * 100, 100);
    const left = Math.max(0, savings.goal - savings.current);
    const wksLeft = savingsAmt > 0 ? Math.ceil(left / savingsAmt) : '?';
    notes.push({ icon: '🎯', type: 'info', text: `Savings goal: $${savings.goal.toLocaleString()}. You have $${savings.current.toLocaleString()} (${pct.toFixed(0)}%). ${left > 0 ? `$${left.toLocaleString()} to go — ~${wksLeft} weeks at current rate.` : 'Goal reached! 🎉'}` });
  }

  // Top expense
  const topExp = [...expenses].sort((a, b) => b.amount - a.amount)[0];
  if (topExp) notes.push({ icon: '📊', type: 'info', text: `Biggest expense: ${topExp.category} at $${fmt(topExp.amount)} (${pay.net > 0 ? ((topExp.amount / pay.net) * 100).toFixed(1) : 0}% of take-home).` });

  // Night shift note
  if (week.nightHrs > 0) notes.push({ icon: '🌙', type: 'info', text: `${fmtHrs(week.nightHrs)} worked on night shifts. If your job pays night diff, add that to your wage calculation.` });

  // What to fix
  const fixes = [];
  if (week.overtime > 0) fixes.push('Overtime detected — verify your employer calculated it at 1.5x');
  if (remaining < 0) fixes.push('Expenses exceed income — identify what to cut before next paycheck');
  if (savingsRate < 10 && pay.net > 0) fixes.push('Increase savings — even $20/week adds up');
  if (fixes.length > 0) notes.push({ icon: '🔧', type: 'warning', text: `Before next paycheck: ${fixes.join(' · ')}` });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <SmartToyIcon sx={{ color: D.text2, fontSize: 26 }} />
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: D.text1 }}>Weekly Review</Typography>
          <Typography sx={{ color: D.text3, fontSize: '0.78rem' }}>AI analysis of your work week & finances</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {notes.map((n, i) => (
          <Box key={i} sx={{
            p: 2, borderRadius: 2.5, display: 'flex', gap: 1.5, alignItems: 'flex-start',
            bgcolor: n.type === 'error' ? 'rgba(239,68,68,0.08)' : n.type === 'warning' ? 'rgba(245,158,11,0.08)' : n.type === 'success' ? 'rgba(255,255,255,0.04)' : 'rgba(148,204,171,0.06)',
            border: `1px solid ${n.type === 'error' ? 'rgba(239,68,68,0.2)' : n.type === 'warning' ? 'rgba(245,158,11,0.2)' : n.type === 'success' ? 'rgba(255,255,255,0.06)' : 'rgba(148,204,171,0.1)'}`,
          }}>
            <Typography sx={{ fontSize: '1.1rem', flexShrink: 0, mt: 0.1 }}>{n.icon}</Typography>
            <Typography sx={{ color: D.text1, fontSize: '0.85rem', lineHeight: 1.6 }}>{n.text}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ── Main Component ─────────────────────────────────────── */
function WorkTracker({ pin, username }) {
  const encKey = getKey(pin, username);
  const [tab, setTab] = useState(0);

  // Schedule state
  const [schedule, setSchedule] = useState(() => {
    const s = {};
    DAYS.forEach(d => { s[d] = { ...DAY_DEFAULTS[d] }; });
    return s;
  });

  // Settings
  const [wage, setWage] = useState(0);
  const [wageInput, setWageInput] = useState('');
  const [otRate] = useState(1.5);

  // Expenses
  const [expenses, setExpenses] = useState([]);
  const [newExp, setNewExp] = useState({ category: 'Gas', amount: '', note: '' });

  // Savings goal
  const [savings, setSavings] = useState({ goal: 0, current: 0, goalInput: '', currentInput: '' });

  // Week history
  const [weekHistory, setWeekHistory] = useState([]);
  const [weekNote, setWeekNote] = useState('');
  const [lockedSchedule, setLockedSchedule] = useState(null);
  const [savedAlert, setSavedAlert] = useState('');
  const [addingPast, setAddingPast] = useState(false);
  const [pastEntry, setPastEntry] = useState({ date: '', hours: '', gross: '', note: '' });

  // Load saved data
  useEffect(() => {
    const d = load(encKey);
    if (d) {
      if (d.schedule) setSchedule(d.schedule);
      if (d.wage) { setWage(d.wage); setWageInput(String(d.wage)); }
      if (d.expenses) setExpenses(d.expenses);
      if (d.savings) setSavings(s => ({ ...s, ...d.savings }));
      if (d.weekHistory) setWeekHistory(d.weekHistory);
      if (d.lockedSchedule) setLockedSchedule(d.lockedSchedule);
    }
  }, [encKey]);

  // Auto-save
  useEffect(() => {
    save({ schedule, wage, expenses, savings: { goal: savings.goal, current: savings.current }, weekHistory, lockedSchedule }, encKey);
  }, [schedule, wage, expenses, savings.goal, savings.current, weekHistory, encKey]);

  const week = buildWeek(schedule);
  const pay = calcPay(week, wage, otRate);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = pay.net - totalExpenses;

  const updateDay = (day, field, value) => setSchedule(s => ({ ...s, [day]: { ...s[day], [field]: value } }));

  const lockSchedule = () => {
    setLockedSchedule(JSON.parse(JSON.stringify(schedule)));
    setSavedAlert('✅ Schedule locked as your default template!');
    setTimeout(() => setSavedAlert(''), 3000);
  };

  const loadLockedSchedule = () => {
    if (lockedSchedule) {
      setSchedule(JSON.parse(JSON.stringify(lockedSchedule)));
      setSavedAlert('📋 Default schedule loaded!');
      setTimeout(() => setSavedAlert(''), 3000);
    }
  };

  const saveCurrentWeek = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      totalHours: week.total,
      gross: pay.gross,
      net: pay.net,
      expenses: totalExpenses,
      remaining,
      note: weekNote,
    };
    setWeekHistory(prev => [entry, ...prev].slice(0, 24));
    setWeekNote('');
    setSavedAlert('✅ Week saved to history!');
    setTimeout(() => setSavedAlert(''), 3000);
  };

  const addPastWeek = () => {
    if (!pastEntry.date || !pastEntry.hours) return;
    const hrs = parseFloat(pastEntry.hours) || 0;
    const gross = parseFloat(pastEntry.gross) || (hrs * wage);
    const entry = {
      id: Date.now(),
      date: pastEntry.date,
      totalHours: hrs,
      gross,
      net: gross * 0.75,
      expenses: 0,
      remaining: gross * 0.75,
      note: pastEntry.note || 'Past week (manually added)',
      isPast: true,
    };
    setWeekHistory(prev => [...prev, entry].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 24));
    setPastEntry({ date: '', hours: '', gross: '', note: '' });
    setAddingPast(false);
    setSavedAlert('✅ Past week added to history!');
    setTimeout(() => setSavedAlert(''), 3000);
  };

  const addExpense = () => {
    if (!newExp.amount || parseFloat(newExp.amount) <= 0) return;
    setExpenses(prev => [...prev, { id: Date.now(), ...newExp, amount: parseFloat(newExp.amount) }]);
    setNewExp(n => ({ ...n, amount: '', note: '' }));
  };

  const saveWeek = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      totalHours: week.total,
      gross: pay.gross,
      net: pay.net,
      expenses: totalExpenses,
      remaining,
      note: weekNote,
    };
    setWeekHistory(prev => [entry, ...prev].slice(0, 12));
    setWeekNote('');
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': { bgcolor: 'rgba(13,38,24,0.6)', color: D.text1, '& fieldset': { borderColor: 'rgba(255,255,255,0.10)' }, '&:hover fieldset': { borderColor: D.text2 }, '&.Mui-focused fieldset': { borderColor: D.text2, borderWidth: 2 } },
    '& .MuiInputLabel-root': { color: D.text3 },
    '& .MuiInputLabel-root.Mui-focused': { color: D.text2 },
    '& .MuiInputBase-input': { color: D.text1 },
    '& .MuiSelect-icon': { color: D.text3 },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: D.text1 }}>⏱ Work Tracker</Typography>
          <Chip icon={<LockIcon sx={{ fontSize: '14px !important' }} />} label="Encrypted" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: D.text2, border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.7rem' }} />
        </Box>
        <Typography variant="body2" sx={{ color: D.text3 }}>Your personal paycheck & expense tracker</Typography>
      </Box>

      {/* Wage setting */}
      <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <AttachMoneyIcon sx={{ color: D.text2 }} />
            <Typography fontWeight={700} sx={{ color: D.text1 }}>Hourly Wage</Typography>
            <TextField size="small" type="number" placeholder="e.g. 18.50"
              value={wageInput} onChange={e => setWageInput(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }}
              sx={{ ...inputSx, width: 150 }} />
            <Button variant="contained" size="small" startIcon={<SaveIcon />}
              onClick={() => setWage(parseFloat(wageInput) || 0)}
              sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, fontWeight: 700 }}>Save Wage</Button>
            {wage > 0 && <Chip label={`$${wage}/hr`} sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: D.text2, fontWeight: 700 }} />}
          </Box>
        </CardContent>
      </Card>

      {/* Dashboard summary */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(3,1fr)', lg: 'repeat(6,1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Total Hours', value: fmtHrs(week.total), color: D.text2, icon: '⏱' },
          { label: 'Overtime', value: week.overtime > 0 ? fmtHrs(week.overtime) : 'None', color: week.overtime > 0 ? '#f59e0b' : D.text3, icon: '🔥' },
          { label: 'Gross Pay', value: `$${fmt(pay.gross)}`, color: D.bg4, icon: '💵' },
          { label: 'Est. Take-Home', value: `$${fmt(pay.net)}`, color: D.text2, icon: '🏦' },
          { label: 'Expenses', value: `$${fmt(totalExpenses)}`, color: totalExpenses > pay.net ? '#ef4444' : '#f59e0b', icon: '💸' },
          { label: 'Remaining', value: `${remaining >= 0 ? '+' : ''}$${fmt(remaining)}`, color: remaining >= 0 ? D.bg4 : '#ef4444', icon: remaining >= 0 ? '✅' : '🚨' },
        ].map(m => (
          <Box key={m.label} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.08)', textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.3rem', mb: 0.3 }}>{m.icon}</Typography>
            <Typography sx={{ fontSize: '0.62rem', color: D.text3, textTransform: 'uppercase', letterSpacing: 1 }}>{m.label}</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: m.color, mt: 0.3 }}>{m.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3, '& .MuiTabs-indicator': { bgcolor: D.text2 } }}>
        <Tab label="📅 Schedule" sx={{ color: D.text3, '&.Mui-selected': { color: D.text2 }, textTransform: 'none', fontWeight: 600 }} />
        <Tab label="💸 Expenses" sx={{ color: D.text3, '&.Mui-selected': { color: D.text2 }, textTransform: 'none', fontWeight: 600 }} />
        <Tab label="📊 Pay Details" sx={{ color: D.text3, '&.Mui-selected': { color: D.text2 }, textTransform: 'none', fontWeight: 600 }} />
        <Tab label="🤖 Weekly Review" sx={{ color: D.text3, '&.Mui-selected': { color: D.text2 }, textTransform: 'none', fontWeight: 600 }} />
        <Tab label="📜 History" sx={{ color: D.text3, '&.Mui-selected': { color: D.text2 }, textTransform: 'none', fontWeight: 600 }} />
      </Tabs>

      {/* ── TAB 0: SCHEDULE ── */}
      {tab === 0 && (
        <Box>
          {savedAlert && (
            <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(45,106,79,0.2)', color: D.text2, border: '1px solid rgba(255,255,255,0.18)' }}>
              {savedAlert}
            </Alert>
          )}

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
            <Button variant="contained" startIcon={<LockIcon />} onClick={lockSchedule}
              sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, textTransform: 'none', fontWeight: 700 }}>
              Lock as Default
            </Button>
            <Button variant="outlined" onClick={loadLockedSchedule} disabled={!lockedSchedule}
              sx={{ borderColor: D.text3, color: D.text3, '&:hover': { borderColor: D.text2, color: D.text2 }, textTransform: 'none', fontWeight: 600 }}>
              Load Default
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={saveCurrentWeek}
              sx={{ bgcolor: '#065f46', '&:hover': { bgcolor: D.bg2 }, textTransform: 'none', fontWeight: 700 }}>
              Save This Week
            </Button>
          </Box>

          {lockedSchedule && (
            <Alert severity="info" sx={{ mb: 2, bgcolor: 'rgba(59,130,246,0.08)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.8rem' }}>
              🔒 You have a locked default schedule. Click "Load Default" to restore it any time.
            </Alert>
          )}

          <Typography sx={{ color: D.text3, fontSize: '0.82rem', mb: 2 }}>
            Edit your schedule below. Lock it as your default template, then save each week to history.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {DAYS.map(day => {
              const d = schedule[day];
              const hrs = d.off ? 0 : calcHours(d.start, d.end, d.break);
              const night = !d.off && isNightShift(d.start, d.end);
              const long = isLongShift(hrs);
              return (
                <Card key={day} sx={{ bgcolor: d.off ? 'rgba(13,38,24,0.4)' : 'rgba(13,38,24,0.7)', border: `1px solid ${d.off ? 'rgba(148,204,171,0.06)' : night ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 3, opacity: d.off ? 0.6 : 1 }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {/* Day label */}
                      <Box sx={{ width: 100, flexShrink: 0 }}>
                        <Typography fontWeight={800} sx={{ color: D.text1, fontSize: '0.95rem' }}>{day}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3 }}>
                          {night && !d.off && <Chip label="Night" size="small" icon={<NightlightIcon sx={{ fontSize: '10px !important' }} />} sx={{ bgcolor: 'rgba(139,92,246,0.2)', color: '#c4b5fd', fontSize: '0.6rem', height: 18 }} />}
                          {long && !d.off && <Chip label="Long" size="small" icon={<AccessTimeIcon sx={{ fontSize: '10px !important' }} />} sx={{ bgcolor: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontSize: '0.6rem', height: 18 }} />}
                          {d.off && <Chip label="Day Off" size="small" sx={{ bgcolor: 'rgba(148,204,171,0.08)', color: D.text3, fontSize: '0.6rem', height: 18 }} />}
                        </Box>
                      </Box>

                      {/* Off toggle */}
                      <FormControlLabel
                        control={<Switch checked={!d.off} onChange={e => updateDay(day, 'off', !e.target.checked)} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: D.text2 }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: D.bg3 } }} />}
                        label={<Typography sx={{ color: D.text3, fontSize: '0.78rem' }}>Working</Typography>}
                        sx={{ mx: 0 }}
                      />

                      {!d.off && (
                        <>
                          <TextField size="small" label="Start" type="time" value={d.start}
                            onChange={e => updateDay(day, 'start', e.target.value)}
                            InputLabelProps={{ shrink: true }} sx={{ ...inputSx, width: 130 }} />
                          <TextField size="small" label="End" type="time" value={d.end}
                            onChange={e => updateDay(day, 'end', e.target.value)}
                            InputLabelProps={{ shrink: true }} sx={{ ...inputSx, width: 130 }} />
                          <TextField size="small" label="Break (min)" type="number" value={d.break}
                            onChange={e => updateDay(day, 'break', parseInt(e.target.value) || 0)}
                            sx={{ ...inputSx, width: 110 }} />
                          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                            <Typography sx={{ fontWeight: 800, color: night ? '#c4b5fd' : D.text2, fontSize: '1rem' }}>{fmtHrs(hrs)}</Typography>
                            {wage > 0 && <Typography sx={{ color: D.text3, fontSize: '0.72rem' }}>${fmt(hrs * wage)}</Typography>}
                          </Box>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Week summary */}
          <Card sx={{ mt: 3, bgcolor: 'rgba(45,106,79,0.15)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>📊 This Week Summary</Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box><Typography sx={{ color: D.text3, fontSize: '0.75rem' }}>TOTAL</Typography><Typography sx={{ color: D.text2, fontWeight: 800, fontSize: '1.1rem' }}>{fmtHrs(week.total)}</Typography></Box>
                <Box><Typography sx={{ color: D.text3, fontSize: '0.75rem' }}>DAY SHIFTS</Typography><Typography sx={{ color: D.text1, fontWeight: 700 }}>{fmtHrs(week.dayHrs)}</Typography></Box>
                <Box><Typography sx={{ color: D.text3, fontSize: '0.75rem' }}>NIGHT SHIFTS</Typography><Typography sx={{ color: '#c4b5fd', fontWeight: 700 }}>{fmtHrs(week.nightHrs)}</Typography></Box>
                <Box><Typography sx={{ color: D.text3, fontSize: '0.75rem' }}>LONG SHIFTS</Typography><Typography sx={{ color: '#fbbf24', fontWeight: 700 }}>{week.longShifts} shift{week.longShifts !== 1 ? 's' : ''}</Typography></Box>
                <Box><Typography sx={{ color: D.text3, fontSize: '0.75rem' }}>OVERTIME</Typography><Typography sx={{ color: week.overtime > 0 ? '#f59e0b' : D.text3, fontWeight: 700 }}>{week.overtime > 0 ? fmtHrs(week.overtime) : 'None'}</Typography></Box>
                <Box><Typography sx={{ color: D.text3, fontSize: '0.75rem' }}>DAYS WORKED</Typography><Typography sx={{ color: D.text1, fontWeight: 700 }}>{week.days.filter(d => !d.off).length} / 7</Typography></Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ── TAB 1: EXPENSES ── */}
      {tab === 1 && (
        <Box>
          {/* Add expense */}
          <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>Add Expense</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <TextField select label="Category" value={newExp.category}
                  onChange={e => setNewExp(n => ({ ...n, category: e.target.value }))}
                  SelectProps={{ native: true }} sx={{ ...inputSx, minWidth: 160 }}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{EXPENSE_ICONS[c]} {c}</option>)}
                </TextField>
                <TextField label="Amount ($)" type="number" value={newExp.amount}
                  onChange={e => setNewExp(n => ({ ...n, amount: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }}
                  sx={{ ...inputSx, width: 150 }} />
                <TextField label="Note (optional)" value={newExp.note}
                  onChange={e => setNewExp(n => ({ ...n, note: e.target.value }))}
                  placeholder="e.g. Weekly gas fill-up"
                  sx={{ ...inputSx, flex: 1, minWidth: 180 }} />
                <Button variant="contained" startIcon={<AddIcon />} onClick={addExpense}
                  disabled={!newExp.amount}
                  sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, fontWeight: 700, py: 1.8 }}>
                  Add
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Expense list */}
          <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2.5, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight={700} sx={{ color: D.text1 }}>Weekly Expenses ({expenses.length})</Typography>
                {expenses.length > 0 && <Button size="small" onClick={() => setExpenses([])} sx={{ color: '#f87171', fontSize: '0.75rem' }}>Clear All</Button>}
              </Box>
              {expenses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}><Typography sx={{ color: D.text3 }}>No expenses yet. Add gas, food, bills, etc.</Typography></Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {expenses.map((exp, i) => (
                    <React.Fragment key={exp.id}>
                      {i > 0 && <Divider sx={{ borderColor: 'rgba(148,204,171,0.06)' }} />}
                      <ListItem sx={{ px: 2.5, py: 1.2 }} secondaryAction={
                        <IconButton onClick={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))} size="small" sx={{ color: 'rgba(232,245,238,0.2)', '&:hover': { color: '#ef4444' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                          <Typography sx={{ fontSize: '1.3rem' }}>{EXPENSE_ICONS[exp.category] || '📦'}</Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={600} sx={{ color: D.text1, fontSize: '0.9rem' }}>{exp.category}</Typography>
                            {exp.note && <Typography variant="caption" sx={{ color: D.text3 }}>{exp.note}</Typography>}
                          </Box>
                          <Typography fontWeight={800} sx={{ color: '#f87171', mr: 4 }}>-${fmt(exp.amount)}</Typography>
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          {/* Expense breakdown */}
          {expenses.length > 0 && (
            <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>Breakdown</Typography>
                {EXPENSE_CATEGORIES.filter(c => expenses.some(e => e.category === c)).map(cat => {
                  const amt = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
                  const pct = pay.net > 0 ? (amt / pay.net) * 100 : 0;
                  return (
                    <Box key={cat} sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                        <Typography sx={{ color: D.text3, fontSize: '0.83rem' }}>{EXPENSE_ICONS[cat]} {cat}</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography sx={{ color: D.text1, fontWeight: 700, fontSize: '0.85rem' }}>${fmt(amt)}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.20)', fontSize: '0.78rem' }}>{pct.toFixed(1)}%</Typography>
                        </Box>
                      </Box>
                      <LinearProgress variant="determinate" value={Math.min(pct * 2, 100)} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(148,204,171,0.08)', '& .MuiLinearProgress-bar': { bgcolor: cat === 'Savings' ? D.bg4 : '#ef4444', borderRadius: 2 } }} />
                    </Box>
                  );
                })}
                <Divider sx={{ my: 2, borderColor: 'rgba(148,204,171,0.1)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontWeight={700} sx={{ color: D.text1 }}>Total Expenses</Typography>
                  <Typography fontWeight={800} sx={{ color: '#f87171', fontSize: '1.1rem' }}>${fmt(totalExpenses)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography fontWeight={700} sx={{ color: D.text1 }}>Remaining</Typography>
                  <Typography fontWeight={800} sx={{ color: remaining >= 0 ? D.bg4 : '#ef4444', fontSize: '1.1rem' }}>{remaining >= 0 ? '+' : ''}${fmt(remaining)}</Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Savings goal */}
          <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>🎯 Savings Goal</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <TextField size="small" label="Goal ($)" type="number" value={savings.goalInput}
                  onChange={e => setSavings(s => ({ ...s, goalInput: e.target.value }))}
                  onBlur={() => setSavings(s => ({ ...s, goal: parseFloat(s.goalInput) || s.goal }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }}
                  sx={{ ...inputSx, width: 160 }} />
                <TextField size="small" label="Saved So Far ($)" type="number" value={savings.currentInput}
                  onChange={e => setSavings(s => ({ ...s, currentInput: e.target.value }))}
                  onBlur={() => setSavings(s => ({ ...s, current: parseFloat(s.currentInput) || s.current }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }}
                  sx={{ ...inputSx, width: 180 }} />
              </Box>
              {savings.goal > 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: D.text3, fontSize: '0.82rem' }}>Progress</Typography>
                    <Typography sx={{ color: D.text2, fontWeight: 700, fontSize: '0.85rem' }}>${savings.current.toLocaleString()} / ${savings.goal.toLocaleString()}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Math.min((savings.current / savings.goal) * 100, 100)}
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(148,204,171,0.08)', '& .MuiLinearProgress-bar': { bgcolor: D.bg4, borderRadius: 4 } }} />
                  <Typography sx={{ color: D.text3, fontSize: '0.75rem', mt: 0.5 }}>
                    {((savings.current / savings.goal) * 100).toFixed(1)}% complete · ${Math.max(0, savings.goal - savings.current).toLocaleString()} to go
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ── TAB 2: PAY DETAILS ── */}
      {tab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {wage === 0 && (
            <Alert severity="warning" sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
              ⚠️ Set your hourly wage above to see pay estimates.
            </Alert>
          )}

          {/* Pay breakdown */}
          <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>💵 Pay Breakdown</Typography>
              {[
                { label: 'Regular Hours', value: fmtHrs(week.regularHrs), sub: `${week.regularHrs.toFixed(1)} hrs × $${wage}/hr`, amount: week.regularHrs * wage, color: D.text1 },
                { label: 'Overtime Hours', value: fmtHrs(week.overtime), sub: `${week.overtime.toFixed(1)} hrs × $${(wage * 1.5).toFixed(2)}/hr (1.5x)`, amount: week.overtime * wage * 1.5, color: '#f59e0b' },
                { label: 'Gross Weekly Pay', value: `$${fmt(pay.gross)}`, sub: 'Before taxes', amount: null, color: D.bg4, bold: true },
                { label: `Est. Tax (~${(pay.taxRate * 100).toFixed(0)}%)`, value: `-$${fmt(pay.estimatedTax)}`, sub: 'Approximate withholding', amount: null, color: '#f87171' },
                { label: 'Est. Take-Home', value: `$${fmt(pay.net)}`, sub: 'After estimated taxes', amount: null, color: D.text2, bold: true },
              ].map((row, i) => (
                <Box key={i}>
                  {i > 0 && <Divider sx={{ my: 1.5, borderColor: 'rgba(148,204,171,0.08)' }} />}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ color: row.bold ? D.text1 : D.text3, fontWeight: row.bold ? 700 : 400, fontSize: '0.88rem' }}>{row.label}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.20)', fontSize: '0.72rem' }}>{row.sub}</Typography>
                    </Box>
                    <Typography sx={{ color: row.color, fontWeight: row.bold ? 800 : 600, fontSize: row.bold ? '1.1rem' : '0.95rem' }}>{row.value}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Projections */}
          <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>📈 Pay Projections</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
                {[
                  { label: 'Weekly', gross: pay.gross, net: pay.net },
                  { label: 'Biweekly', gross: pay.biweekly, net: pay.net * 2 },
                  { label: 'Monthly (×4.33)', gross: pay.monthly, net: pay.net * 4.33 },
                ].map(p => (
                  <Box key={p.label} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(71,133,89,0.08)', border: '1px solid rgba(148,204,171,0.08)', textAlign: 'center' }}>
                    <Typography sx={{ color: D.text3, fontSize: '0.72rem', mb: 1 }}>{p.label}</Typography>
                    <Typography sx={{ color: D.bg4, fontWeight: 800, fontSize: '1.1rem' }}>${Math.round(p.gross).toLocaleString()}</Typography>
                    <Typography sx={{ color: D.text3, fontSize: '0.7rem' }}>gross</Typography>
                    <Typography sx={{ color: D.text2, fontWeight: 700, mt: 0.5 }}>${Math.round(p.net).toLocaleString()}</Typography>
                    <Typography sx={{ color: D.text3, fontSize: '0.7rem' }}>take-home</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Shift summary */}
          <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>🗓 Shift Details</Typography>
              {week.days.filter(d => !d.off).map(d => (
                <Box key={d.day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid rgba(148,204,171,0.06)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {d.night ? <NightlightIcon sx={{ color: '#c4b5fd', fontSize: 16 }} /> : <WbSunnyIcon sx={{ color: '#fbbf24', fontSize: 16 }} />}
                    <Box>
                      <Typography sx={{ color: D.text1, fontWeight: 600, fontSize: '0.88rem' }}>{d.day}</Typography>
                      <Typography sx={{ color: D.text3, fontSize: '0.72rem' }}>{d.start} – {d.end}{d.break > 0 ? ` (${d.break}m break)` : ''}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: d.night ? '#c4b5fd' : D.text2, fontWeight: 700 }}>{fmtHrs(d.hours)}</Typography>
                    {wage > 0 && <Typography sx={{ color: D.text3, fontSize: '0.72rem' }}>${fmt(d.hours * wage)}</Typography>}
                  </Box>
                </Box>
              ))}
              {week.days.filter(d => !d.off).length === 0 && <Typography sx={{ color: D.text3, textAlign: 'center', py: 2 }}>No shifts this week</Typography>}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ── TAB 3: WEEKLY REVIEW ── */}
      {tab === 3 && (
        <Box>
          <WeeklyReview week={week} pay={pay} expenses={expenses} wage={wage} savings={savings} />
          <Card sx={{ mt: 3, bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(148,204,171,0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>📝 Save This Week</Typography>
              <TextField fullWidth multiline rows={2} placeholder="Any notes about this week? (missed hours, unusual shifts, etc.)"
                value={weekNote} onChange={e => setWeekNote(e.target.value)} sx={{ ...inputSx, mb: 2 }} />
              <Button variant="contained" startIcon={<SaveIcon />} onClick={saveWeek}
                sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, fontWeight: 700 }}>
                Save Week to History
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ── TAB 4: HISTORY ── */}
      {tab === 4 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ color: D.text3, fontSize: '0.82rem' }}>Up to 24 saved weeks</Typography>
            <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setAddingPast(v => !v)}
              sx={{ borderColor: D.text3, color: D.text3, '&:hover': { borderColor: D.text2, color: D.text2 }, textTransform: 'none', fontWeight: 600 }}>
              Add Previous Week
            </Button>
          </Box>

          {savedAlert && (
            <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(45,106,79,0.2)', color: D.text2, border: '1px solid rgba(255,255,255,0.18)' }}>
              {savedAlert}
            </Alert>
          )}

          {/* Add past week form */}
          {addingPast && (
            <Card sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>📅 Add Previous Week</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <TextField size="small" label="Week Date" type="date" value={pastEntry.date}
                    onChange={e => setPastEntry(p => ({ ...p, date: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ ...inputSx, width: 160 }} />
                  <TextField size="small" label="Total Hours" type="number" placeholder="e.g. 36.5"
                    value={pastEntry.hours}
                    onChange={e => setPastEntry(p => ({ ...p, hours: e.target.value }))}
                    sx={{ ...inputSx, width: 140 }} />
                  <TextField size="small" label="Gross Pay ($)" type="number" placeholder="optional"
                    value={pastEntry.gross}
                    onChange={e => setPastEntry(p => ({ ...p, gross: e.target.value }))}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }}
                    sx={{ ...inputSx, width: 160 }} />
                  <TextField size="small" label="Note (optional)" value={pastEntry.note}
                    onChange={e => setPastEntry(p => ({ ...p, note: e.target.value }))}
                    placeholder="e.g. Short week, vacation"
                    sx={{ ...inputSx, flex: 1, minWidth: 180 }} />
                  <Button variant="contained" startIcon={<SaveIcon />} onClick={addPastWeek}
                    disabled={!pastEntry.date || !pastEntry.hours}
                    sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, fontWeight: 700, py: 1 }}>
                    Add
                  </Button>
                  <Button onClick={() => setAddingPast(false)} sx={{ color: D.text3, textTransform: 'none' }}>Cancel</Button>
                </Box>
                <Typography sx={{ color: D.text3, fontSize: '0.75rem', mt: 1 }}>
                  💡 If gross pay is left blank, it'll be calculated from your hours × current wage.
                </Typography>
              </CardContent>
            </Card>
          )}

          {weekHistory.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography sx={{ color: D.text3 }}>No history yet. Save a week from the Schedule tab or add a previous week above.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {weekHistory.map((w, i) => (
                <Card key={w.id} sx={{ bgcolor: 'rgba(13,38,24,0.7)', border: `1px solid ${w.isPast ? 'rgba(59,130,246,0.2)' : 'rgba(148,204,171,0.1)'}`, borderRadius: 3 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight={700} sx={{ color: D.text1 }}>Week of {w.date}</Typography>
                          {w.isPast && <Chip label="Past" size="small" sx={{ bgcolor: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontSize: '0.65rem', height: 18 }} />}
                        </Box>
                        {w.note && <Typography sx={{ color: D.text3, fontSize: '0.8rem', mt: 0.3 }}>📝 {w.note}</Typography>}
                      </Box>
                      <IconButton size="small" onClick={() => setWeekHistory(prev => prev.filter((_, j) => j !== i))} sx={{ color: 'rgba(232,245,238,0.2)', '&:hover': { color: '#ef4444' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box><Typography sx={{ color: D.text3, fontSize: '0.7rem' }}>HOURS</Typography><Typography sx={{ color: D.text2, fontWeight: 700 }}>{fmtHrs(w.totalHours)}</Typography></Box>
                      <Box><Typography sx={{ color: D.text3, fontSize: '0.7rem' }}>GROSS</Typography><Typography sx={{ color: D.bg4, fontWeight: 700 }}>${fmt(w.gross)}</Typography></Box>
                      <Box><Typography sx={{ color: D.text3, fontSize: '0.7rem' }}>TAKE-HOME</Typography><Typography sx={{ color: D.text1, fontWeight: 700 }}>${fmt(w.net)}</Typography></Box>
                      <Box><Typography sx={{ color: D.text3, fontSize: '0.7rem' }}>EXPENSES</Typography><Typography sx={{ color: '#f87171', fontWeight: 700 }}>${fmt(w.expenses)}</Typography></Box>
                      <Box><Typography sx={{ color: D.text3, fontSize: '0.7rem' }}>REMAINING</Typography><Typography sx={{ color: w.remaining >= 0 ? D.bg4 : '#ef4444', fontWeight: 700 }}>{w.remaining >= 0 ? '+' : ''}${fmt(w.remaining)}</Typography></Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}

/* ── Entry ──────────────────────────────────────────────── */
export default function Financial() {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  if (!unlocked) return <PinLock onUnlock={p => { setPin(p); setUnlocked(true); }} />;
  return <WorkTracker pin={pin} username={user?.username || 'user'} />;
}
