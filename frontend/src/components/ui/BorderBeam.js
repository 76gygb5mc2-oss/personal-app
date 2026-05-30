/**
 * BorderBeam — from magicui/border-beam (21st.dev)
 * Animated light beam that travels around a card border
 */
import React, { useEffect, useRef } from 'react';

export default function BorderBeam({
  size = 120,
  duration = 4,
  colorFrom = 'rgba(255,255,255,0.8)',
  colorTo = 'transparent',
  borderWidth = 1,
  borderRadius = 14,
  style = {},
}) {
  return (
    <>
      <style>{`
        @keyframes borderBeam {
          0%   { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .border-beam-inner {
          position: absolute;
          aspect-ratio: 1;
          width: ${size}px;
          background: linear-gradient(to left, ${colorFrom}, ${colorTo});
          offset-path: rect(0 auto auto 0 round ${borderRadius}px);
          animation: borderBeam ${duration}s linear infinite;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: borderRadius,
        border: `${borderWidth}px solid transparent`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}>
        <div className="border-beam-inner" />
      </div>
    </>
  );
}
