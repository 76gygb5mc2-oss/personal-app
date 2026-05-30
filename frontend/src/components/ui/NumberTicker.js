/**
 * NumberTicker — from magicui/number-ticker (21st.dev)
 * Counts up to a value with spring animation when in view
 */
import React, { useEffect, useRef, useState } from 'react';
import { FONTS } from '../../theme';

export default function NumberTicker({ value, delay = 0, decimalPlaces = 0, style = {} }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [current, setCurrent] = useState(0);
  const startTime = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const duration = 1200;
      const easeOut = t => 1 - Math.pow(1 - t, 3);
      const animate = (ts) => {
        if (!startTime.current) startTime.current = ts;
        const elapsed = ts - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        setCurrent(value * easeOut(progress));
        if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay * 1000);
    return () => { clearTimeout(timeout); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [inView, value, delay]);

  const formatted = Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(current.toFixed(decimalPlaces)));

  return (
    <span ref={ref} style={{ fontFamily: FONTS.mono, tabularNums: true, ...style }}>
      {formatted}
    </span>
  );
}
