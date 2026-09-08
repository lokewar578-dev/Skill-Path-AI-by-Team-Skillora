import React from 'react';

/**
 * Skill Path AI Official Default Logo Component
 * Tagline: LEARN | BUILD | GROW | BEYOND
 * Renders glowing neon gradient ring, S-shaped road path, ascending figure reaching for star, circuit nodes, and text
 * Supports isDarkBg prop to ensure 100% crisp text contrast on both dark & light backgrounds
 */
export default function SkillPathLogo({ size = 48, showText = true, showTagline = false, isDarkBg = false, className = '' }) {
  // Determine text colors for maximum contrast and legibility
  const textColor = isDarkBg ? '#ffffff' : 'var(--text-main)';
  const taglineColor = isDarkBg ? '#94a3b8' : 'var(--text-muted)';

  return (
    <div className={`skill-path-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      
      {/* SVG Emblem matching uploaded logo */}
      <div style={{ 
        position: 'relative', 
        width: `${size}px`, 
        height: `${size}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))' }}
        >
          <defs>
            {/* Gradient for Outer Neon Circle Ring */}
            <linearGradient id="neonCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0052D4" />
              <stop offset="50%" stopColor="#4364F7" />
              <stop offset="100%" stopColor="#6FB1FC" />
            </linearGradient>

            {/* Gradient for 'S' Path Ribbon */}
            <linearGradient id="sRibbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0052D4" />
              <stop offset="40%" stopColor="#00d2ff" />
              <stop offset="100%" stopColor="#00f2fe" />
            </linearGradient>

            {/* Star Glow Filter */}
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Black Circular Background */}
          <circle cx="100" cy="100" r="96" fill="#040914" />
          
          {/* Neon Ring Boundary */}
          <circle cx="100" cy="100" r="92" stroke="url(#sRibbonGrad)" strokeWidth="3.5" opacity="0.95" />

          {/* Circuit Board Trace Nodes at Bottom Left */}
          <path d="M 45 130 L 65 130 L 75 120 M 45 142 L 72 142 M 45 154 L 60 154 L 70 148" stroke="#00f2fe" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <circle cx="75" cy="120" r="3" fill="#00f2fe" />
          <circle cx="72" cy="142" r="3" fill="#00f2fe" />
          <circle cx="70" cy="148" r="3" fill="#00f2fe" />

          {/* 'S' Ribbon Road Path */}
          <path 
            d="M 68 152 C 120 152 145 125 125 102 C 105 80 82 72 108 44 C 122 28 140 32 145 35" 
            stroke="url(#sRibbonGrad)" 
            strokeWidth="20" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />

          {/* White Dashed Road Lines down the S path center */}
          <path 
            d="M 68 152 C 120 152 145 125 125 102 C 105 80 82 72 108 44 C 122 28 140 32 145 35" 
            stroke="#FFFFFF" 
            strokeWidth="2.5" 
            strokeDasharray="6 6" 
            strokeLinecap="round" 
            fill="none" 
            opacity="0.95" 
          />

          {/* Ascending Human Figure on Path */}
          {/* Head */}
          <circle cx="126" cy="40" r="5" fill="#FFFFFF" />
          {/* Body & Legs */}
          <path d="M 124 45 L 115 57 M 124 45 L 128 58 M 124 47 L 138 34" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />

          {/* Target Star at Top Right */}
          <polygon 
            points="142,22 145,28 152,29 147,34 148,41 142,37 136,41 137,34 132,29 139,28" 
            fill="#00f2fe" 
            filter="url(#starGlow)"
          />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            fontSize: size >= 48 ? '1.4rem' : size >= 40 ? '1.25rem' : '1.05rem', 
            fontWeight: '800', 
            color: textColor, 
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{ color: textColor }}>Skill Path</span>
            <span style={{ 
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontWeight: '900'
            }}>
              AI
            </span>
          </div>

          {showTagline && (
            <span style={{ 
              fontSize: '0.68rem', 
              fontWeight: '700', 
              color: taglineColor, 
              letterSpacing: '0.18em', 
              textTransform: 'uppercase',
              marginTop: '4px'
            }}>
              LEARN | BUILD | GROW | BEYOND
            </span>
          )}
        </div>
      )}

    </div>
  );
}
