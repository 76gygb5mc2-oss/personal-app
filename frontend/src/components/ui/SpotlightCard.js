/**
 * SpotlightCard — inspired by aceternity/spotlight from 21st.dev
 * Mouse-tracking spotlight glow effect for section headers/hero areas
 * Converted to React + inline styles for Sirawdink OS
 */
import React, { useRef, useState } from 'react';
import { D } from '../../theme';

export default function SpotlightCard({
  children,
  style = {},
  spotlightColor = D.text2,
  spotlightSize = 350,
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
        borderRadius: 20,
        background: 'rgba(13,38,24,0.72)',
        border: '1px solid rgba(148,204,171,0.12)',
        backdropFilter: 'blur(20px)',
        ...style,
      }}
    >
      {/* Spotlight gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: pos.opacity,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(${spotlightSize}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}18, transparent 60%)`,
        }}
      />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
