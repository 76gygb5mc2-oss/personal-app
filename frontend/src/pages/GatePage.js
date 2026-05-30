import React, { useState, useEffect, useRef } from 'react';

const TECH_QUOTES = [
  "The future is already here — it's just not evenly distributed.",
  "Move fast and build things that matter.",
  "Every great system starts with a single keystroke.",
  "Your personal OS. Your rules.",
];

export default function GatePage({ onUnlock }) {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [quoteIndex] = useState(Math.floor(Math.random() * TECH_QUOTES.length));
  const [time, setTime] = useState(new Date());
  const inputRefs = useRef([]);

  useEffect(() => {
    fetch('/api/gate/status')
      .then(r => r.json())
      .then(data => {
        if (!data.gate_active) onUnlock();
        else { setChecking(false); setTimeout(() => inputRefs.current[0]?.focus(), 400); }
      })
      .catch(() => setChecking(false));
  }, [onUnlock]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handle = (e) => setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const handleChange = (index, value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (!v) {
      const n = [...code]; n[index] = '';
      setCode(n);
      if (index > 0) inputRefs.current[index - 1]?.focus();
      return;
    }
    const n = [...code]; n[index] = v[v.length - 1];
    setCode(n); setError('');
    if (index < 3) inputRefs.current[index + 1]?.focus();
    else { const full = [...n].join(''); if (full.length === 4) submitCode(full); }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'Enter') { const full = code.join(''); if (full.length === 4) submitCode(full); }
  };

  const handlePaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (p.length > 0) {
      const n = [...code];
      for (let i = 0; i < 4; i++) n[i] = p[i] || '';
      setCode(n);
      inputRefs.current[Math.min(p.length, 3)]?.focus();
      if (p.length === 4) submitCode(p);
    }
    e.preventDefault();
  };

  const submitCode = async (fullCode) => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/gate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode }),
      });
      const data = await res.json();
      if (data.valid) { setSuccess(true); setTimeout(() => onUnlock(), 1000); }
      else {
        setShake(true); setError('Invalid access code');
        setCode(['', '', '', '', '', '', '', '']);
        setTimeout(() => { setShake(false); inputRefs.current[0]?.focus(); }, 600);
      }
    } catch { setError('Connection error. Try again.'); }
    setLoading(false);
  };

  const filled = code.filter(Boolean).length;
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (checking) return (
    <div style={s.root}>
      <div style={s.scanLine} />
      <div style={s.loaderCenter}>
        <div style={s.loaderLogo}>S</div>
        <div style={s.loaderRing} />
        <div style={{ ...s.loaderRing, width: 70, height: 70, animationDelay: '-0.4s', borderTopColor: 'rgba(139,92,246,0.5)' }} />
      </div>
      <style>{css}</style>
    </div>
  );

  return (
    <div style={s.root}>
      {/* Dynamic background gradient that follows mouse */}
      <div style={{
        ...s.dynamicBg,
        background: `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.06) 30%, transparent 60%), radial-gradient(ellipse at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(236,72,153,0.08) 0%, transparent 50%)`,
      }} />

      {/* Grid */}
      <div style={s.grid} />

      {/* Scan line effect */}
      <div style={s.scanLine} />

      {/* Left panel — visual side */}
      <div style={s.leftPanel} className="left-panel">
        {/* Big logo/brand */}
        <div style={s.brandWrap}>
          <div style={s.brandLogo}>S</div>
          <div style={s.brandText}>
            <div style={s.brandName}>Sirawdink OS</div>
            <div style={s.brandTagline}>Personal Operating System</div>
          </div>
        </div>

        {/* Live clock */}
        <div style={s.clockWrap}>
          <div style={s.clockTime}>{timeStr}</div>
          <div style={s.clockDate}>{dateStr}</div>
        </div>

        {/* Stats cards */}
        <div style={s.statsRow}>
          {[
            { label: 'Modules', value: '12', icon: '⚡' },
            { label: 'Status', value: 'Live', icon: '🟢' },
            { label: 'Version', value: '2.0', icon: '🚀' },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <span style={s.statIcon}>{stat.icon}</span>
              <span style={s.statValue}>{stat.value}</span>
              <span style={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={s.quoteWrap}>
          <div style={s.quoteBar} />
          <p style={s.quoteText}>"{TECH_QUOTES[quoteIndex]}"</p>
        </div>

        {/* Floating feature badges */}
        <div style={s.badgesWrap}>
          {['💼 Business', '💰 Finance', '🧠 Mindset', '📚 Learning', '💪 Health', '📊 Reports'].map((b, i) => (
            <div key={i} style={{ ...s.badge, animationDelay: `${i * 0.2}s` }}>{b}</div>
          ))}
        </div>
      </div>

      {/* Right panel — gate */}
      <div style={s.rightPanel} className="right-panel">
        <div style={{
          ...s.card,
          animation: shake ? 'shake 0.5s ease' : success ? 'successGlow 0.6s ease forwards' : 'cardIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
          borderColor: success ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.08)',
          boxShadow: success ? '0 0 60px rgba(34,197,94,0.12), 0 32px 80px rgba(0,0,0,0.6)' : '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          {/* Top shimmer */}
          <div style={{ ...s.shimmer, background: success ? 'linear-gradient(90deg,transparent,rgba(34,197,94,0.5),transparent)' : 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)' }} />

          {/* Lock icon */}
          <div style={{ ...s.iconCircle, background: success ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', borderColor: success ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)' }}>
            {success
              ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            }
          </div>

          <h2 style={{ ...s.cardTitle, color: success ? '#22c55e' : '#fff' }}>
            {success ? 'Access Granted' : 'Restricted Access'}
          </h2>
          <p style={s.cardSub}>
            {success ? 'Welcome back, Sirawdink 👋' : 'Enter your 4-digit PIN to continue'}
          </p>

          {/* Progress */}
          <div style={s.progressTrack}>
            <div style={{
              ...s.progressFill,
          width: `${(filled / 4) * 100}%`,
            background: success ? '#22c55e' : filled === 4 ? 'rgba(139,92,246,0.8)' : 'rgba(255,255,255,0.4)',
            }} />
          </div>
          <p style={s.progressLabel}>{filled}/4 digits</p>

          {/* Code boxes — 4 PIN digits */}
          <div style={{ ...s.boxRow, animation: shake ? 'shake 0.5s ease' : 'none' }}>
            {code.map((char, i) => (
              <div key={i} style={{ ...s.boxOuter, transform: char ? 'scale(1.06) translateY(-2px)' : 'scale(1)' }}>
                <input
                  ref={el => inputRefs.current[i] = el}
                  type="password" maxLength={1}
                  value={char}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  disabled={loading || success}
                  inputMode="numeric"
                  style={{
                    ...s.box,
                    width: 56, height: 64, fontSize: 28,
                    borderColor: success ? 'rgba(34,197,94,0.4)' : char ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.07)',
                    background: success ? 'rgba(34,197,94,0.08)' : char ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)',
                    color: success ? '#22c55e' : char ? '#c4b5fd' : 'rgba(255,255,255,0.2)',
                    boxShadow: char && !success ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
                  }}
                />
                {char && !success && <div style={s.boxGlow} />}
              </div>
            ))}
          </div>

          {/* Error */}
          <div style={{ ...s.errRow, opacity: error ? 1 : 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={s.errText}>{error || ' '}</span>
          </div>

          {/* Submit */}
          <button
            onClick={() => submitCode(code.join(''))}
            disabled={loading || filled < 4 || success}
            style={{
              ...s.btn,
              opacity: filled === 4 && !loading && !success ? 1 : 0.3,
              cursor: filled === 4 && !loading && !success ? 'pointer' : 'not-allowed',
              background: success ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))',
              borderColor: success ? 'rgba(34,197,94,0.3)' : 'rgba(139,92,246,0.3)',
            }}
          >
            {loading
              ? <div style={s.spinner} />
              : success
              ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg><span style={{ color: '#22c55e' }}>Unlocked</span></>
              : <><span>Enter System</span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            }
          </button>

          <p style={s.footNote}>🔐 Code regenerates when URL changes</p>
        </div>

        {/* Version tag */}
        <div style={s.versionTag}>SIRAWDINK-OS v2.0 · SECURE ACCESS</div>
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes cardIn { from { opacity:0; transform:translateY(30px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-7px)} 80%{transform:translateX(7px)} }
  @keyframes successGlow { 0%{transform:scale(1)} 50%{transform:scale(1.02)} 100%{transform:scale(1)} }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes scanMove { 0%{top:-2px} 100%{top:100vh} }
  @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes logoPulse { 0%,100%{box-shadow:0 0 30px rgba(139,92,246,0.3)} 50%{box-shadow:0 0 60px rgba(139,92,246,0.6)} }
  @keyframes loaderSpin { to{transform:rotate(360deg)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes clockBlink { 0%,100%{opacity:1} 50%{opacity:0.4} }
  input { font-family:'JetBrains Mono',monospace !important; }
  input:focus { outline:none !important; border-color:rgba(139,92,246,0.7) !important; background:rgba(139,92,246,0.12) !important; box-shadow:0 0 0 3px rgba(139,92,246,0.15), 0 0 24px rgba(139,92,246,0.2) !important; color:#c4b5fd !important; }
  button { font-family:'Inter',sans-serif !important; }
  button:hover:not(:disabled) { filter:brightness(1.2); transform:translateY(-2px) !important; box-shadow:0 12px 32px rgba(139,92,246,0.3) !important; }
  button:active:not(:disabled) { transform:translateY(0) !important; }
  ::-webkit-scrollbar { display:none; }
  .left-panel { display: flex !important; }
  .right-panel { width: 440px !important; }
  @media (max-width: 768px) {
    .left-panel { display: none !important; }
    .right-panel { width: 100% !important; min-height: 100vh; padding: 32px 20px !important; }
  }
`;

const s = {
  root: {
    display: 'flex', minHeight: '100vh',
    background: '#05050a',
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: 'relative', overflow: 'hidden',
    flexDirection: 'row',
  },
  dynamicBg: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    transition: 'background 0.3s ease',
  },
  grid: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
    backgroundSize: '50px 50px',
    maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%,black 20%,transparent 100%)',
  },
  scanLine: {
    position: 'fixed', left: 0, right: 0, height: 2,
    background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.3),transparent)',
    animation: 'scanMove 8s linear infinite',
    pointerEvents: 'none', zIndex: 1,
  },
  // Left panel
  leftPanel: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '60px 50px', position: 'relative', zIndex: 2, gap: 32,
    borderRight: '1px solid rgba(255,255,255,0.04)',
  },
  brandWrap: {
    display: 'flex', alignItems: 'center', gap: 16,
    animation: 'fadeUp 0.6s ease forwards',
  },
  brandLogo: {
    width: 56, height: 56, borderRadius: 16,
    background: 'linear-gradient(135deg, rgba(139,92,246,0.8), rgba(59,130,246,0.6))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, fontWeight: 900, color: '#fff',
    boxShadow: '0 8px 32px rgba(139,92,246,0.4)',
    animation: 'logoPulse 3s ease-in-out infinite',
    fontFamily: "'Inter', sans-serif",
  },
  brandName: {
    fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px',
  },
  brandTagline: {
    fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2,
  },
  clockWrap: {
    animation: 'fadeUp 0.6s ease 0.1s both',
  },
  clockTime: {
    fontSize: 52, fontWeight: 700, color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '-2px', lineHeight: 1,
    textShadow: '0 0 40px rgba(139,92,246,0.4)',
  },
  clockDate: {
    fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 8,
    letterSpacing: '0.5px',
  },
  statsRow: {
    display: 'flex', gap: 12,
    animation: 'fadeUp 0.6s ease 0.2s both',
  },
  statCard: {
    flex: 1, padding: '14px 16px', borderRadius: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  statIcon: { fontSize: 16 },
  statValue: { fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  quoteWrap: {
    display: 'flex', gap: 14, alignItems: 'flex-start',
    animation: 'fadeUp 0.6s ease 0.3s both',
  },
  quoteBar: {
    width: 3, minHeight: 40, borderRadius: 2, flexShrink: 0,
    background: 'linear-gradient(180deg, rgba(139,92,246,0.8), rgba(59,130,246,0.4))',
  },
  quoteText: {
    fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7,
    fontStyle: 'italic',
  },
  badgesWrap: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
    animation: 'fadeUp 0.6s ease 0.4s both',
  },
  badge: {
    padding: '6px 14px', borderRadius: 20,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    fontSize: 12, color: 'rgba(255,255,255,0.5)',
    animation: 'badgeFloat 3s ease-in-out infinite',
    transition: 'all 0.2s ease',
  },
  // Right panel
  rightPanel: {
    width: 440, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '40px 32px', gap: 16, position: 'relative', zIndex: 2,
  },
  card: {
    width: '100%', padding: '40px 36px 32px',
    borderRadius: 24, border: '1px solid',
    background: 'rgba(255,255,255,0.02)',
    backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
    position: 'relative', transition: 'border-color 0.4s, box-shadow 0.4s',
  },
  shimmer: {
    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, borderRadius: 1,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 20, border: '1px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  cardTitle: {
    fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px',
    transition: 'color 0.3s ease',
  },
  cardSub: {
    fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: -8,
  },
  progressTrack: {
    width: '100%', height: 3, borderRadius: 3,
    background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 3, transition: 'width 0.15s ease, background 0.3s ease',
  },
  progressLabel: {
    fontSize: 11, color: 'rgba(255,255,255,0.2)',
    fontFamily: "'JetBrains Mono', monospace",
    marginTop: -10,
  },
  boxRow: {
    display: 'flex', alignItems: 'center', gap: 7,
  },
  boxOuter: {
    position: 'relative', transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
  },
  box: {
    width: 42, height: 52, borderRadius: 12,
    border: '1px solid', textAlign: 'center',
    fontSize: 22, fontWeight: 700,
    transition: 'all 0.15s ease', caretColor: 'transparent',
  },
  boxGlow: {
    position: 'absolute', inset: -4, borderRadius: 16,
    background: 'rgba(139,92,246,0.15)',
    filter: 'blur(8px)', pointerEvents: 'none', zIndex: -1,
  },
  divider: {
    display: 'flex', flexDirection: 'column', gap: 4, margin: '0 3px',
  },
  dividerDot: {
    width: 3, height: 3, borderRadius: '50%',
    background: 'rgba(139,92,246,0.4)',
  },
  errRow: {
    display: 'flex', alignItems: 'center', gap: 6,
    transition: 'opacity 0.2s', minHeight: 18,
  },
  errText: { fontSize: 12, color: '#f87171' },
  btn: {
    width: '100%', padding: '14px 0', borderRadius: 14,
    border: '1px solid', color: '#fff',
    fontSize: 14, fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all 0.2s ease',
    letterSpacing: '0.2px',
  },
  spinner: {
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.15)',
    borderTopColor: '#fff', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  footNote: {
    fontSize: 11, color: 'rgba(255,255,255,0.15)',
    marginTop: -6,
  },
  versionTag: {
    fontSize: 10, color: 'rgba(255,255,255,0.12)',
    letterSpacing: '2px', textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace",
  },
  // Loader
  loaderCenter: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', height: '100vh', position: 'relative',
  },
  loaderLogo: {
    position: 'absolute', fontSize: 24, fontWeight: 900, color: 'rgba(139,92,246,0.8)',
    fontFamily: "'Inter', sans-serif",
  },
  loaderRing: {
    position: 'absolute', width: 56, height: 56, borderRadius: '50%',
    border: '2px solid transparent',
    borderTopColor: 'rgba(139,92,246,0.8)',
    animation: 'loaderSpin 1s linear infinite',
  },
};
