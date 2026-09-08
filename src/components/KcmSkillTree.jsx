/**
 * KcmSkillTree.jsx
 * Top-level "iGOT KCM / FRAC Skill Roadmap" page.
 *
 * Layout:
 *   ┌───────────────────────────────────────────────────┐
 *   │  Header banner + role context bar                 │
 *   ├─────────────────────────────┬─────────────────────┤
 *   │  React Flow DAG canvas      │  Role Simulator     │
 *   │  (SkillTreeGraph)           │  sidebar panel      │
 *   └─────────────────────────────┴─────────────────────┘
 *   NodeDrawer overlay (slides in from right on click)
 */
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';

import SkillTreeGraph from './SkillTree/SkillTreeGraph';
import RoleSimulator  from './SkillTree/RoleSimulator';
import NodeDrawer     from './SkillTree/NodeDrawer';
import { KCM_COMPETENCIES, ROLE_PROFILES, ROLE_ORDER } from '../data/kcmFracData';
import { computeCriticalPath } from './SkillTree/kcmLayout';
import { Network, TrendingUp, Sparkles, Info } from 'lucide-react';

// ── Derive current role from persona cadre + designation ────────────────────
function inferRoleId(persona) {
  if (!persona) return 'SSO';
  const des = (persona.designation || '').toLowerCase();
  if (des.includes('deputy director general') || des.includes('ddg')) return 'DDG';
  if (des.includes('deputy director') || des.includes('dy.'))          return 'DSP';
  if (des.includes('director'))                                         return 'DSP';
  if (des.includes('statistical research'))                             return 'SRO';
  if (des.includes('senior statistical'))                               return 'SSO';
  if (des.includes('junior statistical'))                               return 'JSO';
  return 'SSO';
}

// ── Infer the next tier role as default target ───────────────────────────────
function inferNextRole(currentRoleId) {
  const idx = ROLE_ORDER.indexOf(currentRoleId);
  if (idx < 0 || idx >= ROLE_ORDER.length - 1) return ROLE_ORDER[ROLE_ORDER.length - 1];
  return ROLE_ORDER[idx + 1];
}

export default function KcmSkillTree({ activePersona }) {
  const userScores    = activePersona?.currentCompetencies ?? {};
  const currentRoleId = inferRoleId(activePersona);
  const [targetRoleId, setTargetRoleId] = useState(() => inferNextRole(currentRoleId));
  const [selectedNode, setSelectedNode]  = useState(null);
  const [sidebarOpen, setSidebarOpen]    = useState(true);

  // Target role competency levels
  const targetProfile = useMemo(
    () => ROLE_PROFILES[targetRoleId]?.competencyLevels ?? {},
    [targetRoleId]
  );

  // Critical path (BFS over gap nodes)
  const criticalPath = useMemo(
    () => computeCriticalPath(KCM_COMPETENCIES, userScores, targetProfile),
    [userScores, targetProfile]
  );

  // Gap counts for header badges
  const { profCount, gapCount, lockedCount } = useMemo(() => {
    let prof = 0, gap = 0, locked = 0;
    KCM_COMPETENCIES.forEach((c) => {
      const cur = userScores[c.id] ?? 0;
      const req = targetProfile[c.id] ?? 0;
      if (req === 0)     locked++;
      else if (cur >= req) prof++;
      else                gap++;
    });
    return { profCount: prof, gapCount: gap, lockedCount: locked };
  }, [userScores, targetProfile]);

  const navigate = useNavigate();

  const handleNodeSelect = useCallback((node) => setSelectedNode(node), []);
  const handleCloseDrawer = useCallback(() => setSelectedNode(null), []);

  const handleStartQuiz = useCallback((competencyId) => {
    setSelectedNode(null);
    navigate('/dashboard/mcq-generator');
  }, [navigate]);

  const currentRole  = ROLE_PROFILES[currentRoleId];
  const targetRole   = ROLE_PROFILES[targetRoleId];

  return (
    <div
      className="animate-fade-in"
      style={{ display: 'flex', flexDirection: 'column', gap: '18px', height: '100%' }}
    >
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(15,111,232,0.06) 50%, rgba(15,118,110,0.06) 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <span
              className="badge"
              style={{
                marginBottom: '8px',
                background: 'rgba(124,58,237,0.12)',
                color: '#7C3AED',
                border: '1px solid rgba(124,58,237,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: '700',
              }}
            >
              <Network size={12} /> KCM / FRAC Interactive Skill Roadmap
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: '1.3', color: 'var(--text-main)' }}>
              iGOT Karmayogi Competency DAG
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Visualising {activePersona?.name ?? 'your'}'s competency graph against the{' '}
              <strong style={{ color: 'var(--navy-primary)' }}>{targetRole?.title}</strong> role profile.
            </p>
          </div>

          {/* Header stat pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'Proficient',   value: profCount,   color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
              { label: 'Gaps',         value: gapCount,    color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
              { label: 'Locked',       value: lockedCount, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
              { label: 'Critical Path',value: criticalPath.length, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  textAlign: 'center',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: s.bg,
                  border: `1px solid ${s.color}30`,
                  minWidth: '72px',
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{s.label}</div>
              </div>
            ))}

            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(124,58,237,0.3)',
                background: sidebarOpen ? 'rgba(124,58,237,0.12)' : 'transparent',
                color: sidebarOpen ? '#7C3AED' : '#64748b',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <TrendingUp size={14} />
              {sidebarOpen ? 'Hide' : 'Show'} Role Simulator
            </button>
          </div>
        </div>

        {/* Role context bar */}
        <div
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
          }}
        >
          <Info size={14} color="#64748b" />
          <span style={{ color: '#64748b' }}>Career Path:</span>
          <span
            style={{
              padding: '3px 12px',
              borderRadius: '20px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: '#10B981',
              fontWeight: '700',
            }}
          >
            {currentRole?.title ?? currentRoleId}
          </span>
          <span style={{ color: '#475569' }}>→</span>
          <span
            style={{
              padding: '3px 12px',
              borderRadius: '20px',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.25)',
              color: '#F59E0B',
              fontWeight: '700',
            }}
          >
            {targetRole?.title ?? targetRoleId}
          </span>
          <span style={{ color: '#475569', marginLeft: '4px', fontSize: '0.75rem' }}>
            · Click any node to drill down · Edges show prerequisite dependencies
          </span>
        </div>
      </div>

      {/* ── Main Layout: Graph + Sidebar ─────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: sidebarOpen ? '1fr 320px' : '1fr',
          gap: '16px',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* React Flow Graph */}
        <div style={{ minHeight: '560px', position: 'relative' }}>
          <ReactFlowProvider>
            <SkillTreeGraph
              userScores={userScores}
              targetRoleId={targetRoleId}
              targetProfile={targetProfile}
              criticalPath={criticalPath}
              onNodeSelect={handleNodeSelect}
            />
          </ReactFlowProvider>
        </div>

        {/* Role Simulator Sidebar */}
        {sidebarOpen && (
          <div
            style={{
              overflowY: 'auto',
              maxHeight: '720px',
              paddingRight: '2px',
            }}
          >
            <RoleSimulator
              currentRoleId={currentRoleId}
              targetRoleId={targetRoleId}
              onTargetRoleChange={setTargetRoleId}
              userScores={userScores}
              criticalPath={criticalPath}
            />
          </div>
        )}
      </div>

      {/* Node Drawer */}
      {selectedNode && (
        <NodeDrawer
          node={selectedNode}
          onClose={handleCloseDrawer}
          onStartQuiz={handleStartQuiz}
        />
      )}
    </div>
  );
}
