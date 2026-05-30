/**
 * WordRotate — from magicui/word-rotate (21st.dev)
 * Cycles through words with fade+slide animation
 */
import React, { useEffect, useState } from 'react';
import { FONTS } from '../../theme';

export default function WordRotate({ words, duration = 2500, style = {} }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setAnimating(true);
      setTimeout(() => {
        setIndex(i => (i + 1) % words.length);
        setVisible(true);
        setAnimating(false);
      }, 300);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span style={{
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      fontFamily: FONTS.sans,
      ...style,
    }}>
      <span style={{
        display: 'inline-block',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : animating ? 'translateY(8px)' : 'translateY(-8px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}>
        {words[index]}
      </span>
    </span>
  );
}
