import React, { useState } from 'react';
import { DIVISION_HEATMAP_DATA, COMPETENCY_DOMAINS } from '../data/mockData';
import { Building2, Users, AlertTriangle, TrendingUp, Download, Sparkles, ShieldCheck, FileCheck, Layers } from 'lucide-react';

export default function AdminDashboard() {
  const [selectedDivision, setSelectedDivision] = useState(DIVISION_HEATMAP_DATA[0]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(7,25,56,0.95) 0%, rgba(15,44,89,0.95) 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-saffron" style={{ marginBottom: '8px' }}>
              MoSPI Executive Cadre Intelligence Portal
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>National Statistical Workforce Competency Dashboard</h2>
            <p style={{ opacity: 0.85, fontSize: '0.9rem', marginTop: '4px' }}>
              Organization-wide monitoring across Indian Statistical Service (ISS) & Subordinate Statistical Service (SSS) cadres.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-saffron">
              <Download size={16} /> Export Annual TNI Report (PDF)
            </button>
          </div>
        </div>

        {/* Executive Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Total Cadre Strength</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>1,260 Officers</div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Active iGOT Enrolment Rate</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#34d399' }}>88.4%</div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Priority Training Needs Flagged</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f87171' }}>168 Officers</div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>NSSTA Workshops Completed</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24' }}>42 Batches</div>
          </div>
        </div>
      </div>

      {/* Division Heatmap & Detailed Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Division List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--navy-primary)" />
            MoSPI Division Competency Heatmap
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DIVISION_HEATMAP_DATA.map(div => {
              const isSelected = selectedDivision.code === div.code;
              return (
                <div
                  key={div.code}
                  onClick={() => setSelectedDivision(div)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--navy-primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{div.division}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {div.totalOfficers} Officers • Primary Gap: <strong>{div.topGap}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--navy-primary)' }}>
                      {div.avgProficiency} / 5
                    </div>
                    <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.7rem' }}>
                      {div.urgentCount} Flagged
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Division Insights */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-navy">Division Audit</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '4px' }}>{selectedDivision.division}</h3>
            </div>
            <button className="btn-outline" style={{ fontSize: '0.8rem' }}>
              Assign Group iGOT Course
            </button>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--navy-primary)' }}>Training Need Identification (TNI) Summary</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
              Based on recent competency self-evaluations, <strong>{selectedDivision.urgentCount} officers</strong> in {selectedDivision.code} require immediate capacity building in <strong>{selectedDivision.topGap}</strong> to meet upcoming digital survey mandates.
            </p>
          </div>

          {/* Predictive Workforce Capabilities */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--saffron-main)" /> Predictive Technology Readiness (2026-2027)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { skill: 'AI/ML Automated Survey Coding', current: '32% Ready', status: '🔴 Critical Capacity Action' },
              { skill: 'GIS Remote Sensing Frame Design', current: '58% Ready', status: '🟡 Moderate Training Needed' },
              { skill: 'DPDP Act Microdata Anonymization', current: '84% Ready', status: '🟢 High Compliance' }
            ].map((pred, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{pred.skill}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{pred.current}</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pred.status}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
