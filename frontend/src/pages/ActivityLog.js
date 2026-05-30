import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField,
  Button, Chip, Divider, IconButton, Tab, Tabs, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { D, FONTS } from '../theme';

/* ── Storage ─────────────────────────────────────────────── */
const KEY = 'swpg_activities_v1';
const loadActivities = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const saveActivities = (a) => localStorage.setItem(KEY, JSON.stringify(a));

/* ── Categories ──────────────────────────────────────────── */
const CATEGORIES = [
  { label: 'Work',       emoji: '💼', color: '#60a5fa' },
  { label: 'Health',     emoji: '🏃', color: '#4ade80' },
  { label: 'Food',       emoji: '🍽️', color: 'rgba(255,255,255,0.6)' },
  { label: 'Learning',   emoji: '📚', color: '#a78bfa' },
  { label: 'Personal',   emoji: '🧘', color: '#f472b6' },
  { label: 'Social',     emoji: '👥', color: '#34d399' },
  { label: 'Errand',     emoji: '🛒', color: '#fb923c' },
  { label: 'Rest',       emoji: '😴', color: '#94a3b8' },
  { label: 'Finance',    emoji: '💵', color: '#22d3ee' },
  { label: 'Other',      emoji: '📌', color: '#e2e8f0' },
];

const getCat = (label) => CATEGORIES.find(c => c.label === label) || CATEGORIES[CATEGORIES.length - 1];

/* ── Helpers ─────────────────────────────────────────────── */
const today = () => new Date().toISOString().split('T')[0];
const nowTime = () => new Date().toTimeString().slice(0, 5);
const fmt12 = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
};
const groupByDate = (activities) => {
  const groups = {};
  activities.forEach(a => {
    if (!groups[a.date]) groups[a.date] = [];
    groups[a.date].push(a);
  });
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
};
const formatDate = (d) => {
  const date = new Date(d + 'T12:00:00');
  const t = today();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];
  if (d === t) return 'Today';
  if (d === yStr) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

/* ── Main Component ──────────────────────────────────────── */
export default function ActivityLog() {
  const [activities, setActivities] = useState(loadActivities);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Work',
    date: today(),
    startTime: nowTime(),
    endTime: '',
    note: '',
  });
  const titleRef = useRef(null);

  // Auto-save
  useEffect(() => { saveActivities(activities); }, [activities]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addActivity = () => {
    if (!form.title.trim()) return;
    const newActivity = {
      id: Date.now(),
      ...form,
      title: form.title.trim(),
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
    setForm(f => ({ ...f, title: '', note: '', startTime: nowTime(), endTime: '' }));
    titleRef.current?.focus();
  };

  const deleteActivity = (id) => setActivities(prev => prev.filter(a => a.id !== id));

  // Duration calc
  const getDuration = (start, end) => {
    if (!start || !end) return null;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins < 0) mins += 1440;
    if (mins === 0) return null;
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m}m`;
  };

  // Filter & search
  const filtered = activities.filter(a => {
    const matchCat = filterCat === 'All' || a.category === filterCat;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.note || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const todayActivities = activities.filter(a => a.date === today());
  const grouped = groupByDate(filtered);

  // Stats
  const totalToday = todayActivities.length;
  const catCounts = {};
  todayActivities.forEach(a => { catCounts[a.category] = (catCounts[a.category] || 0) + 1; });
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: D.bg2, color: D.text1,
      '& fieldset': { borderColor: 'rgba(255,255,255,0.10)' },
      '&:hover fieldset': { borderColor: D.text2 },
      '&.Mui-focused fieldset': { borderColor: D.text2, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { color: D.text3 },
    '& .MuiInputLabel-root.Mui-focused': { color: D.text2 },
    '& .MuiInputBase-input': { color: D.text1 },
    '& .MuiSelect-icon': { color: D.text3 },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: D.text1 }}>📋 Activity Log</Typography>
        <Typography variant="body2" sx={{ color: D.text3, mt: 0.5 }}>Track everything you do, every day</Typography>
      </Box>

      {/* Today stats */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ px: 2.5, py: 1.5, borderRadius: 3, bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CalendarTodayIcon sx={{ color: D.text2, fontSize: 18 }} />
          <Box>
            <Typography sx={{ color: D.text3, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 1 }}>Today</Typography>
            <Typography sx={{ color: D.text1, fontWeight: 800, fontSize: '1.1rem' }}>{totalToday} activities</Typography>
          </Box>
        </Box>
        {topCat && (
          <Box sx={{ px: 2.5, py: 1.5, borderRadius: 3, bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '1.2rem' }}>{getCat(topCat[0]).emoji}</Typography>
            <Box>
              <Typography sx={{ color: D.text3, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 1 }}>Most logged</Typography>
              <Typography sx={{ color: D.text1, fontWeight: 800, fontSize: '1rem' }}>{topCat[0]} ({topCat[1]})</Typography>
            </Box>
          </Box>
        )}
        <Box sx={{ px: 2.5, py: 1.5, borderRadius: 3, bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AccessTimeIcon sx={{ color: D.text2, fontSize: 18 }} />
          <Box>
            <Typography sx={{ color: D.text3, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 1 }}>Total logged</Typography>
            <Typography sx={{ color: D.text1, fontWeight: 800, fontSize: '1.1rem' }}>{activities.length} entries</Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTabs-indicator': { bgcolor: D.text2 } }}>
        <Tab label="➕ Log Activity" sx={{ color: D.text3, '&.Mui-selected': { color: D.text2 }, textTransform: 'none', fontWeight: 600 }} />
        <Tab label="📅 History" sx={{ color: D.text3, '&.Mui-selected': { color: D.text2 }, textTransform: 'none', fontWeight: 600 }} />
      </Tabs>

      {/* ── TAB 0: LOG ── */}
      {tab === 0 && (
        <Box>
          {/* Quick log card */}
          <Card sx={{ bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={700} sx={{ color: D.text1, mb: 2.5 }}>What did you do?</Typography>

              {/* Title */}
              <TextField
                fullWidth
                placeholder="e.g. Went to gym, Ate lunch, Paid rent, Read 30 mins..."
                value={form.title}
                onChange={e => set('title', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addActivity()}
                inputRef={titleRef}
                sx={{ ...inputSx, mb: 2 }}
                autoFocus
              />

              {/* Category chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {CATEGORIES.map(cat => (
                  <Chip
                    key={cat.label}
                    label={`${cat.emoji} ${cat.label}`}
                    onClick={() => set('category', cat.label)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: form.category === cat.label ? 'rgba(255,255,255,0.08)' : 'rgba(13,38,24,0.5)',
                      color: form.category === cat.label ? D.text1 : D.text3,
                      border: `1px solid ${form.category === cat.label ? cat.color + '60' : 'rgba(255,255,255,0.06)'}`,
                      fontWeight: form.category === cat.label ? 700 : 400,
                      fontSize: '0.8rem',
                      transition: 'all 0.15s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
                      boxShadow: form.category === cat.label ? `0 0 10px ${cat.color}30` : 'none',
                    }}
                  />
                ))}
              </Box>

              {/* Date + Time row */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <TextField
                  label="Date" type="date" value={form.date}
                  onChange={e => set('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...inputSx, flex: 1, minWidth: 140 }}
                />
                <TextField
                  label="Start Time" type="time" value={form.startTime}
                  onChange={e => set('startTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...inputSx, width: 140 }}
                />
                <TextField
                  label="End Time (optional)" type="time" value={form.endTime}
                  onChange={e => set('endTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...inputSx, width: 170 }}
                />
              </Box>

              {/* Note */}
              <TextField
                fullWidth multiline rows={2}
                placeholder="Add a note (optional)..."
                value={form.note}
                onChange={e => set('note', e.target.value)}
                sx={{ ...inputSx, mb: 2.5 }}
              />

              {/* Preview + Submit */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {form.title && (
                  <Box sx={{ flex: 1, px: 2, py: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography sx={{ color: D.text1, fontSize: '0.85rem', fontWeight: 600 }}>
                      {getCat(form.category).emoji} {form.title}
                    </Typography>
                    <Typography sx={{ color: D.text3, fontSize: '0.72rem' }}>
                      {form.date === today() ? 'Today' : form.date} · {fmt12(form.startTime)}{form.endTime ? ` → ${fmt12(form.endTime)}` : ''}
                      {form.endTime && getDuration(form.startTime, form.endTime) ? ` (${getDuration(form.startTime, form.endTime)})` : ''}
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addActivity}
                  disabled={!form.title.trim()}
                  sx={{
                    py: 1.5, px: 3, fontWeight: 800, fontSize: '0.95rem',
                    bgcolor: D.bg2, '&:hover': { bgcolor: D.bg3 },
                    '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.04)', color: D.text3 },
                  }}
                >
                  Save Activity
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Today's log */}
          <Typography fontWeight={700} sx={{ color: D.text1, mb: 1.5 }}>
            Today's Log {totalToday > 0 && <Chip label={totalToday} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: D.text2, ml: 1, fontWeight: 700 }} />}
          </Typography>

          {todayActivities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5, color: D.text3 }}>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>📋</Typography>
              <Typography>Nothing logged today yet. Add your first activity above.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[...todayActivities].reverse().map(a => {
                const cat = getCat(a.category);
                const dur = getDuration(a.startTime, a.endTime);
                return (
                  <Box key={a.id} sx={{
                    display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, borderRadius: 2.5,
                    bgcolor: D.bg2, border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.15s', '&:hover': { borderColor: 'rgba(255,255,255,0.12)', transform: 'translateX(3px)' },
                  }}>
                    {/* Color dot */}
                    <Box sx={{ width: 3, borderRadius: 99, alignSelf: 'stretch', bgcolor: cat.color, flexShrink: 0, minHeight: 36 }} />
                    <Box sx={{ fontSize: '1.2rem', flexShrink: 0, mt: 0.1 }}>{cat.emoji}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ color: D.text1, fontWeight: 600, fontSize: '0.9rem' }}>{a.title}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3, flexWrap: 'wrap' }}>
                        <Chip label={a.category} size="small" sx={{ bgcolor: cat.color + '20', color: cat.color, fontSize: '0.65rem', height: 18, border: `1px solid ${cat.color}40` }} />
                        <Typography sx={{ color: D.text3, fontSize: '0.72rem' }}>
                          {fmt12(a.startTime)}{a.endTime ? ` → ${fmt12(a.endTime)}` : ''}
                          {dur ? ` · ${dur}` : ''}
                        </Typography>
                      </Box>
                      {a.note && <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', mt: 0.4, fontStyle: 'italic' }}>"{a.note}"</Typography>}
                    </Box>
                    <IconButton size="small" onClick={() => deleteActivity(a.id)} sx={{ color: 'rgba(232,245,238,0.15)', '&:hover': { color: '#ef4444' }, flexShrink: 0 }}>
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      {/* ── TAB 1: HISTORY ── */}
      {tab === 1 && (
        <Box>
          {/* Search + filter */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search activities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: D.text3, fontSize: 18 }} /></InputAdornment> }}
              sx={{ ...inputSx, flex: 1, minWidth: 200 }}
            />
          </Box>

          {/* Category filter */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 3 }}>
            {['All', ...CATEGORIES.map(c => c.label)].map(cat => (
              <Chip
                key={cat}
                label={cat === 'All' ? '🗂 All' : `${getCat(cat).emoji} ${cat}`}
                onClick={() => setFilterCat(cat)}
                size="small"
                sx={{
                  cursor: 'pointer',
                  bgcolor: filterCat === cat ? 'rgba(255,255,255,0.08)' : 'rgba(13,38,24,0.5)',
                  color: filterCat === cat ? D.text1 : D.text3,
                  border: `1px solid ${filterCat === cat ? 'rgba(148,204,171,0.35)' : 'rgba(255,255,255,0.05)'}`,
                  fontWeight: filterCat === cat ? 700 : 400,
                  fontSize: '0.75rem',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              />
            ))}
          </Box>

          {filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, color: D.text3 }}>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔍</Typography>
              <Typography>{activities.length === 0 ? 'No activities yet. Start logging!' : 'No results found.'}</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {grouped.map(([date, acts]) => (
                <Box key={date}>
                  {/* Date header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <Typography sx={{ color: D.text2, fontWeight: 800, fontSize: '0.95rem' }}>{formatDate(date)}</Typography>
                    <Typography sx={{ color: D.text3, fontSize: '0.75rem' }}>{date}</Typography>
                    <Chip label={`${acts.length} activities`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.04)', color: D.text3, fontSize: '0.65rem', height: 18 }} />
                    <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.05)' }} />
                  </Box>

                  {/* Activities for this day */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    {[...acts].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')).map(a => {
                      const cat = getCat(a.category);
                      const dur = getDuration(a.startTime, a.endTime);
                      return (
                        <Box key={a.id} sx={{
                          display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, borderRadius: 2.5,
                          bgcolor: D.bg2, border: '1px solid rgba(148,204,171,0.07)',
                          transition: 'all 0.15s', '&:hover': { borderColor: 'rgba(148,204,171,0.18)', bgcolor: 'rgba(13,38,24,0.75)' },
                        }}>
                          <Box sx={{ width: 3, borderRadius: 99, alignSelf: 'stretch', bgcolor: cat.color, flexShrink: 0, minHeight: 32 }} />
                          {/* Time column */}
                          <Box sx={{ width: 60, flexShrink: 0, textAlign: 'right', pt: 0.2 }}>
                            <Typography sx={{ color: D.text3, fontSize: '0.72rem', fontWeight: 600 }}>{fmt12(a.startTime)}</Typography>
                            {a.endTime && <Typography sx={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.65rem' }}>{fmt12(a.endTime)}</Typography>}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '0.9rem' }}>{cat.emoji}</Typography>
                              <Typography sx={{ color: D.text1, fontWeight: 600, fontSize: '0.88rem' }}>{a.title}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.3, flexWrap: 'wrap', alignItems: 'center' }}>
                              <Chip label={a.category} size="small" sx={{ bgcolor: cat.color + '18', color: cat.color, fontSize: '0.63rem', height: 16, border: `1px solid ${cat.color}35` }} />
                              {dur && <Typography sx={{ color: D.text3, fontSize: '0.7rem' }}>⏱ {dur}</Typography>}
                            </Box>
                            {a.note && <Typography sx={{ color: 'rgba(232,245,238,0.4)', fontSize: '0.75rem', mt: 0.3, fontStyle: 'italic' }}>"{a.note}"</Typography>}
                          </Box>
                          <IconButton size="small" onClick={() => deleteActivity(a.id)} sx={{ color: 'rgba(232,245,238,0.1)', '&:hover': { color: '#ef4444' }, flexShrink: 0 }}>
                            <DeleteIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Clear all */}
          {activities.length > 0 && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button size="small" onClick={() => { if (window.confirm('Delete ALL activity history?')) setActivities([]); }}
                sx={{ color: 'rgba(239,68,68,0.4)', fontSize: '0.75rem', '&:hover': { color: '#ef4444' } }}>
                Clear all history
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}
