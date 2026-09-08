/**
 * CompetencyNode.jsx
 * Custom React Flow node component for KCM competency graph.
 *
 * Status colours:
 *   PROFICIENT    → Green  #10B981
 *   GAP           → Amber  #F59E0B
 *   CRITICAL_PATH → Red    #EF4444
 *   LOCKED        → Grey   #6B7280
 */
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NODE_STATUS, KCM_PILLARS } from '../../data/kcmFracData';

// Proficiency bar (5 segments)
function ProficiencyBar({ current, required, color }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((lvl) => (
        <div
          key={lvl}
          style={{
            flex: 1,
            height: '5px',
            borderRadius: '3px',
            background:
              lvl <= current
                ? color
                : lvl <= required
                ? `${color}33`  // faint required overlay
                : 'rgba(148,163,184,0.2)',
            transition: 'background 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

const ICONS = {
  PROFICIENT:    '✅',
  GAP:           '⚠️',
  CRITICAL_PATH: '🔴',
  LOCKED:        '🔒',
};

function CompetencyNode({ data, selected }) {
  const { comp, current, required, status, prereqsMet } = data;
  const statusMeta  = NODE_STATUS[status] ?? NODE_STATUS.LOCKED;
  const pillarMeta  = KCM_PILLARS[comp.pillar];

  const borderColor  = selected ? '#00f2fe' : statusMeta.color;
  const bgColor      = statusMeta.bg;
  const textOpacity  = status === 'LOCKED' ? 0.6 : 1;
  const isLocked     = status === 'LOCKED';

  return (
    <>
      {/* Source handle — other nodes hook into this */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: statusMeta.color,
          border: '2px solid #1e293b',
          width: 10,
          height: 10,
        }}
      />

      <div
        style={{
          width: 210,
          background: '#0f172a',
          border: `2px solid ${borderColor}`,
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: selected
            ? `0 0 0 3px rgba(0,242,254,0.3), 0 8px 24px ${statusMeta.color}40`
            : `0 4px 16px ${statusMeta.color}22`,
          opacity: textOpacity,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
        title={comp.description}
      >
        {/* Top accent bar (pillar colour) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: pillarMeta.color,
            borderRadius: '12px 12px 0 0',
          }}
        />

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '4px' }}>
          <div style={{ flex: 1, paddingRight: '6px' }}>
            {/* Pillar badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 7px',
                borderRadius: '20px',
                background: pillarMeta.lightColor,
                border: `1px solid ${pillarMeta.borderColor}`,
                fontSize: '0.6rem',
                fontWeight: '700',
                color: pillarMeta.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
              }}
            >
              {pillarMeta.label}
            </div>

            {/* Competency short name */}
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                color: '#f1f5f9',
                lineHeight: '1.3',
                wordBreak: 'break-word',
              }}
            >
              {comp.shortName}
            </div>

            {/* FRAC code */}
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>
              {comp.kcmCode}
            </div>
          </div>

          {/* Status icon */}
          <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{ICONS[status]}</div>
        </div>

        {/* Proficiency bar + levels */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
              {isLocked
                ? prereqsMet === false
                  ? 'Prerequisites needed'
                  : 'Not required this role'
                : `Level ${current} / ${required} required`}
            </span>
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: '700',
                color: statusMeta.color,
                background: statusMeta.bg,
                padding: '1px 6px',
                borderRadius: '8px',
              }}
            >
              {statusMeta.label}
            </span>
          </div>
          <ProficiencyBar current={current} required={required} color={statusMeta.color} />
        </div>

        {/* Lock overlay blur stripe */}
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(3,7,18,0.12)',
              backdropFilter: 'blur(0.5px)',
              borderRadius: '12px',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: statusMeta.color,
          border: '2px solid #1e293b',
          width: 10,
          height: 10,
        }}
      />
    </>
  );
}

export default memo(CompetencyNode);
