/**
 * TypingAnimation — from magicui/typing-animation (21st.dev)
 * Types out text character by character
 */
import React, { useEffect, useState } from 'react';
import { FONTS } from '../../theme';

export default function TypingAnimation({ text, duration = 40, style = {}, cursorColor = 'rgba(255,255,255,0.5)' }) {
  const [displayed, setDisplayed] = useState('');
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setI(0);
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (i >= text.length) { setDone(true); return; }
    const t = setTimeout(() => {
      setDisplayed(text.substring(0, i + 1));
      setI(i + 1);
    }, duration);
    return () => clearTimeout(t);
  }, [i, text, duration]);

  return (
    <span style={{ fontFamily: FONTS.sans, ...style }}>
      {displayed}
      {!done && (
        <span style={{
          display: 'inline-block', width: 2, height: '1em',
          background: cursorColor, marginLeft: 2, verticalAlign: 'text-bottom',
          animation: 'blink 1s step-end infinite',
        }} />
      )}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  );
}
