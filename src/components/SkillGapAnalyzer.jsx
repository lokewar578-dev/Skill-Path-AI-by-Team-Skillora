import React, { useState } from 'react';
import { COMPETENCY_DOMAINS } from '../data/mockData';
import { AlertTriangle, CheckCircle2, TrendingUp, ArrowRight, ShieldAlert, Target, Award, Sparkles, Lightbulb } from 'lucide-react';
import { useLearnerProgress } from '../context/LearnerProgressContext';

export default function SkillGapAnalyzer({ activePersona, userCompetencies, onNavigateToCourses }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const { getAccuracy } = useLearnerProgress();

  // Calculate gaps
  const allSkills = Object.values(COMPETENCY_DOMAINS).flatMap(d => d.skills.map(s => ({
    ...s,
    domainTitle: d.title,
    domainId: d.id,
    current: userCompetencies[s.id] || 1,
    target: activePersona.targetCompetencies?.[s.id] || 4
  })));

  const skillGaps = allSkills.map(s => {
    const gap = s.target - s.current;
    let severity = 'MET';
    if (gap >= 2) severity = 'CRITICAL';
    else if (gap === 1) severity = 'MODERATE';
    return { ...s, gap, severity };
  });

  const criticalGaps = skillGaps.filter(s => s.severity === 'CRITICAL');
  const moderateGaps = skillGaps.filter(s => s.severity === 'MODERATE');
  const metSkills = skillGaps.filter(s => s.severity === 'MET');

  const filteredList = skillGaps.filter(s => {
    if (filterSeverity === 'CRITICAL') return s.severity === 'CRITICAL';
    if (filterSeverity === 'MODERATE') return s.severity === 'MODERATE';
    if (filterSeverity === 'MET') return s.severity === 'MET';
    return true;
  });

  // Calculate domain breakdown
  const domainSummaries = Object.keys(COMPETENCY_DOMAINS).map(key => {
    const domain = COMPETENCY_DOMAINS[key];
    const dSkills = skillGaps.filter(s => s.domainId === key);
    const avgCurrent = dSkills.reduce((acc, s) => acc + s.current, 0) / dSkills.length;
    const avgTarget = dSkills.reduce((acc, s) => acc + s.target, 0) / dSkills.length;
    const gapScore = Math.max(0, Math.round(((avgTarget - avgCurrent) / 5) * 100));
    const avgAccuracy = dSkills.reduce((acc, s) => acc + getAccuracy(s.id), 0) / (dSkills.length || 1);
    return {
      title: domain.title,
      avgCurrent: avgCurrent.toFixed(1),
      avgTarget: avgTarget.toFixed(1),
      avgAccuracy,
      gapScore
    };
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner Overview */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-saffron" style={{ marginBottom: '8px' }}>
              <ShieldAlert size={14} /> MoSPI AI Skill Intelligence Analysis
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Competency Gap Matrix & Training Needs</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Evaluating existing proficiency against official framework standards for {activePersona.designation} ({activePersona.division}).
            </p>
          </div>

          <button 
            className="btn-primary" 
            onClick={onNavigateToCourses}
          >
            <Sparkles size={16} />
            Generate iGOT Karmayogi Learning Pathway
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px' }}>
          
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ef4444', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Critical Skill Gaps</span>
              <AlertTriangle size={20} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ef4444' }}>{criticalGaps.length} Skills</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Requires immediate iGOT Karmayogi intervention</p>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#d97706', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Moderate Needs</span>
              <TrendingUp size={20} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#d97706' }}>{moderateGaps.length} Skills</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Targeted NSSTA TPAC workshops suggested</p>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Target Competencies Met</span>
              <CheckCircle2 size={20} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{metSkills.length} Skills</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Qualified to mentor junior officers</p>
          </div>

        </div>
      </div>

      {/* Domain Readiness Summary */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Domain Gap Distribution</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {domainSummaries.map((d, i) => (
            <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>{d.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Current: <strong>L{d.avgCurrent}</strong></span>
                <span>Target: <strong>L{d.avgTarget}</strong></span>
              </div>
              <div style={{ position: 'relative', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${(d.avgCurrent / d.avgTarget) * 100}%`,
                    background: 'var(--navy-primary)'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Growth Trajectory & Feedback */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="var(--emerald-main)" />
          Growth Trajectory & Assessment Feedback
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Bar Graph */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Skill Growth (Pre vs Post Assessment)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {domainSummaries.slice(0, 3).map((d, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span>{d.title}</span>
                    <span style={{ color: 'var(--emerald-main)' }}>+{Math.round(d.avgAccuracy)}% Growth</span>
                  </div>
                  <div style={{ display: 'flex', height: '12px', gap: '2px' }}>
                    <div style={{ height: '100%', width: `${(d.avgCurrent / d.avgTarget) * 100}%`, background: 'var(--border-color)', borderRadius: '4px 0 0 4px' }} title="Pre Assessment" />
                    <div style={{ height: '100%', width: `15%`, background: 'var(--emerald-main)', borderRadius: '0 4px 4px 0' }} title="Post Assessment Growth" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Profile Strengths & Limitations</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong>Pros:</strong> Strong baseline in {domainSummaries[0]?.title} and high completion rate of mandated iGOT courses.
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <strong>Cons:</strong> Lacking advanced analytical skills in {domainSummaries[1]?.title}. Needs hands-on tool experience.
              </div>
            </div>
            
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>Suggested Improvements</h4>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li>Enroll in advanced iGOT courses for {domainSummaries[1]?.title}.</li>
              <li>Participate in upcoming NSSTA offline workshops.</li>
              <li>Target +2 Level growth in Data Visualization.</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Detailed Skill Gaps Table & Filter */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Competency Analysis Breakdown ({filteredList.length})</h3>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'ALL', label: 'All Skills' },
              { id: 'CRITICAL', label: '🔴 Critical Gaps' },
              { id: 'MODERATE', label: '🟡 Moderate Needs' },
              { id: 'MET', label: '🟢 Met' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilterSeverity(btn.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: filterSeverity === btn.id ? '2px solid var(--navy-primary)' : '1px solid var(--border-color)',
                  background: filterSeverity === btn.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: filterSeverity === btn.id ? 'var(--navy-primary)' : 'var(--text-muted)',
                  fontWeight: filterSeverity === btn.id ? '700' : '500',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gap Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Competency Name</th>
                <th style={{ padding: '12px 16px' }}>Domain</th>
                <th style={{ padding: '12px 16px' }}>Current Proficiency</th>
                <th style={{ padding: '12px 16px' }}>Target Cadre Standard</th>
                <th style={{ padding: '12px 16px' }}>Gap Score</th>
                <th style={{ padding: '12px 16px' }}>Action Pathway</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((skill, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>
                    {skill.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {skill.domainTitle}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: '700' }}>Level {skill.current}</span> / 5
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--navy-primary)' }}>Level {skill.target}</span> / 5
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {skill.severity === 'CRITICAL' && (
                      <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        🔴 Gap -{skill.gap} Levels
                      </span>
                    )}
                    {skill.severity === 'MODERATE' && (
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        🟡 Gap -{skill.gap} Level
                      </span>
                    )}
                    {skill.severity === 'MET' && (
                      <span className="badge badge-emerald">
                        🟢 Target Satisfied
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {skill.gap > 0 ? (
                      <button 
                        onClick={onNavigateToCourses}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--navy-primary)', 
                          fontWeight: '600', 
                          cursor: 'pointer', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          fontSize: '0.85rem'
                        }}
                      >
                        View iGOT Courses <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Competency Achieved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
