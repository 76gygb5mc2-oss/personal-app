/**
 * ShinyText — from magicui/animated-shiny-text (21st.dev)
 * Shimmer sweep effect across text
 */
import React from 'react';
import { FONTS } from '../../theme';

export default function ShinyText({ children, shimmerWidth = 120, style = {}, className = '' }) {
  return (
    <>
      <style>{`
        @keyframes shinyText {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shiny-text {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.4) 0%,
            rgba(255,255,255,0.4) 40%,
            rgba(255,255,255,1) 50%,
            rgba(255,255,255,0.4) 60%,
            rgba(255,255,255,0.4) 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shinyText 3s linear infinite;
        }
      `}</style>
      <span className={`shiny-text ${className}`} style={{ fontFamily: FONTS.sans, ...style }}>
        {children}
      </span>
    </>
  );
}
