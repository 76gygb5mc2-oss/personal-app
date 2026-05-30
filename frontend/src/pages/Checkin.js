import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField,
  Button, Chip, Divider, Tab, Tabs, Alert, IconButton,
  LinearProgress, InputAdornment, CircularProgress, List, ListItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../context/AuthContext';
import CryptoJS from 'crypto-js';
import { D, FONTS } from '../theme';

/* ── Encryption ─────────────────────────────────────────── */
const STORAGE_KEY = 'swpg_debt_v1';
const getKey = (pin, user) => CryptoJS.SHA256(`${user}:${pin}:swpg-debt-2024`).toString();
const saveFn = (data, key) => localStorage.setItem(STORAGE_KEY, CryptoJS.AES.encrypt(JSON.stringify(data), key).toString());
const loadFn = (key) => {
  try {
    const e = localStorage.getItem(STORAGE_KEY);
    if (!e) return null;
    const b = CryptoJS.AES.decrypt(e, key);
    const s = b.toString(CryptoJS.enc.Utf8);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

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
      <Box sx={{
        p: 5, borderRadius: 5, textAlign: 'center', maxWidth: 340, width: '100%', mx: 3,
        bgcolor: 'rgba(14,14,14,0.98)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        animation: shake ? 'shake 0.5s ease' : 'none',
        '@keyframes shake': { '0%,100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-10px)' }, '40%': { transform: 'translateX(10px)' }, '60%': { transform: 'translateX(-8px)' }, '80%': { transform: 'translateX(8px)' } }
      }}>
        <Box sx={{ width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2.5, background: `linear-gradient(135deg, ${D.bg3} 0%, ${D.bg0} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px rgba(71,133,89,0.4)`, border: '1px solid rgba(255,255,255,0.12)' }}>
          {locked ? <ShieldIcon sx={{ color: '#f87171', fontSize: 30 }} /> : <LockIcon sx={{ color: D.text2, fontSize: 30 }} />}
        </Box>
        <Typography variant="h5" fontWeight={800} sx={{ color: D.text1, mb: 0.5 }}>Debt Dashboard</Typography>
        <Typography sx={{ color: D.text3, fontSize: '0.85rem', mb: 3.5 }}>{locked ? `Locked — ${timer}s` : 'Enter your 4-digit PIN'}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          {[0,1,2,3].map(i => <Box key={i} sx={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${pin.length > i ? D.text2 : 'rgba(255,255,255,0.18)'}`, bgcolor: pin.length > i ? D.text2 : 'transparent', transition: 'all 0.15s', boxShadow: pin.length > i ? `0 0 8px ${D.text2}` : 'none' }} />)}
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2.5, bgcolor: 'rgba(100,20,20,0.5)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)', fontSize: '0.82rem', py: 0.5 }}>{error}</Alert>}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1.2 }}>
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
            <Box key={i} onClick={() => { if (k === '') return; if (k === '⌫') setPin(p => p.slice(0,-1)); else addDigit(String(k)); }}
              sx={{ py: 1.8, borderRadius: 2.5, textAlign: 'center', cursor: k === '' || locked ? 'default' : 'pointer', bgcolor: k === '' ? 'transparent' : 'rgba(255,255,255,0.04)', border: `1px solid ${k === '' ? 'transparent' : 'rgba(255,255,255,0.10)'}`, color: D.text1, fontWeight: 700, fontSize: '1.2rem', opacity: locked && k !== '' ? 0.4 : 1, transition: 'all 0.15s', '&:hover': k !== '' && !locked ? { bgcolor: 'rgba(71,133,89,0.25)', transform: 'scale(1.05)' } : {}, userSelect: 'none' }}>{k}</Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */
const DEBT_TYPES = ['Credit Card', 'Student Loan', 'Auto Loan', 'Personal Loan', 'Medical', 'Mortgage', 'Collection', 'Other'];
const DEBT_ICONS = { 'Credit Card': '💳', 'Student Loan': '🎓', 'Auto Loan': '🚗', 'Personal Loan': '💵', 'Medical': '🏥', 'Mortgage': '🏠', 'Collection': '⚠️', 'Other': '📋' };
const STATUS_COLORS = { 'Current': D.bg4, 'Late 30': 'rgba(255,255,255,0.6)', 'Late 60': '#fb923c', 'Late 90+': '#ef4444', 'Collection': '#dc2626', 'Charge-off': '#7f1d1d', 'Paid Off': D.text2 };
const BUREAUS = ['Experian', 'Equifax', 'TransUnion'];
const BUREAU_COLORS = { Experian: '#3b82f6', Equifax: '#ef4444', TransUnion: '#8b5cf6' };

const scoreLabel = (s) => {
  if (s >= 800) return { label: 'Exceptional', color: '#22c55e' };
  if (s >= 740) return { label: 'Very Good', color: D.bg4 };
  if (s >= 670) return { label: 'Good', color: '#84cc16' };
  if (s >= 580) return { label: 'Fair', color: 'rgba(255,255,255,0.6)' };
  return { label: 'Poor', color: '#ef4444' };
};

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── AI Analyzer ─────────────────────────────────────────── */
function DebtAI({ debts, creditScores, creditReport }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const totalDebt = debts.reduce((s, d) => s + Number(d.balance || 0), 0);
      const totalLimit = debts.filter(d => d.type === 'Credit Card').reduce((s, d) => s + Number(d.limit || 0), 0);
      const totalCardBal = debts.filter(d => d.type === 'Credit Card').reduce((s, d) => s + Number(d.balance || 0), 0);
      const utilization = totalLimit > 0 ? (totalCardBal / totalLimit) * 100 : 0;
      const minPayments = debts.reduce((s, d) => s + Number(d.minPayment || 0), 0);
      const collections = debts.filter(d => d.status === 'Collection' || d.status === 'Charge-off');
      const lateDebts = debts.filter(d => d.status.includes('Late'));
      const avgScore = creditScores.filter(s => s.score > 0).reduce((sum, s, _, a) => sum + s.score / a.length, 0);

      const alerts = [];
      const recommendations = [];

      // Collections
      if (collections.length > 0) {
        alerts.push({ level: 'critical', icon: '🚨', text: `${collections.length} account(s) in collections/charge-off. This severely damages credit. Address immediately.` });
        recommendations.push({ icon: '⚡', text: `Pay or settle collections ASAP. A paid collection is better than unpaid. Consider a "pay for delete" letter.` });
      }

      // Late payments
      if (lateDebts.length > 0) {
        alerts.push({ level: 'high', icon: '⚠️', text: `${lateDebts.length} account(s) with late payments. Each late payment can drop score 50–100 pts.` });
        recommendations.push({ icon: '📅', text: `Set up auto-pay for minimum payments to stop further late marks.` });
      }

      // Utilization
      if (utilization > 30) {
        alerts.push({ level: utilization > 50 ? 'critical' : 'high', icon: '📊', text: `Credit utilization is ${utilization.toFixed(1)}% — ${utilization > 50 ? 'dangerously high' : 'above 30% threshold'}. Aim for under 10% for best score.` });
        recommendations.push({ icon: '💳', text: `Pay down card balances. Getting from ${utilization.toFixed(0)}% to 10% could add 50–100+ points to your score.` });
      } else if (utilization > 0) {
        alerts.push({ level: 'ok', icon: '✅', text: `Utilization at ${utilization.toFixed(1)}% — healthy range.` });
      }

      // Credit score
      if (avgScore > 0) {
        const sl = scoreLabel(avgScore);
        if (avgScore < 580) recommendations.push({ icon: '🔴', text: `Score ${Math.round(avgScore)} (${sl.label}) limits loan options and raises interest rates. Focus on: paying collections, reducing utilization, on-time payments.` });
        else if (avgScore < 670) recommendations.push({ icon: '🟡', text: `Score ${Math.round(avgScore)} (${sl.label}). You can improve to Good/Very Good in 6–12 months with consistent on-time payments and lower utilization.` });
        else recommendations.push({ icon: '🟢', text: `Score ${Math.round(avgScore)} (${sl.label}). Maintain on-time payments and low utilization to protect your score.` });
      }

      // Debt avalanche
      const sorted = [...debts].filter(d => d.balance > 0 && d.apr > 0).sort((a, b) => Number(b.apr) - Number(a.apr));
      if (sorted.length > 1) {
        recommendations.push({ icon: '🏔️', text: `Debt Avalanche: Pay minimums on all, then throw extra money at "${sorted[0].name}" (${sorted[0].apr}% APR). Saves most interest.` });
      }

      // Upcoming dues
      const today = new Date();
      const upcomingDue = debts.filter(d => {
        if (!d.dueDate) return false;
        const due = new Date(d.dueDate);
        const diff = (due - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      });
      if (upcomingDue.length > 0) {
        alerts.push({ level: 'high', icon: '📅', text: `${upcomingDue.length} payment(s) due within 7 days: ${upcomingDue.map(d => d.name).join(', ')}` });
      }

      // Credit report flags
      const flags = creditReport.filter(r => r.flagged);
      if (flags.length > 0) {
        alerts.push({ level: 'high', icon: '🔍', text: `${flags.length} item(s) flagged on credit report needing attention.` });
      }

      setAnalysis({ totalDebt, utilization, minPayments, collections: collections.length, lateDebts: lateDebts.length, avgScore, alerts, recommendations });
      setLoading(false);
    }, 600);
  }, [debts, creditScores, creditReport]);

  useEffect(() => { analyze(); }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SmartToyIcon sx={{ color: D.text2, fontSize: 26 }} />
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.text1 }}>AI Debt Analyst</Typography>
            <Typography sx={{ color: D.text3, fontSize: '0.78rem' }}>Full credit & debt risk analysis</Typography>
          </Box>
        </Box>
        <Button onClick={analyze} size="small" variant="outlined"
          startIcon={loading ? <CircularProgress size={14} sx={{ color: D.text2 }} /> : <SmartToyIcon />}
          sx={{ borderColor: 'rgba(255,255,255,0.18)', color: D.text2, fontWeight: 700 }}>
          {loading ? 'Analyzing...' : 'Re-analyze'}
        </Button>
      </Box>

      {loading && !analysis && <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress sx={{ color: D.text2 }} /></Box>}

      {analysis && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Summary metrics */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 1.5 }}>
            {[
              { label: 'Total Debt', value: `$${fmt(analysis.totalDebt)}`, color: '#ef4444', icon: '💸' },
              { label: 'Min. Payments/mo', value: `$${fmt(analysis.minPayments)}`, color: 'rgba(255,255,255,0.6)', icon: '📅' },
              { label: 'Card Utilization', value: `${analysis.utilization.toFixed(1)}%`, color: analysis.utilization > 30 ? '#ef4444' : D.bg4, icon: '📊' },
              { label: 'Avg Credit Score', value: analysis.avgScore > 0 ? Math.round(analysis.avgScore) : 'N/A', color: analysis.avgScore > 0 ? scoreLabel(analysis.avgScore).color : D.text3, icon: '⭐' },
            ].map(m => (
              <Box key={m.label} sx={{ p: 2, borderRadius: 3, bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.3rem', mb: 0.3 }}>{m.icon}</Typography>
                <Typography sx={{ color: D.text3, fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: 1 }}>{m.label}</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: m.color, mt: 0.3 }}>{m.value}</Typography>
              </Box>
            ))}
          </Box>

          {/* Risk alerts */}
          {analysis.alerts.length > 0 && (
            <Card sx={{ bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>🚨 Risk Alerts</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  {analysis.alerts.map((a, i) => (
                    <Box key={i} sx={{
                      p: 1.8, borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start',
                      bgcolor: a.level === 'critical' ? 'rgba(239,68,68,0.1)' : a.level === 'high' ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${a.level === 'critical' ? 'rgba(239,68,68,0.25)' : a.level === 'high' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      <Typography sx={{ fontSize: '1rem', flexShrink: 0 }}>{a.icon}</Typography>
                      <Typography sx={{ color: D.text1, fontSize: '0.83rem', lineHeight: 1.5 }}>{a.text}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <Card sx={{ bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>💡 Recommendations</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  {analysis.recommendations.map((r, i) => (
                    <Box key={i} sx={{ p: 1.8, borderRadius: 2, display: 'flex', gap: 1.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Typography sx={{ fontSize: '1rem', flexShrink: 0 }}>{r.icon}</Typography>
                      <Typography sx={{ color: D.text1, fontSize: '0.83rem', lineHeight: 1.5 }}>{r.text}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
}

/* ── Main Dashboard ──────────────────────────────────────── */
function DebtDashboard({ pin, username }) {
  const encKey = getKey(pin, username);
  const [tab, setTab] = useState(0);

  const DEFAULT_DEBTS = [
    { id: 1, name: 'Sunrise Credit / Spectrum', type: 'Collection', balance: 252, limit: '', apr: '', minPayment: 252, dueDate: '', status: 'Collection', note: 'Original: Charter $117 → grew to $252. Phase 1 — call (800) 645-9824, offer $150 pay-for-delete.' },
    { id: 2, name: 'Credit Collection Serv / Progressive', type: 'Collection', balance: 226, limit: '', apr: '', minPayment: 226, dueDate: '', status: 'Collection', note: 'Phase 1 — call (617) 965-2000, offer $150 pay-for-delete.' },
    { id: 3, name: 'Kikoff Lending LLC', type: 'Credit Card', balance: 385, limit: 3500, apr: '', minPayment: 210, dueDate: '', status: 'Charge-off', note: 'Charged off May 2025. Phase 2 — email support@kikoff.com, offer $200 settlement + delete.' },
    { id: 4, name: 'Discover Card', type: 'Credit Card', balance: 742, limit: 500, apr: '', minPayment: 742, dueDate: '', status: 'Charge-off', note: 'Charged off Oct 2023. Phase 3 — call (800) 347-2683, offer $370 settlement.' },
    { id: 5, name: 'American Express', type: 'Credit Card', balance: 4323, limit: 2500, apr: '', minPayment: 4323, dueDate: '', status: 'Charge-off', note: 'Charged off Sep 2023. Phase 4 — call (800) 874-2717, offer $1,729 (40%). Biggest priority.' },
  ];
  const [debts, setDebts] = useState([]);
  const [creditScores, setCreditScores] = useState([
    { bureau: 'Experian', score: 0, date: '', trend: 0 },
    { bureau: 'Equifax', score: 0, date: '', trend: 0 },
    { bureau: 'TransUnion', score: 0, date: '', trend: 0 },
  ]);
  const [creditReport, setCreditReport] = useState([]);
  const [newDebt, setNewDebt] = useState({ name: '', type: 'Credit Card', balance: '', limit: '', apr: '', minPayment: '', dueDate: '', status: 'Current', note: '' });
  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState({ bureau: 'Experian', type: 'Collection', description: '', date: '', amount: '', flagged: true });

  // Load
  useEffect(() => {
    const d = loadFn(encKey);
    if (d) {
      if (d.debts && d.debts.length > 0) setDebts(d.debts);
      else setDebts(DEFAULT_DEBTS);
      if (d.creditScores) setCreditScores(d.creditScores);
      if (d.creditReport) setCreditReport(d.creditReport);
    } else {
      // First time — load Foxy's real debts
      setDebts(DEFAULT_DEBTS);
    }
  }, [encKey]);

  // Save
  useEffect(() => {
    saveFn({ debts, creditScores, creditReport }, encKey);
  }, [debts, creditScores, creditReport, encKey]);

  const totalDebt = debts.reduce((s, d) => s + Number(d.balance || 0), 0);
  const totalMin = debts.reduce((s, d) => s + Number(d.minPayment || 0), 0);
  const totalLimit = debts.filter(d => d.type === 'Credit Card').reduce((s, d) => s + Number(d.limit || 0), 0);
  const totalCardBal = debts.filter(d => d.type === 'Credit Card').reduce((s, d) => s + Number(d.balance || 0), 0);
  const utilization = totalLimit > 0 ? (totalCardBal / totalLimit) * 100 : 0;
  const avgScore = creditScores.filter(s => s.score > 0).reduce((sum, s, _, a) => sum + s.score / a.length, 0);

  const addDebt = () => {
    if (!newDebt.name || !newDebt.balance) return;
    if (editingId) {
      setDebts(prev => prev.map(d => d.id === editingId ? { ...d, ...newDebt, balance: Number(newDebt.balance), id: editingId } : d));
      setEditingId(null);
    } else {
      setDebts(prev => [...prev, { ...newDebt, id: Date.now(), balance: Number(newDebt.balance) }]);
    }
    setNewDebt({ name: '', type: 'Credit Card', balance: '', limit: '', apr: '', minPayment: '', dueDate: '', status: 'Current', note: '' });
  };

  const startEdit = (d) => { setNewDebt({ ...d }); setEditingId(d.id); setTab(1); };

  const inputSx = {
    '& .MuiOutlinedInput-root': { bgcolor: D.bg2, color: D.text1, '& fieldset': { borderColor: 'rgba(255,255,255,0.10)' }, '&:hover fieldset': { borderColor: D.text2 }, '&.Mui-focused fieldset': { borderColor: D.text2, borderWidth: 2 } },
    '& .MuiInputLabel-root': { color: D.text3 },
    '& .MuiInputLabel-root.Mui-focused': { color: D.text2 },
    '& .MuiInputBase-input': { color: D.text1 },
    '& .MuiSelect-icon': { color: D.text3 },
  };

  // Days until due
  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    return diff;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: D.text1 }}>💳 Debt Dashboard</Typography>
          <Chip icon={<LockIcon sx={{ fontSize: '14px !important' }} />} label="PIN Protected" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: D.text2, border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.7rem' }} />
        </Box>
        <Typography variant="body2" sx={{ color: D.text3 }}>Track debts, credit scores & collections</Typography>
      </Box>

      {/* Summary bar */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Total Debt', value: `$${fmt(totalDebt)}`, color: totalDebt > 0 ? '#ef4444' : D.bg4, icon: '💸' },
          { label: 'Monthly Minimums', value: `$${fmt(totalMin)}`, color: 'rgba(255,255,255,0.6)', icon: '📅' },
          { label: 'Card Utilization', value: `${utilization.toFixed(1)}%`, color: utilization > 30 ? '#ef4444' : D.bg4, icon: '📊' },
          { label: 'Avg Credit Score', value: avgScore > 0 ? `${Math.round(avgScore)} ${scoreLabel(avgScore).label}` : 'Not set', color: avgScore > 0 ? scoreLabel(avgScore).color : D.text3, icon: '⭐' },
        ].map(m => (
          <Box key={m.label} sx={{ p: 2.5, borderRadius: 3, bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography sx={{ fontSize: '1.1rem' }}>{m.icon}</Typography>
              <Typography sx={{ color: D.text3, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 1 }}>{m.label}</Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: m.color }}>{m.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3, '& .MuiTabs-indicator': { bgcolor: D.text2 } }}>
        {['🤖 AI Analysis', '➕ Manage Debts', '📋 Active Debts', '⭐ Credit Scores', '🔍 Credit Report', '🗓 Payoff Plan'].map((label, i) => (
          <Tab key={i} label={label} sx={{ color: D.text3, '&.Mui-selected': { color: D.text2 }, textTransform: 'none', fontWeight: 600 }} />
        ))}
      </Tabs>

      {/* ── TAB 0: AI ── */}
      {tab === 0 && <DebtAI debts={debts} creditScores={creditScores} creditReport={creditReport} />}

      {/* ── TAB 1: ADD/EDIT DEBT ── */}
      {tab === 1 && (
        <Card sx={{ bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography fontWeight={700} sx={{ color: D.text1, mb: 2.5 }}>{editingId ? '✏️ Edit Debt' : '➕ Add Debt'}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField label="Debt Name" placeholder="e.g. Chase Sapphire, Sallie Mae..." value={newDebt.name} onChange={e => setNewDebt(n => ({ ...n, name: e.target.value }))} sx={{ ...inputSx, flex: 1, minWidth: 200 }} />
                <TextField select label="Type" value={newDebt.type} onChange={e => setNewDebt(n => ({ ...n, type: e.target.value }))} SelectProps={{ native: true }} sx={{ ...inputSx, width: 160 }}>
                  {DEBT_TYPES.map(t => <option key={t} value={t}>{DEBT_ICONS[t]} {t}</option>)}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField label="Balance ($)" type="number" value={newDebt.balance} onChange={e => setNewDebt(n => ({ ...n, balance: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }} sx={{ ...inputSx, flex: 1 }} />
                <TextField label="Credit Limit ($)" type="number" placeholder="Cards only" value={newDebt.limit} onChange={e => setNewDebt(n => ({ ...n, limit: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }} sx={{ ...inputSx, flex: 1 }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField label="APR (%)" type="number" value={newDebt.apr} onChange={e => setNewDebt(n => ({ ...n, apr: e.target.value }))} InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ color: D.text3 }}>%</Typography></InputAdornment> }} sx={{ ...inputSx, flex: 1 }} />
                <TextField label="Min. Payment ($)" type="number" value={newDebt.minPayment} onChange={e => setNewDebt(n => ({ ...n, minPayment: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }} sx={{ ...inputSx, flex: 1 }} />
                <TextField label="Due Date" type="date" value={newDebt.dueDate} onChange={e => setNewDebt(n => ({ ...n, dueDate: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ ...inputSx, flex: 1 }} />
              </Box>
              <TextField select label="Status" value={newDebt.status} onChange={e => setNewDebt(n => ({ ...n, status: e.target.value }))} SelectProps={{ native: true }} sx={inputSx}>
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </TextField>
              <TextField label="Notes" value={newDebt.note} onChange={e => setNewDebt(n => ({ ...n, note: e.target.value }))} multiline rows={2} sx={inputSx} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={editingId ? <SaveIcon /> : <AddIcon />} onClick={addDebt} disabled={!newDebt.name || !newDebt.balance}
                  sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, fontWeight: 700 }}>
                  {editingId ? 'Save Changes' : 'Add Debt'}
                </Button>
                {editingId && <Button onClick={() => { setEditingId(null); setNewDebt({ name: '', type: 'Credit Card', balance: '', limit: '', apr: '', minPayment: '', dueDate: '', status: 'Current', note: '' }); }} sx={{ color: D.text3 }}>Cancel</Button>}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 2: ACTIVE DEBTS ── */}
      {tab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {debts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}><Typography sx={{ color: D.text3 }}>No debts added yet. Go to Manage Debts to add them.</Typography></Box>
          ) : [...debts].sort((a, b) => Number(b.balance) - Number(a.balance)).map(d => {
            const days = daysUntil(d.dueDate);
            const util = d.type === 'Credit Card' && d.limit > 0 ? (Number(d.balance) / Number(d.limit)) * 100 : null;
            const statusColor = STATUS_COLORS[d.status] || D.text3;
            const urgent = days !== null && days <= 7 && days >= 0;
            return (
              <Card key={d.id} sx={{ bgcolor: D.bg2, border: `1px solid ${d.status === 'Collection' || d.status === 'Charge-off' ? 'rgba(239,68,68,0.3)' : urgent ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 3 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '1.5rem', flexShrink: 0 }}>{DEBT_ICONS[d.type] || '📋'}</Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                          <Typography fontWeight={800} sx={{ color: D.text1 }}>{d.name}</Typography>
                          <Box sx={{ display: 'flex', gap: 0.8, mt: 0.4, flexWrap: 'wrap' }}>
                            <Chip label={d.type} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: D.text3, fontSize: '0.65rem', height: 18 }} />
                            <Chip label={d.status} size="small" sx={{ bgcolor: statusColor + '20', color: statusColor, fontSize: '0.65rem', height: 18, border: `1px solid ${statusColor}40` }} />
                            {urgent && <Chip label={`Due in ${days}d`} size="small" sx={{ bgcolor: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontSize: '0.65rem', height: 18 }} />}
                            {days !== null && days < 0 && <Chip label="OVERDUE" size="small" sx={{ bgcolor: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.65rem', height: 18 }} />}
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#ef4444' }}>${fmt(d.balance)}</Typography>
                          {d.minPayment > 0 && <Typography sx={{ color: D.text3, fontSize: '0.72rem' }}>Min: ${fmt(d.minPayment)}/mo</Typography>}
                        </Box>
                      </Box>

                      {/* Utilization bar for cards */}
                      {util !== null && (
                        <Box sx={{ mt: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                            <Typography sx={{ color: D.text3, fontSize: '0.72rem' }}>Utilization: {util.toFixed(1)}%</Typography>
                            <Typography sx={{ color: D.text3, fontSize: '0.72rem' }}>${fmt(d.balance)} / ${fmt(d.limit)}</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(util, 100)}
                            sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: util > 50 ? '#ef4444' : util > 30 ? 'rgba(255,255,255,0.6)' : D.bg4, borderRadius: 3 } }} />
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 3, mt: 1.5, flexWrap: 'wrap' }}>
                        {d.apr > 0 && <Typography sx={{ color: D.text3, fontSize: '0.78rem' }}>APR: <span style={{ color: D.text1, fontWeight: 600 }}>{d.apr}%</span></Typography>}
                        {d.dueDate && <Typography sx={{ color: D.text3, fontSize: '0.78rem' }}>Due: <span style={{ color: D.text1, fontWeight: 600 }}>{new Date(d.dueDate).toLocaleDateString()}</span></Typography>}
                      </Box>
                      {d.note && <Typography sx={{ color: 'rgba(232,245,238,0.4)', fontSize: '0.75rem', mt: 0.5, fontStyle: 'italic' }}>"{d.note}"</Typography>}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => startEdit(d)} sx={{ color: D.text3, '&:hover': { color: D.text2 } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                      <IconButton size="small" onClick={() => setDebts(prev => prev.filter(x => x.id !== d.id))} sx={{ color: 'rgba(232,245,238,0.2)', '&:hover': { color: '#ef4444' } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* ── TAB 3: CREDIT SCORES ── */}
      {tab === 3 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ color: D.text3, fontSize: '0.82rem', mb: 1 }}>
            Manually enter your scores from each bureau. Check free at AnnualCreditReport.com, Credit Karma, or your bank app.
          </Typography>
          {creditScores.map((cs, i) => {
            const sl = cs.score > 0 ? scoreLabel(cs.score) : null;
            return (
              <Card key={cs.bureau} sx={{ bgcolor: D.bg2, border: `1px solid ${BUREAU_COLORS[cs.bureau]}30`, borderRadius: 3 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: BUREAU_COLORS[cs.bureau], flexShrink: 0 }} />
                    <Typography fontWeight={800} sx={{ color: D.text1, width: 110, flexShrink: 0 }}>{cs.bureau}</Typography>
                    <TextField size="small" label="Score (300–850)" type="number" value={cs.score || ''} placeholder="e.g. 680"
                      onChange={e => setCreditScores(prev => prev.map((s, j) => j === i ? { ...s, score: parseInt(e.target.value) || 0 } : s))}
                      sx={{ ...inputSx, width: 160 }} />
                    <TextField size="small" label="Trend (+/-)" type="number" value={cs.trend || ''} placeholder="e.g. +12 or -5"
                      onChange={e => setCreditScores(prev => prev.map((s, j) => j === i ? { ...s, trend: parseInt(e.target.value) || 0 } : s))}
                      InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ color: D.text3, fontSize: '0.75rem' }}>pts</Typography></InputAdornment> }}
                      sx={{ ...inputSx, width: 140 }} />
                    <TextField size="small" label="Last Updated" type="date" value={cs.date || ''}
                      onChange={e => setCreditScores(prev => prev.map((s, j) => j === i ? { ...s, date: e.target.value } : s))}
                      InputLabelProps={{ shrink: true }} sx={{ ...inputSx, width: 160 }} />
                    {sl && (
                      <Box sx={{ ml: 'auto' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: sl.color }}>{cs.score}</Typography>
                        <Typography sx={{ color: sl.color, fontSize: '0.75rem', fontWeight: 600 }}>{sl.label}</Typography>
                        {cs.trend !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                            {cs.trend > 0 ? <TrendingUpIcon sx={{ fontSize: 14, color: D.bg4 }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: '#ef4444' }} />}
                            <Typography sx={{ color: cs.trend > 0 ? D.bg4 : '#ef4444', fontSize: '0.72rem', fontWeight: 600 }}>{cs.trend > 0 ? '+' : ''}{cs.trend} pts</Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  {cs.score > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={Math.max(0, ((cs.score - 300) / 550) * 100)}
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: sl?.color || D.bg4, borderRadius: 3 } }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.20)', fontSize: '0.65rem' }}>300 (Poor)</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.20)', fontSize: '0.65rem' }}>850 (Exceptional)</Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* ── TAB 4: CREDIT REPORT ── */}
      {tab === 4 && (
        <Box>
          <Alert severity="info" sx={{ bgcolor: 'rgba(13,38,24,0.8)', color: D.text2, border: '1px solid rgba(255,255,255,0.10)', mb: 3, '& .MuiAlert-icon': { color: D.text2 } }}>
            🔍 Manually log items from your credit reports. Check free at <strong>AnnualCreditReport.com</strong> (official). Hermes analyzes everything you enter.
          </Alert>

          {/* Add report item */}
          <Card sx={{ bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2 }}>Log Report Item</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField select label="Bureau" value={newItem.bureau} onChange={e => setNewItem(n => ({ ...n, bureau: e.target.value }))} SelectProps={{ native: true }} sx={{ ...inputSx, width: 160 }}>
                    {BUREAUS.map(b => <option key={b} value={b}>{b}</option>)}
                  </TextField>
                  <TextField select label="Item Type" value={newItem.type} onChange={e => setNewItem(n => ({ ...n, type: e.target.value }))} SelectProps={{ native: true }} sx={{ ...inputSx, flex: 1 }}>
                    {['Collection', 'Charge-off', 'Missed Payment', 'Late Payment', 'Hard Inquiry', 'New Account', 'Bankruptcy', 'Judgment', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                  </TextField>
                </Box>
                <TextField label="Description" value={newItem.description} onChange={e => setNewItem(n => ({ ...n, description: e.target.value }))} placeholder="e.g. Capital One — 90 days late, $450 balance" sx={inputSx} />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField label="Date Reported" type="date" value={newItem.date} onChange={e => setNewItem(n => ({ ...n, date: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ ...inputSx, flex: 1 }} />
                  <TextField label="Amount ($)" type="number" value={newItem.amount} onChange={e => setNewItem(n => ({ ...n, amount: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: D.text3 }}>$</Typography></InputAdornment> }} sx={{ ...inputSx, flex: 1 }} />
                </Box>
                {/* Flagged toggle */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {['Needs Attention', 'Resolved'].map(f => (
                    <Box key={f} onClick={() => setNewItem(n => ({ ...n, flagged: f === 'Needs Attention' }))}
                      sx={{ px: 2, py: 0.8, borderRadius: 99, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', bgcolor: (newItem.flagged ? f === 'Needs Attention' : f === 'Resolved') ? 'rgba(71,133,89,0.25)' : 'rgba(13,38,24,0.5)', color: (newItem.flagged ? f === 'Needs Attention' : f === 'Resolved') ? D.text2 : D.text3, border: `1px solid ${(newItem.flagged ? f === 'Needs Attention' : f === 'Resolved') ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.15s' }}>
                      {f === 'Needs Attention' ? '🚨 ' : '✅ '}{f}
                    </Box>
                  ))}
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                  if (!newItem.description) return;
                  setCreditReport(prev => [...prev, { ...newItem, id: Date.now() }]);
                  setNewItem(n => ({ ...n, description: '', date: '', amount: '' }));
                }} disabled={!newItem.description} sx={{ bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 }, fontWeight: 700, alignSelf: 'flex-start' }}>
                  Add to Report
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Report items grouped by bureau */}
          {BUREAUS.map(bureau => {
            const items = creditReport.filter(r => r.bureau === bureau);
            if (items.length === 0) return null;
            return (
              <Box key={bureau} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: BUREAU_COLORS[bureau] }} />
                  <Typography fontWeight={700} sx={{ color: D.text1 }}>{bureau}</Typography>
                  <Chip label={`${items.length} items`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: D.text3, fontSize: '0.65rem', height: 18 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {items.map(item => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, borderRadius: 2.5, bgcolor: D.bg2, border: `1px solid ${item.flagged ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                      {item.flagged ? <ErrorOutlineIcon sx={{ color: '#f87171', fontSize: 18, mt: 0.2, flexShrink: 0 }} /> : <CheckCircleIcon sx={{ color: D.bg4, fontSize: 18, mt: 0.2, flexShrink: 0 }} />}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 0.4 }}>
                          <Chip label={item.type} size="small" sx={{ bgcolor: item.flagged ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)', color: item.flagged ? '#f87171' : D.text2, fontSize: '0.65rem', height: 18 }} />
                          {item.date && <Typography sx={{ color: D.text3, fontSize: '0.72rem', alignSelf: 'center' }}>{new Date(item.date).toLocaleDateString()}</Typography>}
                          {item.amount > 0 && <Typography sx={{ color: '#f87171', fontSize: '0.72rem', fontWeight: 700, alignSelf: 'center' }}>${fmt(item.amount)}</Typography>}
                        </Box>
                        <Typography sx={{ color: D.text1, fontSize: '0.85rem' }}>{item.description}</Typography>
                      </Box>
                      <IconButton size="small" onClick={() => setCreditReport(prev => prev.filter(r => r.id !== item.id))} sx={{ color: 'rgba(232,245,238,0.15)', '&:hover': { color: '#ef4444' }, flexShrink: 0 }}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}

          {creditReport.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography sx={{ color: D.text3 }}>No report items logged yet. Pull your credit report and log any negative items.</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ── TAB 5: PAYOFF PLAN ── */}
      {tab === 5 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="info" sx={{ bgcolor: 'rgba(13,38,24,0.8)', color: D.text2, border: '1px solid rgba(255,255,255,0.10)', '& .MuiAlert-icon': { color: D.text2 } }}>
            🦊 Based on your real Experian report. Follow the phases in order for maximum score impact.
          </Alert>

          {[
            {
              phase: 'Phase 1', label: 'Do This Week', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)',
              cost: '$300', scoreBoost: '+25–45 pts in 30 days',
              items: [
                { name: 'Sunrise Credit / Spectrum', amount: '$252', offer: '$150', action: 'Call (800) 645-9824', detail: 'Offer $150 pay-for-delete. Newest collection — most urgent.' },
                { name: 'Credit Collection / Progressive', amount: '$226', offer: '$150', action: 'Call (617) 965-2000', detail: 'Offer $150 pay-for-delete. Easy win.' },
              ]
            },
            {
              phase: 'Phase 2', label: 'Next Paycheck (2–4 weeks)', color: 'rgba(255,255,255,0.6)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',
              cost: '$200', scoreBoost: '+20–35 additional pts',
              items: [
                { name: 'Kikoff Lending LLC', amount: '$385', offer: '$200', action: 'Email support@kikoff.com', detail: 'Offer $200 settlement + deletion. Fintech — flexible.' },
              ]
            },
            {
              phase: 'Phase 3', label: 'Save Up (1–3 months)', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)',
              cost: '$400', scoreBoost: '+25–40 additional pts',
              items: [
                { name: 'Discover Card', amount: '$742', offer: '$370–400', action: 'Call (800) 347-2683', detail: 'Offer 50 cents on dollar. Charged off Oct 2023.' },
              ]
            },
            {
              phase: 'Phase 4', label: 'Big One (3–6 months)', color: D.bg4, bg: 'rgba(255,255,255,0.04)', border: 'rgba(71,133,89,0.25)',
              cost: '~$2,000', scoreBoost: '+40–70 additional pts',
              items: [
                { name: 'American Express', amount: '$4,323', offer: '$1,729–2,000', action: 'Call (800) 874-2717', detail: 'Start at 40% ($1,729). Expect to settle ~$2,000. BIGGEST score boost.' },
              ]
            },
          ].map((phase, i) => (
            <Card key={i} sx={{ bgcolor: phase.bg, border: `1px solid ${phase.border}`, borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: phase.color }} />
                      <Typography fontWeight={800} sx={{ color: D.text1 }}>{phase.phase}</Typography>
                      <Typography sx={{ color: D.text3, fontSize: '0.82rem' }}>— {phase.label}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Chip label={`Cost: ${phase.cost}`} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '0.7rem' }} />
                    <Chip label={phase.scoreBoost} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: D.text2, fontSize: '0.7rem' }} />
                  </Box>
                </Box>
                {phase.items.map((item, j) => (
                  <Box key={j} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(13,38,24,0.5)', border: '1px solid rgba(255,255,255,0.05)', mb: j < phase.items.length - 1 ? 1.5 : 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 0.8 }}>
                      <Typography fontWeight={700} sx={{ color: D.text1, fontSize: '0.9rem' }}>{item.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={`Owed: ${item.amount}`} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.68rem', height: 20 }} />
                        <Chip label={`Offer: ${item.offer}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: D.text2, fontSize: '0.68rem', height: 20 }} />
                      </Box>
                    </Box>
                    <Typography sx={{ color: D.text2, fontWeight: 700, fontSize: '0.8rem', mb: 0.3 }}>📞 {item.action}</Typography>
                    <Typography sx={{ color: D.text3, fontSize: '0.78rem' }}>{item.detail}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Total projection */}
          <Card sx={{ bgcolor: 'rgba(45,106,79,0.15)', border: '1px solid rgba(148,204,171,0.25)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={800} sx={{ color: D.text1, mb: 2 }}>📈 Total Projection — Clear All 5 Accounts</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
                {[
                  { label: 'Full amount owed', value: '$5,928', color: '#ef4444' },
                  { label: 'Negotiated total', value: '~$2,900', color: 'rgba(255,255,255,0.6)' },
                  { label: 'Money saved', value: '~$3,028', color: D.bg4 },
                ].map(m => (
                  <Box key={m.label} sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: 'rgba(13,38,24,0.5)' }}>
                    <Typography sx={{ color: D.text3, fontSize: '0.68rem', mb: 0.5 }}>{m.label}</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: m.color }}>{m.value}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
              <Typography sx={{ color: D.text1, fontWeight: 700, mb: 1 }}>🎯 Estimated Score Gain After All Phases</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography sx={{ color: D.text3, fontSize: '0.82rem', width: 120 }}>Potential boost:</Typography>
                <Typography sx={{ color: D.text2, fontWeight: 800, fontSize: '1.1rem' }}>+110 to +190 points</Typography>
              </Box>
              <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: D.bg4, borderRadius: 4 } }} />
              <Typography sx={{ color: 'rgba(232,245,238,0.4)', fontSize: '0.72rem', mt: 0.8 }}>
                If starting at ~580 → estimated 690–770 after all phases complete 🦊
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}

/* ── Entry ──────────────────────────────────────────────── */
export default function Checkin() {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  if (!unlocked) return <PinLock onUnlock={p => { setPin(p); setUnlocked(true); }} />;
  return <DebtDashboard pin={pin} username={user?.username || 'user'} />;
}
