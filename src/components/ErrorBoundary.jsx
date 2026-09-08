import React from 'react';
import SkillPathLogo from './SkillPathLogo';
import MospiOfficialLogo from './MospiOfficialLogo';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Skill Path AI Platform Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#040914',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '20px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 242, 254, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <MospiOfficialLogo size={48} />
              <SkillPathLogo size={52} showText={false} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#00f2fe', marginBottom: '8px' }}>
              Skill Path AI Platform Recovery Gateway
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
              The application encountered a temporary runtime state glitch. Click below to reload and restore session data.
            </p>

            <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left', overflowX: 'auto', fontSize: '0.8rem' }}>
              <strong>Error Details:</strong><br />
              {this.state.error && this.state.error.toString()}<br />
              {this.state.error && this.state.error.stack}
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                color: '#040914',
                fontWeight: '800',
                fontSize: '1rem',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={18} /> Reload Skill Path AI Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
