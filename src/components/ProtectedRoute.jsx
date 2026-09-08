import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isTokenValid } from '../utils/jwt';
import SkillPathLogo from './SkillPathLogo';
import MospiOfficialLogo from './MospiOfficialLogo';
import { ShieldCheck, RefreshCw } from 'lucide-react';

/**
 * Strict ProtectedRoute Component
 *
 * 1. Reads JWT token from AuthContext (which reads from localStorage).
 * 2. Decodes / parses the token to check both existence AND exp claim.
 * 3. If token is missing, malformed, or expired:
 *    - Clears stale auth data via logout() inside a useEffect (NOT in render).
 *    - Immediately redirects to /login preserving the attempted location.
 * 4. If token is valid, renders child routes via <Outlet /> (or children prop).
 * 5. Prevents brief flash of protected UI by showing a loading screen while
 *    the auth state is being hydrated from localStorage (isLoadingToken phase).
 */
export default function ProtectedRoute({ children }) {
  const { token, isLoadingToken, logout } = useAuth();
  const location = useLocation();

  // Compute token validity BEFORE any side-effects
  const isValid = Boolean(token && isTokenValid(token));

  /**
   * Side-effect: Clear stale auth data when token is invalid.
   * This MUST live in useEffect — never call logout() directly inside render.
   * Runs only when isLoadingToken is false (hydration complete) and token is invalid.
   */
  useEffect(() => {
    if (!isLoadingToken && !isValid) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingToken, isValid]);

  // ── Phase 1: Hydration loading state ──────────────────────────────────────
  // Prevents brief flash of protected UI content while localStorage is read
  // and token validity is determined asynchronously on mount.
  if (isLoadingToken) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Validating credentials"
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at 50% 20%, #0b192c 0%, #030712 100%)',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <div style={{
          textAlign: 'center',
          maxWidth: '420px',
          background: 'rgba(15, 23, 42, 0.95)',
          padding: '32px',
          borderRadius: '20px',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 242, 254, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
            <MospiOfficialLogo size={46} />
            <SkillPathLogo size={50} showText={false} />
          </div>

          {/* Animated spinner */}
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(0, 242, 254, 0.2)',
            borderTopColor: '#00f2fe',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }} />

          <div style={{
            color: '#00f2fe',
            fontWeight: '800',
            fontSize: '1rem',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={18} />
            Validating Secure Credentials...
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.6' }}>
            Verifying JWT token structure &amp; expiration claims for
            MoSPI Official Access.
          </p>
        </div>

        {/* Keyframe animation injected inline for portability */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ── Phase 2: Token invalid → redirect to /login ───────────────────────────
  // Preserve the attempted URL path in location.state so LoginPage can
  // restore the user's destination after a successful sign-in.
  if (!isValid) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ── Phase 3: Token valid → render protected content ──────────────────────
  return children ? children : <Outlet />;
}
