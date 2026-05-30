/**
 * BackgroundGradient — inspired by aceternity/background-gradient from 21st.dev
 * Dark minimal — subtle white animated gradient border
 */
import React, { useRef, useEffect } from 'react';
import { D, FONTS } from '../../theme';

export default function BackgroundGradient({
  children,
  animate = true,
  style = {},
  innerStyle = {},
  borderWidth = 1,
}) {
  const gradRef = useRef(null);
  const rafRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    if (!animate || !gradRef.current) return;
    const tick = () => {
      posRef.current = (posRef.current + 0.4) % 360;
      if (gradRef.current) {
        const pct = Math.abs(Math.sin((posRef.current * Math.PI) / 180)) * 100;
        gradRef.current.style.backgroundSize = '400% 400%';
        gradRef.current.style.backgroundPosition = `${pct}% ${pct}%`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animate]);

  return (
    <div style={{ position: 'relative', padding: borderWidth, borderRadius: 14, ...style }}>
      <div ref={gradRef} style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: 1,
        background: `radial-gradient(circle farthest-side at 0% 100%, rgba(255,255,255,0.12), transparent),
          radial-gradient(circle farthest-side at 100% 0%, rgba(255,255,255,0.07), transparent),
          radial-gradient(circle farthest-side at 100% 100%, rgba(255,255,255,0.10), transparent),
          radial-gradient(circle farthest-side at 0% 0%, rgba(255,255,255,0.05), #0e0e0e)`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        padding: borderWidth,
      }} />
      <div style={{
        position: 'relative', zIndex: 2, borderRadius: 13,
        background: D.bg2, overflow: 'hidden',
        fontFamily: FONTS.sans, ...innerStyle,
      }}>
        {children}
      </div>
    </div>
  );
}
