import React, { useState } from 'react';
import { COMPETENCY_DOMAINS, IGOT_COURSES } from '../data/mockData';
import { Award, Clock, BookOpen, Sparkles, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LearnerDashboard({ activePersona, userCompetencies, onNavigate }) {
  const { t } = useLanguage();
  const [activeStatModal, setActiveStatModal] = useState(null); // 'readiness', 'hours', 'courses', 'credentials'

  // Overall score
  const allSkills = Object.values(COMPETENCY_DOMAINS).flatMap(d => d.skills);
  const overallScore = Math.round(
    (allSkills.reduce((acc, s) => acc + (userCompetencies[s.id] || 1), 0) / allSkills.length) * 20
  );

  const statDetails = {
    readiness: {
      title: "Competency Readiness Detail",
      desc: "Your overall readiness score is calculated based on your current proficiency across all official MoSPI domains compared to the expected level for your designation.",
      metrics: ["Domain Mastery: 75%", "Behavioral: 80%", "Technical: 65%"]
    },
    hours: {
      title: "Learning Hours Log",
      desc: "Total official capacity building hours logged in the iGOT Karmayogi ecosystem.",
      metrics: ["Online Modules: 8 Hours", "In-Person Workshops: 4 Hours", "Target: 50 Hours/Year"]
    },
    courses: {
      title: "Completed Courses",
      desc: "List of official courses completed to date.",
      metrics: ["IGOT-STAT-101: Advanced Sampling", "Data Privacy & DPDP Act 2023"]
    },
    credentials: {
      title: "Verified Credentials",
      desc: "Official digital badges earned through NSSTA assessments.",
      metrics: ["Gold: SNA 2008 Mastery", "Silver: Survey Methodology", "Bronze: Python for Stats"]
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Welcome Card */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ background: 'var(--saffron-main)', color: '#ffffff', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>
                Official Capacity Building Hub
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>iGOT Karmayogi Sync: Active</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Welcome back, {activePersona.name}</h2>
            <p style={{ opacity: 0.85, fontSize: '0.95rem', marginTop: '4px' }}>
              {activePersona.designation} • {activePersona.division} • MoSPI Hqrs New Delhi
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => onNavigate('RECOMMENDATIONS')} className="btn-saffron">
              <Sparkles size={16} /> View Recommended Courses
            </button>
            <button onClick={() => onNavigate('MCQ_GENERATOR')} className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}>
              <BookOpen size={16} /> Take AI Quiz
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div onClick={() => setActiveStatModal('readiness')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'background 0.2s' }} className="hover-highlight">
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Competency Readiness</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60a5fa' }}>{overallScore}%</div>
          </div>
          <div onClick={() => setActiveStatModal('hours')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'background 0.2s' }} className="hover-highlight">
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Total Learning Hours</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f97316' }}>{activePersona.learningHoursTotal} Hours</div>
          </div>
          <div onClick={() => setActiveStatModal('courses')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'background 0.2s' }} className="hover-highlight">
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Completed iGOT Courses</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#34d399' }}>{activePersona.completedCoursesCount} Modules</div>
          </div>
          <div onClick={() => setActiveStatModal('credentials')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'background 0.2s' }} className="hover-highlight">
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Verified Skill Credentials</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24' }}>8 Badges</div>
          </div>
        </div>
        <style>{`
          .hover-highlight:hover { background: rgba(255,255,255,0.05); }
        `}</style>
      </div>

      {/* Grid Layout: Active Enrolments & Competency Domain Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Active iGOT Enrolments */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--navy-primary)" />
              Active iGOT Karmayogi Enrolments
            </h3>
            <button onClick={() => onNavigate('RECOMMENDATIONS')} style={{ background: 'none', border: 'none', color: 'var(--navy-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>
              View All <ArrowRight size={14} style={{ display: 'inline' }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {IGOT_COURSES.slice(0, 3).map(course => (
              <div key={course.id} style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700' }}>{course.title}</h4>
                  <span className="badge badge-emerald">In Progress</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {course.provider} • {course.duration}
                </div>
                <div style={{ position: 'relative', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${course.id === 'IGOT-STAT-204' ? 65 : 30}%`, background: 'var(--navy-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competency Readiness by Domain */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--saffron-main)" />
            Competency Domain Mastery
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.keys(COMPETENCY_DOMAINS).map(key => {
              const d = COMPETENCY_DOMAINS[key];
              const dSkills = d.skills;
              const score = Math.round(
                (dSkills.reduce((acc, s) => acc + (userCompetencies[s.id] || 1), 0) / dSkills.length) * 20
              );

              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600' }}>
                    <span>{d.title}</span>
                    <span style={{ color: 'var(--navy-primary)' }}>{score}%</span>
                  </div>
                  <div style={{ position: 'relative', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${score}%`, background: score >= 80 ? 'var(--emerald-main)' : 'var(--saffron-main)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Stat Modal */}
      {activeStatModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setActiveStatModal(null)} />
          <div className="glass-card animate-fade-in" style={{ position: 'relative', background: 'var(--bg-card)', padding: '32px', maxWidth: '500px', width: '100%', borderRadius: '16px', zIndex: 2001 }}>
            <button onClick={() => setActiveStatModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--navy-primary)', marginBottom: '12px' }}>
              {statDetails[activeStatModal].title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
              {statDetails[activeStatModal].desc}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {statDetails[activeStatModal].metrics.map((m, idx) => (
                <div key={idx} style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="var(--emerald-main)" style={{ marginRight: '8px', display: 'inline' }} />
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
