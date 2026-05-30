/**
 * GlowButton — inspired by aceternity/button styles from 21st.dev
 * Animated gradient border + hover glow button
 * Converted to React + inline styles for Sirawdink OS
 */
import React, { useState } from 'react';
import { D } from '../../theme';

export default function GlowButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'ghost' | 'danger'
  size = 'md',         // 'sm' | 'md' | 'lg'
  fullWidth = false,
  disabled = false,
  style = {},
  startIcon = null,
  endIcon = null,
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sizes = {
    sm: { px: '14px', py: '8px', fontSize: '0.8rem', borderRadius: 10, gap: 6 },
    md: { px: '20px', py: '11px', fontSize: '0.875rem', borderRadius: 12, gap: 8 },
    lg: { px: '28px', py: '14px', fontSize: '1rem', borderRadius: 14, gap: 10 },
  };

  const variants = {
    primary: {
      background: hovered
        ? `linear-gradient(135deg, ${D.bg3} 0%, ${D.bg2} 100%)`
        : `linear-gradient(135deg, ${D.bg2} 0%, ${G.forestMid} 100%)`,
      color: D.text1,
      border: `1px solid ${hovered ? D.text2 + '60' : 'rgba(148,204,171,0.2)'}`,
      boxShadow: hovered
        ? `0 0 20px ${D.text2}40, 0 4px 16px rgba(0,0,0,0.4)`
        : `0 2px 8px rgba(0,0,0,0.3)`,
    },
    ghost: {
      background: hovered ? 'rgba(71,133,89,0.15)' : 'transparent',
      color: hovered ? D.text2 : 'rgba(232,245,238,0.6)',
      border: `1px solid ${hovered ? 'rgba(148,204,171,0.3)' : 'rgba(148,204,171,0.12)'}`,
      boxShadow: hovered ? `0 0 12px ${D.text2}20` : 'none',
    },
    danger: {
      background: hovered ? 'rgba(220,50,50,0.2)' : 'rgba(220,50,50,0.1)',
      color: hovered ? '#ff8a8a' : '#f08080',
      border: `1px solid ${hovered ? 'rgba(248,113,113,0.4)' : 'rgba(248,113,113,0.15)'}`,
      boxShadow: hovered ? '0 0 12px rgba(220,50,50,0.2)' : 'none',
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
        fontWeight: 600,
        borderRadius: s.borderRadius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        transform: pressed ? 'scale(0.97)' : hovered ? 'translateY(-1px)' : 'none',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1,
        letterSpacing: '0.3px',
        fontFamily: 'inherit',
        outline: 'none',
        backdropFilter: 'blur(8px)',
        ...v,
        ...style,
      }}
    >
      {startIcon && <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.1em' }}>{startIcon}</span>}
      {children}
      {endIcon && <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.1em' }}>{endIcon}</span>}
    </button>
  );
}
