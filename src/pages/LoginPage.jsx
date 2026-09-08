import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import SkillPathLogo from '../components/SkillPathLogo';
import MospiOfficialLogo from '../components/MospiOfficialLogo';
import { Lock, LogIn, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Attempted path destination
  const fromPath = location.state?.from?.pathname || '/dashboard';

  // If already authenticated, redirect to attempted path or dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPath]);

  const handleLoginSuccess = (userObj) => {
    login(userObj);
    navigate(fromPath, { replace: true });
  };

  const handleRegisterSuccess = (newUserObj) => {
    register(newUserObj);
    navigate('/dashboard/profiler', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 30%, #0b192c 0%, #030712 100%)',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      
      <div className="glass-card animate-fade-in login-card" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '40px 32px',
        textAlign: 'center',
        background: 'rgba(8, 14, 26, 0.9)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 242, 254, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <MospiOfficialLogo size={52} />
          <SkillPathLogo size={56} showText={false} />
        </div>

        <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
          <Lock size={12} /> Protected Route Access Gateway
        </span>

        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#00f2fe', marginTop: '6px' }}>
          MoSPI Official Sign In Required
        </h2>

        {fromPath && fromPath !== '/dashboard' && (
          <div style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(234, 88, 12, 0.15)', color: '#f97316', fontSize: '0.8rem', fontWeight: '600', marginTop: '10px' }}>
            🔒 You must sign in to view: <code style={{ color: '#00f2fe' }}>{fromPath}</code>
          </div>
        )}

        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '12px', marginBottom: '28px', lineHeight: '1.6' }}>
          Welcome to Skill Path AI. Please enter your official email credentials, phone OTP, or register as a newcomer to proceed.
        </p>

        <AuthModal 
          isOpen={true}
          onClose={() => {}}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      </div>

    </div>
  );
}
