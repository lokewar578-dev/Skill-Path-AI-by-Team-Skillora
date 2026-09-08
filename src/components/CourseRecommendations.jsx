import React, { useState } from 'react';
import { IGOT_COURSES, NSSTA_TPAC_PROGRAMS, COMPETENCY_DOMAINS } from '../data/mockData';
import { BookOpen, ShieldCheck, CheckCircle, ExternalLink, AlertTriangle, ArrowRight, MapPin, Calendar, Briefcase, Award } from 'lucide-react';
import { useLearnerProgress } from '../context/LearnerProgressContext';

const ISS_RANKS = [
  { id: 'JSO', label: 'Junior Statistical Officer (JSO)', type: 'SSS' },
  { id: 'SSO', label: 'Senior Statistical Officer (SSO)', type: 'SSS' },
  { id: 'AD', label: 'Assistant Director (AD)', type: 'ISS' },
  { id: 'DD', label: 'Deputy Director (DD)', type: 'ISS' },
  { id: 'JD', label: 'Joint Director (JD)', type: 'ISS' },
  { id: 'DIR', label: 'Director (DIR)', type: 'ISS' },
  { id: 'DDG', label: 'Deputy Director General (DDG)', type: 'ISS' },
  { id: 'ADG', label: 'Additional Director General (ADG)', type: 'ISS' },
  { id: 'DG', label: 'Director General (DG)', type: 'ISS' }
];

export default function CourseRecommendations({ activePersona, userCompetencies }) {
  const [enrolledCourses, setEnrolledCourses] = useState(['IGOT-STAT-204', 'TPAC-2026-01']);
  const [enrollingId, setEnrollingId] = useState(null);
  const { getAccuracy } = useLearnerProgress();

  // Identify identified gaps
  const allSkills = Object.values(COMPETENCY_DOMAINS).flatMap(d => d.skills);
  const gapSkills = allSkills.filter(s => {
    const accuracy = getAccuracy(s.id) || 0;
    const current = Math.max(userCompetencies[s.id] || 1, Math.floor(accuracy / 20) + 1);
    const target = activePersona.targetCompetencies?.[s.id] || 4;
    return current < target;
  }).map(s => s.id);

  const handleEnroll = (courseId) => {
    setEnrollingId(courseId);
    setTimeout(() => {
      setEnrolledCourses(prev => [...prev, courseId]);
      setEnrollingId(null);
    }, 800);
  };

  // Determine current rank index based on designation
  let currentRankIndex = 0;
  if (activePersona.designation?.includes('Senior Statistical Officer') || activePersona.designation?.includes('SSO')) currentRankIndex = 1;
  else if (activePersona.designation?.includes('Assistant Director') || activePersona.designation?.includes('AD')) currentRankIndex = 2;
  else if (activePersona.designation?.includes('Deputy Director General') || activePersona.designation?.includes('DDG')) currentRankIndex = 6;
  else if (activePersona.designation?.includes('Additional Director General') || activePersona.designation?.includes('ADG')) currentRankIndex = 7;
  else if (activePersona.designation?.includes('Director General') || activePersona.designation?.includes('DG')) currentRankIndex = 8;
  else if (activePersona.designation?.includes('Director') && !activePersona.designation?.includes('Deputy')) currentRankIndex = 5;
  else if (activePersona.designation?.includes('Joint Director') || activePersona.designation?.includes('JD')) currentRankIndex = 4;
  else if (activePersona.designation?.includes('Deputy Director') || activePersona.designation?.includes('DD')) currentRankIndex = 3;

  const mctpPrograms = NSSTA_TPAC_PROGRAMS.filter(p => p.isMandatory || p.id.includes('MCTP'));
  const gapDirectives = IGOT_COURSES.filter(c => gapSkills.includes(c.relatedSkill));
  
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Official MoSPI Header */}
      <div style={{ padding: '24px', background: '#0F2C59', color: 'white', borderRadius: '12px', borderLeft: '6px solid #D4AF37', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <ShieldCheck size={24} color="#D4AF37" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#CBD5E1' }}>
                MoSPI • ISS Cadre Management Division
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '6px' }}>ISS Official Training & Progression Pathway</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              Statutory Mid-Career Training Programmes (MCTP) and FRAC/KCM Competency Directives for {activePersona.name}, {activePersona.designation}.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Cadre Status:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10B981' }}>Active • KCM Synced</span>
          </div>
        </div>
      </div>

      {/* Stepping Stone Roadmap */}
      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--navy-primary)' }}>
          <Award size={20} /> Cadre Progression Map
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '16px', gap: '4px' }}>
          {ISS_RANKS.map((rank, idx) => {
            const isCompleted = idx < currentRankIndex;
            const isCurrent = idx === currentRankIndex;
            const isNext = idx === currentRankIndex + 1;
            
            let circleBg = 'var(--bg-main)';
            let circleColor = 'var(--text-muted)';
            let circleBorder = '2px solid var(--border-color)';
            
            if (isCompleted) {
              circleBg = '#10B981';
              circleColor = 'white';
              circleBorder = '2px solid #10B981';
            } else if (isCurrent) {
              circleBg = 'var(--navy-primary)';
              circleColor = 'white';
              circleBorder = '2px solid var(--navy-primary)';
            } else if (isNext) {
              circleBg = 'rgba(245, 158, 11, 0.1)';
              circleColor = '#F59E0B';
              circleBorder = '2px dashed #F59E0B';
            }

            return (
              <div key={rank.id} style={{ display: 'flex', alignItems: 'center', minWidth: '120px', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 2, flex: 1 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: circleBg, color: circleColor, border: circleBorder,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '0.8rem', zIndex: 2
                  }}>
                    {isCompleted ? <CheckCircle size={16} /> : (idx + 1)}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: isCurrent || isNext ? '800' : '600', color: isCurrent ? 'var(--navy-primary)' : isNext ? '#F59E0B' : 'var(--text-main)' }}>
                      {rank.id}
                    </div>
                    {isCurrent && (
                      <div style={{ fontSize: '0.65rem', background: 'var(--navy-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>CURRENT</div>
                    )}
                    {isNext && (
                      <div style={{ fontSize: '0.65rem', background: '#F59E0B', color: 'white', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>NEXT PROMOTION</div>
                    )}
                  </div>
                </div>
                {/* Connector Line */}
                {idx < ISS_RANKS.length - 1 && (
                  <div style={{ 
                    height: '2px', 
                    flex: 1, 
                    background: isCompleted ? '#10B981' : 'var(--border-color)',
                    marginTop: '-40px',
                    zIndex: 1
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Mandatory MCTP Section */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', borderTop: '4px solid #EF4444' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
            <AlertTriangle size={20} /> Mandatory Mid-Career Training (NSSTA)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
            Completion of the following residential programmes at NSSTA is strictly required prior to your promotion to the next cadre grade.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mctpPrograms.map(prog => {
              const isEnrolled = enrolledCourses.includes(prog.id);
              return (
                <div key={prog.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', background: 'var(--bg-main)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.4 }}>{prog.title}</h4>
                    {isEnrolled ? (
                      <span className="badge badge-emerald" style={{ whiteSpace: 'nowrap' }}><CheckCircle size={14}/> Nominated</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', whiteSpace: 'nowrap' }}>Action Required</span>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} /> <strong>Next Batch:</strong> {prog.nextBatch}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <MapPin size={14} /> <strong>Venue:</strong> {prog.organizer}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleEnroll(prog.id)}
                      disabled={isEnrolled || enrollingId === prog.id}
                      style={{ 
                        background: isEnrolled ? '#10B981' : '#0F2C59', 
                        color: 'white', padding: '8px 16px', borderRadius: '8px', 
                        fontSize: '0.85rem', fontWeight: '600', cursor: isEnrolled ? 'default' : 'pointer',
                        border: 'none', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      {enrollingId === prog.id ? 'Processing...' : isEnrolled ? 'Nomination Pending' : 'Request Cadre Nomination'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Competency Gap Directives (iGOT) */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', borderTop: '4px solid #F59E0B' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B' }}>
            <BookOpen size={20} /> KCM Gap Directives (iGOT)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
            Online modules mandated via iGOT Karmayogi to fulfill identified competency gaps based on your current FRAC/KCM assessment.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {gapDirectives.length > 0 ? gapDirectives.slice(0, 3).map(course => {
              const isEnrolled = enrolledCourses.includes(course.id);
              return (
                <div key={course.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', background: 'var(--bg-main)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.4 }}>{course.title}</h4>
                    {isEnrolled && <CheckCircle size={18} color="#10B981" />}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--navy-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={12} /> Domain: {course.domain}
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.duration}</span>
                    {isEnrolled ? (
                      <a href={course.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--navy-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Resume Module <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button 
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingId === course.id}
                        style={{ 
                          background: 'transparent', color: '#F59E0B', border: '1px solid #F59E0B', 
                          padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        {enrollingId === course.id ? 'Loading...' : 'Start on iGOT'}
                      </button>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', color: '#10B981' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontWeight: '700' }}>100% KCM Compliant</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>No pending mandatory gap directives found for your current role.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
