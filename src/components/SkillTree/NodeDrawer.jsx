/**
 * NodeDrawer.jsx
 * Slide-in drill-down drawer that opens when a competency node is clicked.
 * Shows: metadata, current vs required level, linked iGOT courses, and
 * a direct "Start Assessment" trigger.
 */
import React from 'react';
import { NODE_STATUS, KCM_PILLARS } from '../../data/kcmFracData';
import { IGOT_COURSES, NSSTA_TPAC_PROGRAMS } from '../../data/mockData';
import {
  X, BookOpen, Award, ExternalLink, Target, TrendingUp,
  Lock, CheckCircle2, AlertTriangle, Clock, Star,
} from 'lucide-react';

function Level5Bar({ value, max = 5, color }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: '10px',
            borderRadius: '4px',
            background: i < value ? color : 'rgba(148,163,184,0.15)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

export default function NodeDrawer({ node, onClose, onStartQuiz }) {
  if (!node) return null;

  const { comp, current, required, status } = node.data;
  const statusMeta = NODE_STATUS[status] ?? NODE_STATUS.LOCKED;
  const pillarMeta = KCM_PILLARS[comp.pillar];

  // Linked iGOT courses
  const linkedCourses = IGOT_COURSES.filter((c) => comp.igotCourseIds?.includes(c.id));
  // Linked NSSTA programs
  const linkedTpac    = NSSTA_TPAC_PROGRAMS.filter((p) => comp.nsstaProgIds?.includes(p.id));

  const gap = Math.max(0, required - current);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(2,6,23,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 998,
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(480px, 95vw)',
          background: '#0f172a',
          borderLeft: '1px solid rgba(0,242,254,0.2)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'slideInRight 0.28s ease',
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div
          style={{
            padding: '20px 20px 16px',
            background: 'rgba(15,23,42,0.95)',
            borderBottom: `3px solid ${pillarMeta.color}`,
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>

          {/* Pillar pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: pillarMeta.lightColor,
              border: `1px solid ${pillarMeta.borderColor}`,
              color: pillarMeta.color,
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            {pillarMeta.label} Pillar
          </div>

          <h3 style={{ color: '#f1f5f9', fontSize: '1.15rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '4px' }}>
            {comp.name}
          </h3>
          <div style={{ color: '#64748b', fontSize: '0.72rem', fontFamily: 'monospace' }}>
            {comp.kcmCode}
          </div>

          {/* Status badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '10px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: statusMeta.bg,
              border: `1px solid ${statusMeta.color}`,
              color: statusMeta.color,
              fontSize: '0.75rem',
              fontWeight: '700',
            }}
          >
            {status === 'PROFICIENT'    && <CheckCircle2 size={13} />}
            {status === 'GAP'           && <AlertTriangle size={13} />}
            {status === 'CRITICAL_PATH' && <AlertTriangle size={13} />}
            {status === 'LOCKED'        && <Lock size={13} />}
            {statusMeta.label}
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Description */}
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.65' }}>
            {comp.description}
          </p>

          {/* Current vs Required proficiency */}
          <div
            style={{
              background: 'rgba(15,30,60,0.6)',
              border: '1px solid rgba(100,116,139,0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: statusMeta.color }}>{current}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Your Level</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
                <TrendingUp size={20} />
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f1f5f9' }}>{required}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Required Level</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>→</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: gap > 0 ? '#F59E0B' : '#10B981',
                  }}
                >
                  {gap > 0 ? `+${gap}` : '✓'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {gap > 0 ? 'Gap to close' : 'Achieved'}
                </div>
              </div>
            </div>

            <Level5Bar value={current} color={statusMeta.color} />

            {gap > 0 && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  color: '#fbbf24',
                  fontSize: '0.78rem',
                }}
              >
                <Target size={13} style={{ display: 'inline', marginRight: '5px' }} />
                Estimated time to close gap: <strong>{gap <= 1 ? '1–2 months' : gap <= 2 ? '2–4 months' : '4–6 months'}</strong>
              </div>
            )}
          </div>

          {/* Prerequisites */}
          {comp.prerequisites.length > 0 && (
            <div>
              <h4 style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Prerequisites
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {comp.prerequisites.map((pid) => (
                  <span
                    key={pid}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: 'rgba(100,116,139,0.15)',
                      border: '1px solid rgba(100,116,139,0.3)',
                      color: '#94a3b8',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                    }}
                  >
                    {pid}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* iGOT Courses */}
          {linkedCourses.length > 0 && (
            <div>
              <h4 style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} color="#0F6FE8" /> iGOT Karmayogi Courses
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {linkedCourses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(15,111,232,0.06)',
                      border: '1px solid rgba(15,111,232,0.2)',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      style={{ width: 48, height: 48, borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#e2e8f0', lineHeight: '1.3' }}>
                        {course.title}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '0.68rem', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} /> {course.duration}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Star size={10} color="#f59e0b" /> {course.rating}
                        </span>
                        <span>{course.level}</span>
                      </div>
                    </div>
                    <a
                      href={course.url || 'https://igotkarmayogi.gov.in/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flexShrink: 0,
                        padding: '5px 10px',
                        borderRadius: '7px',
                        background: '#0F6FE8',
                        color: '#fff',
                        textDecoration: 'none',
                        border: 'none',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Enrol <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NSSTA TPAC Programs */}
          {linkedTpac.length > 0 && (
            <div>
              <h4 style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} color="#F59E0B" /> NSSTA TPAC Workshops
              </h4>
              {linkedTpac.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fbbf24' }}>{p.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>{p.organizer}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px' }}>
                    Next batch: {p.nextBatch} • {p.seatsAvailable} seats
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No linked resources */}
          {linkedCourses.length === 0 && linkedTpac.length === 0 && (
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(100,116,139,0.08)',
                border: '1px solid rgba(100,116,139,0.2)',
                color: '#64748b',
                fontSize: '0.8rem',
                textAlign: 'center',
              }}
            >
              On-the-job training & peer-learning recommended for this competency. Check back as the iGOT catalogue expands.
            </div>
          )}

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {gap > 0 && (
              <button
                onClick={() => onStartQuiz && onStartQuiz(comp.id)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                🧠 Take AI Self-Assessment Quiz
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'transparent',
                color: '#64748b',
                border: '1px solid rgba(100,116,139,0.3)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
