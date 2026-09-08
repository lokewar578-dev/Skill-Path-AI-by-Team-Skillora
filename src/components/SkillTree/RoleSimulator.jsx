/**
 * RoleSimulator.jsx
 * Career progression simulator panel.
 * Lets the officer select a target role and shows:
 *   - Role description & tier badge
 *   - Gap count summary (critical / moderate / met)
 *   - Step-by-step Capacity Building Plan (CBP)
 *   - Timeline estimate to promotional readiness
 */
import React, { useMemo } from 'react';
import { ROLE_PROFILES, ROLE_ORDER, KCM_COMPETENCIES, CBP_TIMELINES } from '../../data/kcmFracData';
import { IGOT_COURSES } from '../../data/mockData';
import { TrendingUp, Target, AlertTriangle, CheckCircle2, Lock, ChevronRight, Clock, Sparkles } from 'lucide-react';

// ── Small utility ─────────────────────────────────────────────────────────────
function Pill({ children, color, bg, border }) {
  return (
    <span
      style={{
        padding: '2px 10px',
        borderRadius: '20px',
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: '0.7rem',
        fontWeight: '700',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export default function RoleSimulator({
  currentRoleId,
  targetRoleId,
  onTargetRoleChange,
  userScores,
  criticalPath,
}) {
  const targetRole = ROLE_PROFILES[targetRoleId];
  const currentRole = ROLE_PROFILES[currentRoleId];

  // ── Gap engine ────────────────────────────────────────────────────────────
  const gaps = useMemo(() => {
    if (!targetRole) return [];
    return KCM_COMPETENCIES.map((comp) => {
      const current  = userScores[comp.id]              ?? 0;
      const required = targetRole.competencyLevels[comp.id] ?? 0;
      const gap      = Math.max(0, required - current);
      const isCrit   = criticalPath.includes(comp.id);
      return { comp, current, required, gap, isCrit };
    }).filter((g) => g.required > 0);
  }, [targetRole, userScores, criticalPath]);

  const critGaps   = gaps.filter((g) => g.gap > 0 && g.isCrit);
  const modGaps    = gaps.filter((g) => g.gap > 0 && !g.isCrit);
  const metItems   = gaps.filter((g) => g.gap === 0);

  // Estimated months: 2 per critical gap level, 1 per moderate
  const estimatedMonths = useMemo(() => {
    const critMonths = critGaps.reduce((a, g) => a + g.gap * 2, 0);
    const modMonths  = modGaps.reduce((a, g)  => a + g.gap,     0);
    return Math.max(1, Math.ceil((critMonths + modMonths) / 2));
  }, [critGaps, modGaps]);

  // CBP steps: prioritise critical-path first, sorted by gap ascending
  const cbpSteps = useMemo(() => {
    return [...critGaps, ...modGaps]
      .sort((a, b) => {
        if (a.isCrit !== b.isCrit) return a.isCrit ? -1 : 1;
        return b.gap - a.gap;
      })
      .slice(0, 8); // show top 8 actions
  }, [critGaps, modGaps]);

  const tierColors = ['', '#10B981', '#0F6FE8', '#7C3AED', '#F59E0B', '#EF4444'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
      }}
    >
      {/* ── Role Selector ────────────────────────────────────────── */}
      <div
        style={{
          background: 'rgba(15,23,42,0.85)',
          border: '1px solid rgba(0,242,254,0.15)',
          borderRadius: '14px',
          padding: '16px',
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '10px',
          }}
        >
          🎯 Simulate Promotion To
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ROLE_ORDER.map((rId) => {
            const role  = ROLE_PROFILES[rId];
            const isSelected = rId === targetRoleId;
            const isCurrent  = rId === currentRoleId;
            const tierColor  = tierColors[role.tier] ?? '#94a3b8';

            return (
              <button
                key={rId}
                onClick={() => onTargetRoleChange(rId)}
                disabled={isCurrent}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: isSelected
                    ? `2px solid ${tierColor}`
                    : '1px solid rgba(100,116,139,0.2)',
                  background: isSelected
                    ? `${tierColor}18`
                    : isCurrent
                    ? 'rgba(16,185,129,0.06)'
                    : 'transparent',
                  cursor: isCurrent ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.18s ease',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: `${tierColor}22`,
                    border: `2px solid ${tierColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: tierColor,
                    flexShrink: 0,
                  }}
                >
                  T{role.tier}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      color: isSelected ? tierColor : '#cbd5e1',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {role.title}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#475569' }}>{role.cadre}</div>
                </div>
                {isCurrent && (
                  <Pill color="#10B981" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.3)">
                    Current
                  </Pill>
                )}
                {isSelected && !isCurrent && (
                  <ChevronRight size={14} color={tierColor} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Gap Summary ──────────────────────────────────────────── */}
      {targetRole && (
        <div
          style={{
            background: 'rgba(15,23,42,0.85)',
            border: '1px solid rgba(100,116,139,0.2)',
            borderRadius: '14px',
            padding: '14px',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <TrendingUp size={13} /> Readiness for {targetRole.title.split('(')[0].trim()}
          </div>

          {/* 3-stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {[
              { label: 'Critical Gaps', value: critGaps.length, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
              { label: 'Moderate Gaps', value: modGaps.length,  color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
              { label: 'Skills Met',    value: metItems.length,  color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  textAlign: 'center',
                  padding: '10px 4px',
                  borderRadius: '10px',
                  background: s.bg,
                  border: `1px solid ${s.color}30`,
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Readiness progress bar */}
          {(() => {
            const total     = gaps.length;
            const readyPct  = total > 0 ? Math.round((metItems.length / total) * 100) : 100;
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Promotional Readiness</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: readyPct >= 80 ? '#10B981' : readyPct >= 50 ? '#F59E0B' : '#EF4444' }}>
                    {readyPct}%
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '6px', background: 'rgba(100,116,139,0.15)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${readyPct}%`,
                      borderRadius: '6px',
                      background: readyPct >= 80 ? '#10B981' : readyPct >= 50 ? '#F59E0B' : '#EF4444',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            );
          })()}

          {/* Time estimate */}
          <div
            style={{
              marginTop: '10px',
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'rgba(0,242,254,0.04)',
              border: '1px solid rgba(0,242,254,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#94a3b8',
            }}
          >
            <Clock size={13} color="#00f2fe" />
            <span>
              Estimated promotion readiness:{' '}
              <strong style={{ color: '#00f2fe' }}>~{estimatedMonths} months</strong>
            </span>
          </div>
        </div>
      )}

      {/* ── Capacity Building Plan (CBP) ─────────────────────────── */}
      {cbpSteps.length > 0 && (
        <div
          style={{
            background: 'rgba(15,23,42,0.85)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '14px',
            padding: '14px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#7C3AED',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={13} /> AI Capacity Building Plan
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {cbpSteps.map((step, idx) => {
              const linked = IGOT_COURSES.find((c) => step.comp.igotCourseIds?.includes(c.id));
              const color  = step.isCrit ? '#EF4444' : '#F59E0B';

              return (
                <div
                  key={step.comp.id}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    padding: '10px',
                    borderRadius: '10px',
                    background: `${color}08`,
                    border: `1px solid ${color}25`,
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: `${color}22`,
                      border: `1.5px solid ${color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      color,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#e2e8f0' }}>
                      {step.comp.shortName}
                    </div>
                    <div style={{ fontSize: '0.67rem', color: '#64748b', marginTop: '2px' }}>
                      Raise Level {step.current} → {step.required}
                      {step.isCrit && (
                        <span style={{ color: '#EF4444', fontWeight: '700', marginLeft: '4px' }}>
                          · Critical Path
                        </span>
                      )}
                    </div>
                    {linked && (
                      <div
                        style={{
                          marginTop: '5px',
                          fontSize: '0.65rem',
                          color: '#0F6FE8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        📘 iGOT: {linked.title.slice(0, 42)}…
                      </div>
                    )}
                  </div>

                  {/* Time badge */}
                  <div
                    style={{
                      padding: '2px 7px',
                      borderRadius: '20px',
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                      color,
                      fontSize: '0.62rem',
                      fontWeight: '700',
                      flexShrink: 0,
                    }}
                  >
                    {CBP_TIMELINES[step.gap] ?? '1M'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All met state */}
      {cbpSteps.length === 0 && targetRole && (
        <div
          style={{
            textAlign: 'center',
            padding: '24px',
            borderRadius: '14px',
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.25)',
          }}
        >
          <CheckCircle2 size={40} color="#10B981" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10B981' }}>Promotion Ready!</div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
            All competency levels meet the requirements for {targetRole.title}.
          </div>
        </div>
      )}
    </div>
  );
}
