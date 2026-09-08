import React, { useState, useEffect } from 'react';
import SkillPathLogo from './SkillPathLogo';
import MospiOfficialLogo from './MospiOfficialLogo';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Play, CheckCircle2, Lock } from 'lucide-react';

export default function Intro3DEntrance({ onEnter }) {
  const [progress, setProgress] = useState(0);
  const [telemetryText, setTelemetryText] = useState('Initializing Skill Path AI Core Engine...');
  const [isReady, setIsReady] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D Mouse Parallax Tilt Effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = ((clientX / width) - 0.5) * 30; // Max 30deg tilt
    const y = ((clientY / height) - 0.5) * -30;
    setTilt({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Telemetry Progress Sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(25);
      setTelemetryText('Loading MoSPI Competency Frameworks (ISS & SSS Cadres)...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(60);
      setTelemetryText('Establishing iGOT Karmayogi API & NSSTA TPAC Repository Sync...');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(90);
      setTelemetryText('Calibrating AI Document-to-MCQ RAG Assessment Core...');
    }, 1400);

    const timer4 = setTimeout(() => {
      setProgress(100);
      setTelemetryText('Skill Path AI Platform Ready! Authentication Gateway Loaded.');
      setIsReady(true);
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 50% 30%, #0b192c 0%, #030712 100%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden',
      perspective: '1200px'
    }}>
      
      {/* 3D Grid Overlay Background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        backgroundImage: `
          linear-gradient(to right, rgba(0, 242, 254, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 242, 254, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        transform: `rotateX(60deg) translateY(${tilt.y * 2}px) translateX(${tilt.x * 2}px)`,
        transformStyle: 'preserve-3d',
        opacity: 0.8,
        pointerEvents: 'none'
      }} />

      {/* Floating Ambient Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.18) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div className="intro-card" style={{
        maxWidth: '680px',
        width: '100%',
        background: 'rgba(8, 14, 26, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '28px',
        border: '1px solid rgba(0, 242, 254, 0.4)',
        boxShadow: '0 30px 80px rgba(0, 242, 254, 0.25), 0 0 40px rgba(0, 0, 0, 0.8)',
        padding: '44px 36px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d'
      }}>
        
        {/* Official Government & MoSPI Seals Strip */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <MospiOfficialLogo size={46} />
          <span className="badge badge-navy" style={{ background: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6', color: '#60a5fa', fontSize: '0.78rem' }}>
            🏛️ Government of India • MoSPI
          </span>
          <span className="badge badge-saffron" style={{ background: 'rgba(234, 88, 12, 0.2)', borderColor: '#ea580c', color: '#f97316', fontSize: '0.78rem' }}>
            SIH26101 Smart Education
          </span>
        </div>

        {/* Skill Path AI Default Logo with Crisp White Text (isDarkBg=true) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
          <SkillPathLogo size={88} showText={true} showTagline={true} isDarkBg={true} />
        </div>

        {/* Subtitle */}
        <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 28px', fontWeight: '500' }}>
          AI-Enabled Skill Intelligence & Capacity Building Platform for Official Statistics & Public Administration.
        </p>

        {/* Telemetry Progress Bar */}
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(0, 242, 254, 0.2)', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: '700', color: '#00f2fe', marginBottom: '8px' }}>
            <span>{telemetryText}</span>
            <span>{progress}%</span>
          </div>

          <div style={{ position: 'relative', height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #0052D4 0%, #00d2ff 50%, #00f2fe 100%)',
              boxShadow: '0 0 14px #00f2fe',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* 3D Action Launch Button */}
        <button
          onClick={onEnter}
          className="btn-saffron"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '16px 28px',
            fontSize: '1.1rem',
            fontWeight: '800',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            color: '#040914',
            border: 'none',
            boxShadow: '0 10px 30px rgba(0, 242, 254, 0.4)',
            cursor: 'pointer',
            transform: isReady ? 'scale(1)' : 'scale(0.98)',
            opacity: isReady ? 1 : 0.85,
            transition: 'all 0.3s ease'
          }}
        >
          <Lock size={20} color="#040914" />
          ENTER SKILL PATH AI PLATFORM
          <ArrowRight size={22} color="#040914" />
        </button>

        {/* Quick Direct Link */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={onEnter}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Authenticate Official Access Portal →
          </button>
        </div>

      </div>

    </div>
  );
}
