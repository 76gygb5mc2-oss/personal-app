/**
 * BackgroundGradient — inspired by aceternity/background-gradient from 21st.dev
 * Animated conic gradient border that cycles — converted for React + green forest theme
 */
import React, { useRef, useEffect } from 'react';
import { D } from '../../theme';

export default function BackgroundGradient({
  children,
  animate = true,
  style = {},
  innerStyle = {},
  borderWidth = 2,
}) {
  const gradRef = useRef(null);
  const rafRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    if (!animate || !gradRef.current) return;

    const tick = () => {
      posRef.current = (posRef.current + 0.3) % 360;
      if (gradRef.current) {
        gradRef.current.style.background = `
          radial-gradient(circle farthest-side at 0% 100%, ${D.text2}88, transparent),
          radial-gradient(circle farthest-side at 100% 0%, ${D.bg3}88, transparent),
          radial-gradient(circle farthest-side at 100% 100%, ${G.sage}66, transparent),
          radial-gradient(circle farthest-side at 0% 0%, ${D.bg2}88, #0d2618)
        `;
        gradRef.current.style.backgroundSize = '400% 400%';
        const pct = Math.abs(Math.sin((posRef.current * Math.PI) / 180)) * 100;
        gradRef.current.style.backgroundPosition = `${pct}% ${pct}%`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animate]);

  return (
    <div style={{ position: 'relative', padding: borderWidth, borderRadius: 20, ...style }}>
      {/* Animated gradient layer */}
      <div
        ref={gradRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          opacity: 0.7,
          filter: 'blur(12px)',
          zIndex: 0,
          transition: 'opacity 0.5s',
          background: `radial-gradient(circle farthest-side at 0% 100%, ${D.text2}88, transparent)`,
        }}
      />
      {/* Second layer (non-blurred for sharp border) */}
      <div
        ref={gradRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          zIndex: 1,
          background: `radial-gradient(circle farthest-side at 0% 100%, ${D.text2}88, transparent),
            radial-gradient(circle farthest-side at 100% 0%, ${D.bg3}88, transparent),
            radial-gradient(circle farthest-side at 100% 100%, ${G.sage}66, transparent),
            radial-gradient(circle farthest-side at 0% 0%, ${D.bg2}88, #0d2618)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: borderWidth,
        }}
      />
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderRadius: 18,
          background: 'rgba(13,38,24,0.85)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
