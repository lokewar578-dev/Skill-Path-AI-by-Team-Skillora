/**
 * DocumentPreviewDrawer.jsx
 * Slide-in drawer showing the verbatim source document chunk
 * linked from a citation, so the officer can review the manual
 * without leaving the quiz workflow.
 */
import React from 'react';
import { X, FileText, BookOpen, Hash, AlignLeft } from 'lucide-react';

export default function DocumentPreviewDrawer({ citation, onClose }) {
  if (!citation) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2,6,23,0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 1100,
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Source Document Preview"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '55vh',
          background: '#0f172a',
          borderTop: '2px solid rgba(15,111,232,0.4)',
          borderRadius: '20px 20px 0 0',
          zIndex: 1101,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
          animation: 'slideUpDrawer 0.28s ease',
        }}
      >
        <style>{`
          @keyframes slideUpDrawer {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        {/* Handle bar */}
        <div
          style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            background: 'rgba(100,116,139,0.4)',
            margin: '12px auto 0',
            flexShrink: 0,
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid rgba(15,111,232,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
            <FileText size={20} color="#0F6FE8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.68rem', color: '#0F6FE8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Source Document Preview
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f1f5f9', lineHeight: '1.3', marginTop: '2px' }}>
                {citation.sourceTitle}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Metadata chips row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { icon: <BookOpen size={11} />, label: citation.chapterOrSection },
              { icon: <Hash size={11} />,     label: `Pages: ${citation.pageNumber}` },
              { icon: <AlignLeft size={11} />, label: `Chunk: ${citation.chunkId}` },
            ].map((chip) => (
              <div
                key={chip.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(15,111,232,0.08)',
                  border: '1px solid rgba(15,111,232,0.2)',
                  color: '#60a5fa',
                  fontSize: '0.72rem',
                  fontWeight: '600',
                }}
              >
                {chip.icon}
                <span>{chip.label}</span>
              </div>
            ))}
          </div>

          {/* Verbatim excerpt — highlighted */}
          <div
            style={{
              background: 'rgba(2,6,23,0.6)',
              border: '1px solid rgba(15,111,232,0.25)',
              borderRadius: '12px',
              padding: '16px 18px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '16px',
                background: '#0F6FE8',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Verbatim Excerpt
            </div>

            <p
              style={{
                fontSize: '0.88rem',
                color: '#e2e8f0',
                lineHeight: '1.8',
                margin: '8px 0 0',
                fontStyle: 'italic',
                borderLeft: '3px solid #0F6FE8',
                paddingLeft: '12px',
              }}
            >
              {citation.excerpt}
            </p>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              fontSize: '0.72rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
            }}
          >
            <span style={{ flexShrink: 0 }}>ℹ️</span>
            <span>
              This excerpt is grounded to{' '}
              <strong style={{ color: '#64748b' }}>{citation.sourceTitle}</strong>,{' '}
              {citation.chapterOrSection}, {citation.pageNumber}.
              The full document is accessible via the MoSPI Document Repository and iGOT Karmayogi Knowledge Library.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
