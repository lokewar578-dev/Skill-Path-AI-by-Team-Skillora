/**
 * SkillTreeGraph.jsx
 * Core React Flow canvas for the KCM competency DAG.
 *
 * Features:
 *  - Dagre hierarchical layout (auto-fit on load & role change)
 *  - Custom CompetencyNode with Green / Amber / Red / Grey status
 *  - Pillar swimlane filter (Behavioural | Functional | Domain | All)
 *  - MiniMap, Controls, Background panel
 *  - onNodeClick → opens NodeDrawer
 *  - Re-layouts when targetRoleId or pillarFilter changes
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CompetencyNode from './CompetencyNode';
import { KCM_COMPETENCIES, KCM_PILLARS, NODE_STATUS } from '../../data/kcmFracData';
import { buildGraphElements, applyDagreLayout } from './kcmLayout';

// ── Node type registry ───────────────────────────────────────────────────────
const NODE_TYPES = { competencyNode: CompetencyNode };

// ── MiniMap node colour helper ────────────────────────────────────────────────
function miniMapNodeColor(node) {
  return NODE_STATUS[node.data?.status]?.color ?? '#6B7280';
}

// ── Inner canvas component (needs ReactFlowProvider context) ─────────────────
function FlowCanvas({ nodes, edges, onNodeClick, onNodesChange, onEdgesChange }) {
  const { fitView } = useReactFlow();

  // Auto-fit whenever nodes array changes (role switch, filter change)
  useEffect(() => {
    const t = setTimeout(() => {
      fitView({ padding: 0.15, duration: 500, maxZoom: 1.2 });
    }, 120);
    return () => clearTimeout(t);
  }, [nodes.length, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={NODE_TYPES}
      fitView
      fitViewOptions={{ padding: 0.15, maxZoom: 1.2 }}
      minZoom={0.25}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      style={{ background: 'transparent' }}
      defaultEdgeOptions={{
        type: 'smoothstep',
        markerEnd: { type: 'arrowclosed', color: '#475569' },
      }}
    >
      <Background color="rgba(100,116,139,0.12)" gap={28} size={1.5} />
      <Controls
        style={{
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(0,242,254,0.15)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      />
      <MiniMap
        nodeColor={miniMapNodeColor}
        style={{
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(0,242,254,0.15)',
          borderRadius: '10px',
        }}
        maskColor="rgba(2,6,23,0.6)"
        nodeStrokeWidth={0}
      />
    </ReactFlow>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'rgba(15,23,42,0.92)',
        border: '1px solid rgba(0,242,254,0.15)',
        borderRadius: '10px',
        padding: '10px 14px',
        display: 'flex',
        gap: '14px',
        flexWrap: 'wrap',
        zIndex: 10,
        backdropFilter: 'blur(8px)',
      }}
    >
      {Object.values(NODE_STATUS).map((s) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: s.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{s.label}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '20px', height: '2px', background: '#EF4444', borderRadius: '2px' }} />
        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Critical Path</span>
      </div>
    </div>
  );
}

// ── Pillar filter tabs ────────────────────────────────────────────────────────
function PillarTabs({ active, onChange }) {
  const tabs = [
    { id: 'ALL', label: 'All Pillars', color: '#00f2fe' },
    ...Object.values(KCM_PILLARS).map((p) => ({ id: p.id, label: p.label, color: p.color })),
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '5px 14px',
            borderRadius: '20px',
            border: active === tab.id ? `2px solid ${tab.color}` : '1px solid rgba(100,116,139,0.3)',
            background: active === tab.id ? `${tab.color}18` : 'transparent',
            color: active === tab.id ? tab.color : '#64748b',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Main exported component ───────────────────────────────────────────────────
export default function SkillTreeGraph({
  userScores,
  targetRoleId,
  targetProfile,
  criticalPath,
  onNodeSelect,
}) {
  const [pillarFilter, setPillarFilter] = useState('ALL');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const isFirstRender = useRef(true);

  // ── Build & layout graph whenever role or filter changes ──────────────────
  useEffect(() => {
    const filtered =
      pillarFilter === 'ALL'
        ? KCM_COMPETENCIES
        : KCM_COMPETENCIES.filter((c) => c.pillar === pillarFilter);

    // Only include edges between nodes that are in the filtered set
    const filteredIds = new Set(filtered.map((c) => c.id));

    const { nodes: rawNodes, edges: rawEdges } = buildGraphElements(
      filtered,
      userScores,
      targetProfile,
      criticalPath
    );

    // Filter edges to only those connecting visible nodes
    const visibleEdges = rawEdges.filter(
      (e) => filteredIds.has(e.source) && filteredIds.has(e.target)
    );

    const { nodes: laidOut } = applyDagreLayout(rawNodes, visibleEdges, 'TB');

    setNodes(laidOut);
    setEdges(visibleEdges);
  }, [pillarFilter, userScores, targetProfile, criticalPath]);

  // ── Handle node click ─────────────────────────────────────────────────────
  const handleNodeClick = useCallback(
    (event, node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '10px 14px',
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(0,242,254,0.12)',
          borderRadius: '12px',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}
        >
          KCM Pillar:
        </span>
        <PillarTabs active={pillarFilter} onChange={setPillarFilter} />

        {/* Node count badge */}
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.7rem',
            color: '#475569',
          }}
        >
          {nodes.length} competencies · {edges.length} dependency edges
        </span>
      </div>

      {/* React Flow canvas */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(0,242,254,0.12)',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(15,23,42,0.98) 0%, rgba(2,6,23,1) 100%)',
          minHeight: '520px',
        }}
      >
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
        <Legend />
      </div>
    </div>
  );
}
