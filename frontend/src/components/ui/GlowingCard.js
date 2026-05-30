/**
 * GlowingCard — inspired by aceternity/glowing-effect from 21st.dev
 * Converted to React + inline styles for Sirawdink OS (green forest theme)
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { D } from '../../theme';

export default function GlowingCard({
  children,
  onClick,
  style = {},
  disabled = false,
  borderWidth = 1.5,
  spread = 80,
  glowColor = D.text2,
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

      const isActive =
        mx > left - 0 && mx < left + width + 0 &&
        my > top - 0 && my < top + height + 0;

      setActive(isActive);
      if (!isActive) return;

      const newAngle = (180 * Math.atan2(my - cy, mx - cx)) / Math.PI + 90;
      setAngle(newAngle);
    });
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;
    const onMove = (e) => handleMove(e);
    document.body.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.removeEventListener('pointermove', onMove);
    };
  }, [handleMove, disabled]);

  const glowBorder = active
    ? `conic-gradient(from ${angle - spread}deg at 50% 50%, transparent 0deg, ${glowColor}cc ${spread}deg, ${glowColor} ${spread * 1.2}deg, ${glowColor}cc ${spread * 1.5}deg, transparent ${spread * 2}deg)`
    : 'transparent';

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: 16,
        padding: borderWidth,
        background: active ? glowBorder : `1px solid rgba(148,204,171,0.12)`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      {/* Glow border overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: borderWidth,
          background: glowBorder,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />
      {/* Inner card */}
      <div
        style={{
          borderRadius: 14,
          background: 'rgba(13,38,24,0.72)',
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(148,204,171,${active ? 0.2 : 0.1})`,
          overflow: 'hidden',
          transition: 'border-color 0.3s',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
