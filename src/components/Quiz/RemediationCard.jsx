/**
 * RemediationCard.jsx
 * Shown after quiz submission for INCORRECT answers.
 * Displays: explanation text, structured citation block, and
 * a "Preview Source" button that opens the DocumentPreviewDrawer.
 */
import React, { useState } from 'react';
import { AlertTriangle, BookOpen, FileText, ChevronDown, ChevronUp, ExternalLink, CheckCircle } from 'lucide-react';
import DocumentPreviewDrawer from './DocumentPreviewDrawer';

export default function RemediationCard({ question, userAnswerIdx, isCorrect }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { citation, explanation, options, correctAnswer } = question;

  const userAnswer   = options[userAnswerIdx];
  const correctAns   = options[correctAnswer];

  const themeColor = isCorrect ? '#10B981' : '#EF4444';
  const themeBg = isCorrect ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)';
  const themeHeaderBg = isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
  const themeBorder = isCorrect ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)';
  const themeHeaderBorder = isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';

  return (
    <>
      <div
        style={{
          marginTop: '16px',
          borderRadius: '14px',
          overflow: 'hidden',
          border: `1px solid ${themeBorder}`,
          background: themeBg,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            background: themeHeaderBg,
            borderBottom: `1px solid ${themeHeaderBorder}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded((v) => !v)}
          role="button"
          aria-expanded={expanded}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isCorrect ? <CheckCircle size={16} color={themeColor} /> : <AlertTriangle size={16} color={themeColor} />}
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: themeColor }}>
              {isCorrect ? 'Correct — Explanation & Source Reference' : 'Incorrect — Remediation & Source Reference'}
            </span>
          </div>
          {expanded ? <ChevronUp size={16} color={themeColor} /> : <ChevronDown size={16} color={themeColor} />}
        </div>

        {expanded && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Your answer vs Correct answer */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#EF4444', marginBottom: '4px', textTransform: 'uppercase' }}>
                  ❌ Your Answer
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4', fontWeight: '500' }}>
                  {userAnswer ?? '(not answered)'}
                </div>
              </div>
              <div
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)',
                }}
              >
                <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#10B981', marginBottom: '4px', textTransform: 'uppercase' }}>
                  ✅ Correct Answer
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4', fontWeight: '500' }}>
                  {correctAns}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <BookOpen size={12} /> Conceptual Explanation
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-main)', lineHeight: '1.7', margin: 0 }}>
                {explanation}
              </p>
            </div>

            {/* Source Citation Block */}
            {citation && (
              <div
                style={{
                  borderRadius: '10px',
                  border: '1px solid rgba(15,111,232,0.35)',
                  overflow: 'hidden',
                }}
              >
                {/* Citation header */}
                <div
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(15,111,232,0.1)',
                    borderBottom: '1px solid rgba(15,111,232,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                  }}
                >
                  <FileText size={13} color="#0F6FE8" />
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#0F6FE8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Grounded Source Citation
                  </span>
                </div>

                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Structured metadata */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {[
                      { label: 'Document', value: citation.sourceTitle },
                      { label: 'Chapter / Section', value: citation.chapterOrSection },
                      { label: 'Page Reference', value: citation.pageNumber },
                      { label: 'Chunk ID', value: citation.chunkId },
                    ].map((item) => (
                      <div key={item.label}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '1px', lineHeight: '1.3' }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verbatim excerpt */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(15,111,232,0.06)',
                      borderLeft: '3px solid #0F6FE8',
                      margin: '2px 0',
                    }}
                  >
                    <div style={{ fontSize: '0.62rem', fontWeight: '700', color: '#0F6FE8', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Verbatim Excerpt
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                      "{citation.excerpt}"
                    </p>
                  </div>

                  {/* Preview button */}
                  <button
                    onClick={() => setDrawerOpen(true)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'rgba(15,111,232,0.12)',
                      border: '1px solid rgba(15,111,232,0.3)',
                      color: '#0F6FE8',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <ExternalLink size={13} /> Preview Source Document Chunk
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Preview Drawer */}
      {drawerOpen && citation && (
        <DocumentPreviewDrawer
          citation={citation}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
