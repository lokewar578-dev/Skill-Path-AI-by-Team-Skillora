/**
 * AdaptiveDifficultyBadge.jsx
 * Visual badge showing the learner's current adaptive tier with
 * accuracy context — displayed in the quiz configurator panel.
 */
import React from 'react';
import { DIFFICULTY_TIERS } from '../../data/adaptiveQuizData';
import { TrendingUp, Brain, Target } from 'lucide-react';

export default function AdaptiveDifficultyBadge({
  tier,        // 'T12' | 'T3' | 'T45'
  accuracy,    // 0–100
  attemptCount,
  compact = false,
}) {
  const meta = DIFFICULTY_TIERS[tier] ?? DIFFICULTY_TIERS.T3;

  if (compact) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px',
          borderRadius: '20px',
          background: meta.bg,
          border: `1px solid ${meta.border}`,
          color: meta.color,
          fontSize: '0.72rem',
          fontWeight: '700',
        }}
      >
        {meta.emoji} {meta.label}
      </span>
    );
  }

  return (
    <div
      style={{
        borderRadius: '12px',
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={18} color={meta.color} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: meta.color }}>
              {meta.emoji} {meta.label} Tier
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
              {meta.sublabel} · Accuracy {meta.accuracyRange}
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            color: meta.color,
          }}
        >
          {accuracy}%
        </div>
      </div>

      {/* Accuracy bar */}
      <div>
        <div style={{ height: '6px', borderRadius: '4px', background: 'rgba(100,116,139,0.15)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${accuracy}%`,
              background: meta.color,
              borderRadius: '4px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        {/* Tier markers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
          <span style={{ fontSize: '0.58rem', color: '#475569' }}>0%</span>
          <span style={{ fontSize: '0.58rem', color: tier === 'T12' ? meta.color : '#475569', fontWeight: tier === 'T12' ? '700' : '400' }}>Novice &lt;60%</span>
          <span style={{ fontSize: '0.58rem', color: tier === 'T3' ? meta.color : '#475569', fontWeight: tier === 'T3' ? '700' : '400' }}>Intermediate 60–80%</span>
          <span style={{ fontSize: '0.58rem', color: tier === 'T45' ? meta.color : '#475569', fontWeight: tier === 'T45' ? '700' : '400' }}>Expert &gt;80%</span>
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5' }}>
        <Target size={11} style={{ display: 'inline', marginRight: '4px' }} />
        {meta.description}
      </div>

      {/* Bloom verbs */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {meta.bloomVerbs.map((verb) => (
          <span
            key={verb}
            style={{
              padding: '2px 8px',
              borderRadius: '20px',
              background: `${meta.color}15`,
              border: `1px solid ${meta.color}30`,
              color: meta.color,
              fontSize: '0.62rem',
              fontWeight: '700',
            }}
          >
            {verb}
          </span>
        ))}
      </div>

      {/* Attempt count */}
      {attemptCount > 0 && (
        <div style={{ fontSize: '0.68rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <TrendingUp size={11} />
          Based on {Math.min(attemptCount, 10)} recent quiz attempts
        </div>
      )}
    </div>
  );
}
