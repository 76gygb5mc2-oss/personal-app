/**
 * GlowingCard — inspired by aceternity/glowing-effect from 21st.dev
 * Dark minimal — white conic glow on mouse proximity
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { D, FONTS } from '../../theme';

export default function GlowingCard({
  children,
  onClick,
  style = {},
  disabled = false,
  borderWidth = 1,
  spread = 60,
}) {
  const containerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [active, setActive] = useState(false);
  const [angle, setAngle] = useState(0);

  const handleMove = useCallback((e) => {
    if (disabled || !containerRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const mx = e?.clientX ?? lastPos.current.x;
      const my = e?.clientY ?? lastPos.current.y;
      if (e) lastPos.current = { x: mx, y: my };

      const cx = left + width / 2;
      const cy = top + height / 2;
      const dist = Math.hypot(mx - cx, my - cy);
      const inactiveR = 0.5 * Math.min(width, height) * 0.7;
      if (dist < inactiveR) { setActive(false); return; }

      const isActive = mx > left - 10 && mx < left + width + 10 &&
                       my > top - 10 && my < top + height + 10;
      setActive(isActive);
      if (!isActive) return;

      const newAngle = (180 * Math.atan2(my - cy, mx - cx)) / Math.PI + 90;
      setAngle(newAngle);
    });
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;
    document.body.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.removeEventListener('pointermove', handleMove);
    };
  }, [handleMove, disabled]);

  const glowBorder = active
    ? `conic-gradient(from ${angle - spread}deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.5) ${spread}deg, rgba(255,255,255,0.8) ${spread * 1.1}deg, rgba(255,255,255,0.5) ${spread * 1.3}deg, transparent ${spread * 2}deg)`
    : 'transparent';

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: 14,
        padding: active ? borderWidth : 1,
        background: active ? glowBorder : `1px solid ${D.border1}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'padding 0.1s',
        fontFamily: FONTS.sans,
        ...style,
      }}
    >
      {/* Glow conic border */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        padding: borderWidth,
        background: glowBorder,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />
      {/* Inner card */}
      <div style={{
        borderRadius: 13,
        background: D.bg2,
        border: `1px solid ${active ? D.border2 : D.border1}`,
        overflow: 'hidden',
        height: '100%',
        transition: 'border-color 0.3s',
      }}>
        {children}
      </div>
    </div>
  );
}
