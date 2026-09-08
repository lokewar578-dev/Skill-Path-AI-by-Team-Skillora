import React, { useState } from 'react';
import { COMPETENCY_DOMAINS, OFFICIAL_PERSONAS } from '../data/mockData';
import { Award, User, Briefcase, MapPin, Sparkles, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CompetencyProfiler({ activePersona, setActivePersona, userCompetencies, setUserCompetencies }) {
  const [selectedDomain, setSelectedDomain] = useState('STATISTICAL');
  const [isEditing, setIsEditing] = useState(false);

  const handlePersonaSelect = (personaId) => {
    const found = OFFICIAL_PERSONAS.find(p => p.id === personaId);
    if (found) {
      setActivePersona(found);
      setUserCompetencies({ ...found.currentCompetencies });
    }
  };

  const handleSkillChange = (skillId, val) => {
    setUserCompetencies(prev => ({
      ...prev,
      [skillId]: Number(val)
    }));
  };

  // Compute domain score
  const domainSkills = COMPETENCY_DOMAINS[selectedDomain].skills;
  const avgDomainScore = Math.round(
    (domainSkills.reduce((acc, s) => acc + (userCompetencies[s.id] || 1), 0) / domainSkills.length) * 20
  );

  // Overall Score
  const allSkills = Object.values(COMPETENCY_DOMAINS).flatMap(d => d.skills);
  const overallScore = Math.round(
    (allSkills.reduce((acc, s) => acc + (userCompetencies[s.id] || 1), 0) / allSkills.length) * 20
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner / Persona Switcher */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(15,44,89,0.06) 0%, rgba(230,81,0,0.04) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img 
              src={activePersona.avatar} 
              alt={activePersona.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--navy-primary)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>{activePersona.name}</h2>
                <span className="badge badge-navy">{activePersona.cadre}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span><Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} />{activePersona.designation}</span>
                <span>• {activePersona.division}</span>
                <span><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />{activePersona.location}</span>
              </p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '4px' }}>
                {activePersona.education} • {activePersona.experienceYears} Years in Official Statistics
              </p>
            </div>
          </div>

          {/* Quick Persona Selector for Demo */}
          <div style={{ background: 'var(--bg-card)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Switch Official Persona (Demo)
            </label>
            <select 
              value={activePersona.id}
              onChange={(e) => handlePersonaSelect(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {OFFICIAL_PERSONAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.cadre.split(' ')[0]} - {p.division.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Competency Index Badge */}
        <div style={{ 
          marginTop: '20px', 
          paddingTop: '16px', 
          borderTop: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Official Competency Index</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--navy-primary)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                {overallScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
            <div style={{ height: '36px', width: '1px', background: 'var(--border-color)' }} />
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Cadre Proficiency Level</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--emerald-main)' }}>
                {overallScore >= 80 ? 'Master Competent' : overallScore >= 65 ? 'Advanced Proficient' : 'Intermediate Practitioner'}
              </div>
            </div>
          </div>

          <button 
            className={isEditing ? "btn-saffron" : "btn-outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Sliders size={16} />
            {isEditing ? "Done Rating Competencies" : "Self-Evaluate Competencies"}
          </button>
        </div>
      </div>

      {/* 4-Domain Tabs & Competency Evaluator */}
      <div className="glass-card" style={{ padding: '24px' }}>
        
        {/* Domain Navigation Header */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px', overflowX: 'auto' }}>
          {Object.keys(COMPETENCY_DOMAINS).map(key => {
            const domain = COMPETENCY_DOMAINS[key];
            const isSelected = selectedDomain === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDomain(key)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid var(--navy-primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  color: isSelected ? 'var(--navy-primary)' : 'var(--text-muted)',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{domain.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Domain Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{COMPETENCY_DOMAINS[selectedDomain].title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {COMPETENCY_DOMAINS[selectedDomain].description}
            </p>
          </div>
          <div className="badge badge-saffron" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            Domain Readiness: {avgDomainScore}%
          </div>
        </div>

        {/* Skills List with Rating Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {domainSkills.map(skill => {
            const currentVal = userCompetencies[skill.id] || 1;
            const targetVal = activePersona.targetCompetencies?.[skill.id] || 4;
            const levelLabels = ['1: Beginner', '2: Foundational', '3: Proficient', '4: Advanced', '5: Master Expert'];

            return (
              <div 
                key={skill.id} 
                style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  background: 'var(--bg-main)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{skill.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Target: <strong>L{targetVal}</strong></span>
                    <span style={{ 
                      fontWeight: '700', 
                      color: currentVal >= targetVal ? 'var(--emerald-main)' : 'var(--saffron-main)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: currentVal >= targetVal ? 'var(--emerald-light)' : 'var(--saffron-light)'
                    }}>
                      Current: L{currentVal} ({levelLabels[currentVal - 1].split(': ')[1]})
                    </span>
                  </div>
                </div>

                {/* Progress Bar / Interactive Slider */}
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={currentVal}
                      onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                      style={{ flex: 1, accentColor: 'var(--navy-primary)', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => handleSkillChange(skill.id, n)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: currentVal === n ? 'var(--navy-primary)' : 'var(--bg-card)',
                            color: currentVal === n ? '#ffffff' : 'var(--text-main)',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${(currentVal / 5) * 100}%`, 
                        background: currentVal >= targetVal 
                          ? 'linear-gradient(90deg, #059669 0%, #10b981 100%)' 
                          : 'linear-gradient(90deg, #e65100 0%, #f97316 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }} 
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
