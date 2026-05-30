/**
 * GlowButton — inspired by aceternity/moving-border from 21st.dev
 * Dark minimal style — white on black
 */
import React, { useState } from 'react';
import { D, FONTS } from '../../theme';

export default function GlowButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'ghost' | 'danger'
  size = 'md',
  fullWidth = false,
  disabled = false,
  style = {},
  startIcon = null,
  endIcon = null,
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sizes = {
    sm: { px: '12px', py: '7px', fontSize: '0.78rem', borderRadius: 7, gap: 5 },
    md: { px: '18px', py: '10px', fontSize: '0.85rem', borderRadius: 8, gap: 7 },
    lg: { px: '24px', py: '13px', fontSize: '0.95rem', borderRadius: 10, gap: 8 },
  };

  const variants = {
    primary: {
      background: hovered ? D.bg4 : D.bg3,
      color: D.text1,
      border: `1px solid ${hovered ? D.border3 : D.border2}`,
      boxShadow: hovered ? '0 0 20px rgba(255,255,255,0.06)' : 'none',
    },
    ghost: {
      background: hovered ? D.bg2 : 'transparent',
      color: hovered ? D.text2 : D.text3,
      border: `1px solid ${hovered ? D.border2 : D.border1}`,
      boxShadow: 'none',
    },
    danger: {
      background: hovered ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.06)',
      color: hovered ? '#f87171' : '#ef4444',
      border: `1px solid ${hovered ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)'}`,
      boxShadow: 'none',
    },
  };

  const s = sizes[size];
  const v = variants[variant];

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: `${s.py} ${s.px}`,
        fontSize: s.fontSize,
        fontWeight: 500,
        borderRadius: s.borderRadius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        transform: pressed ? 'scale(0.98)' : 'none',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.4 : 1,
        letterSpacing: '0.2px',
        fontFamily: FONTS.sans,
        outline: 'none',
        ...v,
        ...style,
      }}
    >
      {startIcon && <span style={{ display: 'flex', alignItems: 'center', fontSize: '1em' }}>{startIcon}</span>}
      {children}
      {endIcon && <span style={{ display: 'flex', alignItems: 'center', fontSize: '1em' }}>{endIcon}</span>}
    </button>
  );
}
