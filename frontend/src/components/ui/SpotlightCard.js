/**
 * SpotlightCard — inspired by aceternity/spotlight from 21st.dev
 * Dark minimal — white spotlight follows mouse
 */
import React, { useRef, useState } from 'react';
import { D, FONTS } from '../../theme';

export default function SpotlightCard({
  children,
  style = {},
  spotlightSize = 300,
}) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - left, y: e.clientY - top, opacity: 1 });
  };
  const handleMouseLeave = () => setPos(p => ({ ...p, opacity: 0 }));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        background: D.bg2,
        border: `1px solid ${D.border1}`,
        fontFamily: FONTS.sans,
        ...style,
      }}
    >
      {/* White spotlight */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: pos.opacity,
        transition: 'opacity 0.4s ease',
        background: `radial-gradient(${spotlightSize}px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.05), transparent 60%)`,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
