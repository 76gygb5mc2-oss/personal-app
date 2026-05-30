import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

export default function FoxPet() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    x: 150,
    y: 0,
    vx: 1.4,
    vy: 0,
    frame: 0,
    tick: 0,
    dir: 1,
    action: 'walk',
    actionTimer: 180,
    groundY: 0,
    blinkTimer: 90,
    blink: false,
    tailAngle: 0,
    scared: false,
    scaredTimer: 0,
    mouseX: -999,
    mouseY: -999,
  });
  const [tooltip, setTooltip] = useState('');
  const tooltipRef = useRef({ text: '', x: 0 });
  const tooltipTimer = useRef(null);

  const PHRASES = ['🌿', 'eep!', ':3', '♪', 'hi!', '✨', 'meep!', 'run!'];

  const showTooltip = (text, x) => {
    tooltipRef.current = { text, x };
    setTooltip(text);
    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => {
      tooltipRef.current = { text: '', x: 0 };
      setTooltip('');
    }, 1600);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H, raf;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stateRef.current.groundY = H - 58;
      if (stateRef.current.y === 0) stateRef.current.y = H - 58;
    };
    resize();
    window.addEventListener('resize', resize);

    // Track mouse + touch
    const onMouse = (e) => {
      stateRef.current.mouseX = e.clientX;
      stateRef.current.mouseY = e.clientY;
    };
    const onTouch = (e) => {
      if (e.touches[0]) {
        stateRef.current.mouseX = e.touches[0].clientX;
        stateRef.current.mouseY = e.touches[0].clientY;
      }
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    const s = stateRef.current;

    /* ── Draw fox with GREEN forest palette ── */
    function drawFox(ctx, x, y, dir, frame, action, blink, tailAngle, scared) {
      ctx.save();
      ctx.translate(x, y);
      if (dir === -1) ctx.scale(-1, 1);

      const run = action === 'run' || scared;
      const sit = action === 'sit' && !scared;
      const t = frame * (run ? 0.32 : sit ? 0.12 : 0.18);

      // Bob
      const bob = sit ? 0 : Math.sin(t) * (run ? 4 : 2);

      // ── TAIL ──
      const tailSwing = sit
        ? Math.sin(t * 2.5) * 22
        : scared
        ? Math.sin(t * 4) * 35
        : Math.sin(t * 1.2) * 14;

      ctx.save();
      ctx.translate(-10, -8 + bob);
      ctx.rotate(((tailAngle + tailSwing) * Math.PI) / 180);

      // tail body — dark forest green
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-8, -10, -14, -22, -6, -32);
      ctx.bezierCurveTo(0, -38, 12, -30, 10, -18);
      ctx.bezierCurveTo(8, -8, 2, 0, 0, 0);
      ctx.fillStyle = '#2d6a4f';
      ctx.fill();

      // tail tip — mint/foam
      ctx.beginPath();
      ctx.ellipse(-3, -31, 8, 6.5, (-28 * Math.PI) / 180, 0, Math.PI * 2);
      ctx.fillStyle = '#95ccab';
      ctx.fill();

      // tail stripe — fern
      ctx.beginPath();
      ctx.moveTo(-2, -6);
      ctx.bezierCurveTo(-6, -14, -10, -22, -5, -28);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#3a7d5c';
      ctx.stroke();
      ctx.restore();

      // ── BODY ──
      ctx.save();
      ctx.translate(0, bob);

      // main body — pine green
      ctx.beginPath();
      ctx.ellipse(0, -14, 15, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#2d6a4f';
      ctx.fill();

      // body highlight — fern
      ctx.beginPath();
      ctx.ellipse(-3, -18, 8, 5, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#3a7d5c';
      ctx.fill();

      // belly — pale foam
      ctx.beginPath();
      ctx.ellipse(4, -12, 9, 6.5, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#e8f5ee';
      ctx.fill();

      // ── LEGS ──
      const legSwing = Math.sin(t * (run ? 2 : 1)) * (run ? 18 : 9);
      if (!sit) {
        // shadow legs (darker)
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0e0e0e';
        ctx.beginPath(); ctx.moveTo(-7, -7); ctx.lineTo(-7 - legSwing * 0.5, 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-3, -7); ctx.lineTo(-3 + legSwing * 0.5, 2); ctx.stroke();
        // front legs
        ctx.beginPath(); ctx.moveTo(6, -10); ctx.lineTo(6 + legSwing, 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(10, -10); ctx.lineTo(10 - legSwing, 2); ctx.stroke();
        // highlight legs
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#2d6a4f';
        ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(-6 - legSwing * 0.5, 1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(7, -11); ctx.lineTo(7 + legSwing, 1); ctx.stroke();
      } else {
        ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#0e0e0e';
        ctx.beginPath(); ctx.moveTo(-5, -7); ctx.lineTo(-9, 1); ctx.lineTo(1, 1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(5, -7); ctx.lineTo(9, 1); ctx.lineTo(17, 1); ctx.stroke();
      }
      ctx.restore();

      // ── HEAD ──
      ctx.save();
      ctx.translate(13, -23 + bob);

      // head — pine green
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#2d6a4f';
      ctx.fill();

      // head highlight
      ctx.beginPath();
      ctx.ellipse(-3, -4, 6, 4, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#3a7d5c';
      ctx.fill();

      // ── EARS ──
      // left ear
      ctx.beginPath();
      ctx.moveTo(-6, -8); ctx.lineTo(-10, -20); ctx.lineTo(0, -11);
      ctx.fillStyle = '#2d6a4f'; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, -9); ctx.lineTo(-8.5, -17); ctx.lineTo(-1, -11);
      ctx.fillStyle = '#95ccab'; ctx.fill(); // mint inner ear

      // right ear
      ctx.beginPath();
      ctx.moveTo(5, -8); ctx.lineTo(11, -19); ctx.lineTo(13, -10);
      ctx.fillStyle = '#2d6a4f'; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6, -9); ctx.lineTo(10, -17); ctx.lineTo(12, -10);
      ctx.fillStyle = '#95ccab'; ctx.fill();

      // scared ears — flatten/rotate
      if (scared) {
        ctx.beginPath();
        ctx.moveTo(-6, -8); ctx.lineTo(-12, -14); ctx.lineTo(-2, -10);
        ctx.fillStyle = '#0e0e0e'; ctx.fill();
        ctx.beginPath();
        ctx.moveTo(5, -8); ctx.lineTo(14, -13); ctx.lineTo(12, -9);
        ctx.fillStyle = '#0e0e0e'; ctx.fill();
      }

      // face mask — foam
      ctx.beginPath();
      ctx.ellipse(4, 2, 8.5, 6.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#e8f5ee';
      ctx.fill();

      // ── EYES ──
      if (!blink) {
        // whites
        ctx.beginPath(); ctx.arc(-3, -2, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#e8f5ee'; ctx.fill();
        ctx.beginPath(); ctx.arc(4.5, -2, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#e8f5ee'; ctx.fill();

        // pupils — dark forest
        ctx.beginPath(); ctx.arc(-3 + (scared ? 1 : 0), -2, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#080808'; ctx.fill();
        ctx.beginPath(); ctx.arc(4.5 + (scared ? 1 : 0), -2, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#080808'; ctx.fill();

        // shine — mint
        ctx.beginPath(); ctx.arc(-2.2, -2.8, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = '#95ccab'; ctx.fill();
        ctx.beginPath(); ctx.arc(5.3, -2.8, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = '#95ccab'; ctx.fill();

        // scared wide eyes
        if (scared) {
          ctx.beginPath(); ctx.arc(-3, -2, 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = '#95ccab'; ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.arc(4.5, -2, 2.5, 0, Math.PI * 2); ctx.stroke();
        }
      } else {
        // blink
        ctx.beginPath(); ctx.moveTo(-5.5, -2); ctx.lineTo(-0.5, -2);
        ctx.lineWidth = 2; ctx.strokeStyle = '#080808'; ctx.lineCap = 'round'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(2, -2); ctx.lineTo(7, -2); ctx.stroke();
      }

      // nose — dark forest
      ctx.beginPath();
      ctx.ellipse(8, 2.5, 2.8, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#080808'; ctx.fill();
      // nose shine
      ctx.beginPath(); ctx.arc(7.2, 1.8, 0.7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(149,204,171,0.6)'; ctx.fill();

      // mouth
      ctx.beginPath();
      ctx.moveTo(5.5, 5); ctx.quadraticCurveTo(8, 8.5, 10.5, 5);
      ctx.lineWidth = 1.4; ctx.strokeStyle = '#080808';
      ctx.lineCap = 'round'; ctx.stroke();

      // cheek blush — sage
      if (!scared) {
        ctx.beginPath(); ctx.arc(-1, 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(122,184,147,0.25)'; ctx.fill();
        ctx.beginPath(); ctx.arc(9, 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(122,184,147,0.25)'; ctx.fill();
      }

      ctx.restore(); // head
      ctx.restore(); // main
    }

    /* ── Loop ── */
    function loop() {
      ctx.clearRect(0, 0, W, H);

      s.tick++;
      s.frame++;
      s.actionTimer--;
      s.blinkTimer--;
      s.tailAngle = Math.sin(s.tick * 0.04) * 10;

      // Blink
      if (s.blinkTimer <= 0) {
        s.blink = !s.blink;
        s.blinkTimer = s.blink ? 5 : 80 + Math.random() * 140;
      }

      // Mouse proximity check — run away!
      const dx = s.mouseX - s.x;
      const dy = s.mouseY - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const FLEE_RADIUS = 130;

      if (dist < FLEE_RADIUS && s.mouseY > H - 200) {
        // FLEE — run opposite direction
        if (!s.scared) {
          s.scared = true;
          showTooltip('eep!', s.x);
        }
        s.scaredTimer = 60;
        const fleeDir = dx > 0 ? -1 : 1;
        s.dir = fleeDir;
        s.vx = fleeDir * (3.5 + Math.random() * 1.5);
        s.action = 'run';
        s.actionTimer = 40;
      } else {
        if (s.scaredTimer > 0) {
          s.scaredTimer--;
        } else {
          if (s.scared) {
            s.scared = false;
            s.action = 'sit';
            s.vx = 0;
            s.actionTimer = 60;
          }
        }
      }

      // Normal action transitions (only when not scared)
      if (!s.scared && s.actionTimer <= 0) {
        const roll = Math.random();
        if (roll < 0.45) {
          s.action = 'walk';
          s.vx = s.dir * (1.0 + Math.random() * 0.8);
          s.actionTimer = 140 + Math.random() * 200;
        } else if (roll < 0.6) {
          s.action = 'run';
          s.vx = s.dir * (2.5 + Math.random() * 1.2);
          s.actionTimer = 50 + Math.random() * 70;
        } else if (roll < 0.82) {
          s.action = 'sit';
          s.vx = 0;
          s.actionTimer = 100 + Math.random() * 160;
        } else {
          // random direction flip
          s.dir *= -1;
          s.vx = s.dir * 1.2;
          s.action = 'walk';
          s.actionTimer = 80;
        }
      }

      // Move
      s.x += s.vx;
      s.y = s.groundY;

      // Wall bounce
      const margin = 45;
      if (s.x > W - margin) {
        s.x = W - margin;
        s.dir = -1;
        s.vx = -Math.abs(s.vx);
        if (!s.scared) { s.action = 'walk'; s.actionTimer = 80; }
      }
      if (s.x < margin) {
        s.x = margin;
        s.dir = 1;
        s.vx = Math.abs(s.vx);
        if (!s.scared) { s.action = 'walk'; s.actionTimer = 80; }
      }

      // Update dir from velocity
      if (s.vx > 0.15) s.dir = 1;
      if (s.vx < -0.15) s.dir = -1;

      // Ground shadow
      ctx.beginPath();
      ctx.ellipse(s.x, s.groundY + 4, 22, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(13,38,24,0.25)';
      ctx.fill();

      drawFox(ctx, s.x, s.y, s.dir, s.frame, s.action, s.blink, s.tailAngle, s.scared);

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', bottom: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 998,
        }}
      />
      {tooltip && (
        <Box sx={{
          position: 'fixed',
          bottom: 72,
          left: Math.max(30, Math.min(tooltipRef.current.x - 20, window.innerWidth - 80)),
          zIndex: 999,
          bgcolor: 'rgba(13,38,24,0.92)',
          border: '1px solid rgba(148,204,171,0.4)',
          borderRadius: 99,
          px: 1.8, py: 0.6,
          fontSize: '0.82rem',
          color: '#95ccab',
          fontWeight: 800,
          pointerEvents: 'none',
          boxShadow: '0 0 12px rgba(255,255,255,0.12)',
          animation: 'foxPop 0.2s ease',
          '@keyframes foxPop': {
            from: { opacity: 0, transform: 'translateY(6px) scale(0.9)' },
            to: { opacity: 1, transform: 'translateY(0) scale(1)' },
          },
        }}>
          {tooltip}
        </Box>
      )}
    </>
  );
}
