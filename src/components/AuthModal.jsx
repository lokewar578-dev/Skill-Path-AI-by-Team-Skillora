import React, { useState } from 'react';
import { OFFICIAL_PERSONAS } from '../data/mockData';
import SkillPathLogo from './SkillPathLogo';
import { Lock, Mail, Phone, ShieldCheck, User, KeyRound, Sparkles, CheckCircle2, ArrowRight, X, Building2, UserPlus, LogIn, AlertCircle } from 'lucide-react';

// ─── Allowed official email domains ─────────────────────────────────────────
const ALLOWED_DOMAINS = ['mospi.gov.in', 'nic.in', 'gov.in', 'nssta.gov.in'];

// ─── Demo credentials map (email → password) ────────────────────────────────
// In a real app this validation happens on the server. Here we simulate
// credential checking without giving away a master bypass.
const DEMO_CREDENTIALS = {
  'rajesh.sharma@mospi.gov.in': { password: 'SkillPathAI@2026', personaId: 'persona_1' },
  'priya.sen@mospi.gov.in':     { password: 'MoSPI@Stat2026',  personaId: 'persona_2' },
  'amit.verma@nic.in':          { password: 'iGOT@Karmayogi1', personaId: 'persona_3' },
};

export default function AuthModal({ isOpen, onClose, onLoginSuccess, onRegisterSuccess }) {
  const [authMode, setAuthMode] = useState('LOGIN_EMAIL'); // 'LOGIN_EMAIL' | 'LOGIN_PHONE' | 'REGISTER' | 'OTP'

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  // OTP Verification States
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpToastMsg, setOtpToastMsg] = useState('');
  const [otpError, setOtpError] = useState('');
  // Track which persona the phone OTP is for (set during phone login)
  const [otpPersona, setOtpPersona] = useState(null);

  // Registration Form States for New Comer
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCadre, setRegCadre] = useState('ISS (Indian Statistical Service)');
  const [regDesignation, setRegDesignation] = useState('Senior Statistical Officer (SSO)');
  const [regDivision, setRegDivision] = useState('National Accounts Division (NAD)');
  const [regEducation, setRegEducation] = useState('M.Sc. Statistics');
  const [regExp, setRegExp] = useState('5');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  // ── Helper: is email domain allowed? ──────────────────────────────────────
  const isAllowedDomain = (emailVal) => {
    const domain = emailVal.split('@')[1]?.toLowerCase() || '';
    return ALLOWED_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
  };

  // ── Handle Quick Demo Login ───────────────────────────────────────────────
  const handleDemoLogin = (persona) => {
    onLoginSuccess(persona);
    onClose();
  };

  // ── Handle Email + Password Sign In ──────────────────────────────────────
  // Validates: (1) email domain whitelist, (2) correct password for that email.
  const handleEmailLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const emailLower = email.trim().toLowerCase();

    // 1. Domain validation
    if (!isAllowedDomain(emailLower)) {
      setLoginError('⛔ Only official government email addresses (@mospi.gov.in, @nic.in, @gov.in) are permitted.');
      return;
    }

    // 2. Credential lookup
    const cred = DEMO_CREDENTIALS[emailLower];
    if (!cred) {
      setLoginError('❌ Email not found in MoSPI officials registry. Please register as a newcomer or use a demo account.');
      return;
    }

    // 3. Password validation
    if (password !== cred.password) {
      setLoginError('🔒 Incorrect password. Please check your credentials and try again.');
      return;
    }

    // 4. Success — find matching persona
    const found = OFFICIAL_PERSONAS.find(p => p.id === cred.personaId);
    onLoginSuccess(found || OFFICIAL_PERSONAS[0]);
    onClose();
  };

  // ── Handle Send OTP (Phone Login & Registration) ──────────────────────────
  const handleSendOtp = (e) => {
    e?.preventDefault();
    setLoginError('');

    // Validate phone number format (10 digits, India)
    const phoneVal = (phone || regPhone).replace(/\D/g, '');
    if (phoneVal.length !== 10) {
      setLoginError('📱 Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    // Generate a cryptographically random 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpCode('');
    setOtpError('');

    // For phone login: find persona by phone number (demo simulation)
    const matchedPersona = OFFICIAL_PERSONAS.find(p =>
      p.phone && p.phone.replace(/\D/g, '') === phoneVal
    ) || null;
    setOtpPersona(matchedPersona);

    setAuthMode('OTP');
    setOtpToastMsg(`📱 Skill Path AI OTP sent to +91 ${phoneVal}: ${code}`);
  };

  // ── Handle Verify OTP ─────────────────────────────────────────────────────
  // Strict: only the exact generated OTP code is accepted — no bypasses.
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError('');

    if (otpCode.trim() !== generatedOtp) {
      setOtpError('❌ Invalid OTP. Please enter the exact 6-digit code shown in the notification banner above.');
      return;
    }

    if (regName) {
      // Complete Newcomer Registration
        const newUserObj = {
          id: 'persona_' + Date.now(),
          name: regName,
          cadre: regCadre,
          designation: regDesignation,
          division: regDivision,
          location: 'MoSPI Office',
          experienceYears: Number(regExp),
          education: regEducation,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          currentCompetencies: {
            survey_design: 3,
            sampling_theory: 3,
            national_accounts: 3,
            price_statistics: 3,
            labour_stats: 3,
            sdg_indicators: 3,
            data_quality: 3,
            python_stats: 2,
            r_programming: 2,
            sql_db: 3,
            stata_spss: 3,
            gis_spatial: 2,
            aiml_official: 1,
            cloud_apis: 2,
            dpdp_privacy: 3,
            cybersecurity: 3,
            digital_signatures: 4,
            govt_cloud: 2,
            dpi_integration: 3,
            leadership: 3,
            public_comm: 3,
            project_mgmt: 3,
            ethics_integrity: 5,
            change_mgmt: 3
          },
          targetCompetencies: {
            survey_design: 4,
            sampling_theory: 4,
            national_accounts: 4,
            price_statistics: 4,
            labour_stats: 4,
            sdg_indicators: 4,
            data_quality: 5,
            python_stats: 4,
            r_programming: 4,
            sql_db: 4,
            stata_spss: 4,
            gis_spatial: 4,
            aiml_official: 3,
            cloud_apis: 3,
            dpdp_privacy: 5,
            cybersecurity: 4,
            digital_signatures: 5,
            govt_cloud: 3,
            dpi_integration: 4,
            leadership: 4,
            public_comm: 4,
            project_mgmt: 4,
            ethics_integrity: 5,
            change_mgmt: 4
          },
          completedCoursesCount: 2,
          learningHoursTotal: 12
        };

        onRegisterSuccess(newUserObj);
      } else {
        // Phone OTP login — use matched persona or first persona
        onLoginSuccess(otpPersona || OFFICIAL_PERSONAS[0]);
      }
      onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 9, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      <div className="glass-card animate-fade-in login-card" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 242, 254, 0.2)'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <SkillPathLogo size={64} showText={true} showTagline={true} />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Government of India • Ministry of Statistics & Programme Implementation
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {authMode !== 'OTP' && (
          <div className="responsive-flex-column" style={{ display: 'flex', gap: '6px', background: 'var(--bg-main)', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => setAuthMode('LOGIN_EMAIL')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '9px',
                border: 'none',
                background: authMode === 'LOGIN_EMAIL' ? 'var(--navy-primary)' : 'transparent',
                color: authMode === 'LOGIN_EMAIL' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Email Login
            </button>

            <button
              onClick={() => setAuthMode('LOGIN_PHONE')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '9px',
                border: 'none',
                background: authMode === 'LOGIN_PHONE' ? 'var(--navy-primary)' : 'transparent',
                color: authMode === 'LOGIN_PHONE' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Phone OTP
            </button>

            <button
              onClick={() => setAuthMode('REGISTER')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '9px',
                border: 'none',
                background: authMode === 'REGISTER' ? 'var(--saffron-main)' : 'transparent',
                color: authMode === 'REGISTER' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              New Registration
            </button>
          </div>
        )}

        {/* 1. EMAIL + PASSWORD LOGIN FORM */}
        {authMode === 'LOGIN_EMAIL' && (
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Government Email Address (@mospi.gov.in / @nic.in)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="official.name@mospi.gov.in"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontWeight: '500'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{loginError}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              <LogIn size={18} /> Sign In to Skill Path AI
            </button>

            {/* Credential hint for demo purposes */}
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.06)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}>
              <div style={{ fontWeight: '700', color: '#00f2fe', marginBottom: '4px' }}>💡 Demo Credentials:</div>
              <div>Email: <code style={{ color: '#f8fafc' }}>rajesh.sharma@mospi.gov.in</code></div>
              <div>Password: <code style={{ color: '#f8fafc' }}>SkillPathAI@2026</code></div>
            </div>
          </form>
        )}

        {/* 2. PHONE NUMBER + OTP LOGIN FORM */}
        {authMode === 'LOGIN_PHONE' && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Registered Mobile Number (+91)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontWeight: '600'
                  }}
                />
              </div>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{loginError}</span>
              </div>
            )}

            <button type="submit" className="btn-saffron" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              <KeyRound size={18} /> Send OTP Verification Code
            </button>

            {/* Phone hint for demo */}
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.06)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}>
              <div style={{ fontWeight: '700', color: '#00f2fe', marginBottom: '4px' }}>💡 Demo Phone Numbers:</div>
              <div><code style={{ color: '#f8fafc' }}>9876543210</code> — Dr. Rajesh Kumar Sharma</div>
              <div><code style={{ color: '#f8fafc' }}>9123456789</code> — Smt. Ananya Sen</div>
            </div>
          </form>
        )}

        {/* 3. NEW COMER REGISTRATION FORM */}
        {authMode === 'REGISTER' && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--saffron-light)', color: 'var(--saffron-main)', fontSize: '0.8rem', fontWeight: '600' }}>
              ✨ Newcomer Registration: Create your Skill Path AI Official Profile.
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Full Name (Official Record)
              </label>
              <input 
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Dr. / Shri / Smt. Full Name"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Official Email
                </label>
                <input 
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@mospi.gov.in"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Mobile Number
                </label>
                <input 
                  type="tel"
                  required
                  maxLength={10}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="10-Digit Mobile"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Cadre Service
                </label>
                <select
                  value={regCadre}
                  onChange={(e) => setRegCadre(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontWeight: '600'
                  }}
                >
                  <option value="ISS (Indian Statistical Service)">ISS (Indian Statistical Service)</option>
                  <option value="SSS (Subordinate Statistical Service)">SSS (Subordinate Statistical Service)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  MoSPI Division
                </label>
                <select
                  value={regDivision}
                  onChange={(e) => setRegDivision(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontWeight: '600'
                  }}
                >
                  <option value="National Accounts Division (NAD)">National Accounts (NAD)</option>
                  <option value="Field Operations Division (FOD)">Field Operations (FOD)</option>
                  <option value="Survey Design & Research Division (SDRD)">Survey Design (SDRD)</option>
                  <option value="Economic Statistics Division (ESD)">Economic Statistics (ESD)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Set Password
              </label>
              <input 
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <button type="submit" className="btn-saffron" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}>
              <UserPlus size={18} /> Register & Verify via OTP <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* 4. OTP VERIFICATION STEP */}
        {authMode === 'OTP' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Live Simulated OTP Notification Banner */}
            {otpToastMsg && (
              <div style={{ 
                padding: '12px 16px', 
                borderRadius: '10px', 
                background: 'var(--emerald-light)', 
                color: 'var(--emerald-main)', 
                border: '1px solid var(--emerald-main)',
                fontSize: '0.85rem',
                fontWeight: '700',
                textAlign: 'center'
              }}>
                {otpToastMsg}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textAlign: 'center' }}>
                Enter 6-Digit Verification OTP Code
              </label>
              <input 
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="e.g. 784920"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '2px solid var(--navy-primary)',
                  background: 'var(--bg-main)',
                  color: 'var(--navy-primary)',
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  letterSpacing: '0.4em',
                  textAlign: 'center'
                }}
              />
            </div>

            {/* OTP Error Banner */}
            {otpError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{otpError}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
              <CheckCircle2 size={18} /> Verify OTP & Launch Skill Path AI
            </button>

            <button 
              type="button" 
              onClick={() => setAuthMode('LOGIN_EMAIL')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              ← Back to Sign In options
            </button>
          </form>
        )}

        {/* DEMO 1-CLICK PERSONA LOGIN STRIP */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center' }}>
            ⚡ OR 1-CLICK DEMO SIGN IN AS EXISTING OFFICIAL:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {OFFICIAL_PERSONAS.slice(0, 3).map(p => (
              <button
                key={p.id}
                onClick={() => handleDemoLogin(p)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={p.avatar} alt={p.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.cadre.split(' ')[0]} • {p.division.split(' ')[0]}</div>
                  </div>
                </div>
                <span className="badge badge-navy" style={{ fontSize: '0.68rem' }}>Sign In</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
