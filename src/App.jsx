import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearnerProgressProvider } from './context/LearnerProgressContext';
import { useLanguage } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import ContactAdmin from './pages/ContactAdmin';
import SkillPathLogo from './components/SkillPathLogo';
import MospiOfficialLogo from './components/MospiOfficialLogo';
import Intro3DEntrance from './components/Intro3DEntrance';
import CompetencyProfiler from './components/CompetencyProfiler';
import SkillGapAnalyzer from './components/SkillGapAnalyzer';
import CourseRecommendations from './components/CourseRecommendations';
import AIMcqGenerator from './components/AIMcqGenerator';
import StatAICopilot from './components/StatAICopilot';
import LearnerDashboard from './components/LearnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import KcmSkillTree from './components/KcmSkillTree';
import { 
  UserCheck, 
  ShieldAlert, 
  BookOpen, 
  Sparkles, 
  Bot, 
  LayoutDashboard, 
  Building2, 
  Sun, 
  Moon, 
  LogOut, 
  ChevronDown, 
  UserPlus, 
  Play, 
  Lock, 
  LogIn,
  Network,
  Settings,
  X,
  UploadCloud
} from 'lucide-react';

function ProfileSettingsModal({ isOpen, onClose, currentUser }) {
  const { updateProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(currentUser?.avatar || '');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    // Update global state and save to local storage
    updateProfile({
      ...currentUser,
      name,
      email,
      phone,
      avatar: photo
    });
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 2000);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', zIndex: 1001,
        width: '400px', maxWidth: '90vw', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Edit Profile</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>
        {successMsg && <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: '700' }}>{successMsg}</div>}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <img src={photo || 'https://via.placeholder.com/150'} alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
            <div style={{ flex: 1 }}>
              <label htmlFor="photo-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600', padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--navy-primary)' }}>
                <UploadCloud size={16} /> Upload New Photo
              </label>
              <input type="file" id="photo-upload" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                if(e.target.files && e.target.files[0]) {
                  setPhoto(URL.createObjectURL(e.target.files[0]));
                }
              }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>New Password</label>
            <input type="password" placeholder="Leave blank to keep unchanged" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </>
  );
}

/**
 * Authenticated Dashboard Main Layout
 * Renders Header, Nav tabs, Theme toggle, User Profile dropdown, and nested <Outlet/>
 */
function ProtectedRoute() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function DashboardLayout() {
  const { currentUser, logout, setCurrentUser } = useAuth();
  const [theme, setTheme] = useState('light');
  const [showIntro3D, setShowIntro3D] = useState(false);
  const [userRoleMode, setUserRoleMode] = useState('LEARNER');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 3D Intro Overlay */}
      {showIntro3D && (
        <Intro3DEntrance onEnter={() => setShowIntro3D(false)} />
      )}

      {/* Top Tri-color Accent Bar */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)' }} />

      {/* Main Header Bar */}
      <header className="glass-card" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '12px 24px', sticky: 'top', top: 0, zIndex: 100 }}>
        <div className="dashboard-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Brand Logo & Official MoSPI Government Seal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <SkillPathLogo size={46} showText={true} showTagline={true} isDarkBg={theme === 'dark'} />
            <div style={{ height: '32px', width: '1px', background: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MospiOfficialLogo size={42} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--navy-primary)' }}>
                  Ministry of Statistics & Programme Implementation
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Government of India • iGOT Karmayogi Ecosystem
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="dashboard-actions-flex" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => { setUserRoleMode('LEARNER'); navigate('/dashboard/profiler'); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: userRoleMode === 'LEARNER' ? 'var(--navy-primary)' : 'transparent',
                  color: userRoleMode === 'LEARNER' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserCheck size={14} /> Official View
              </button>
              <button
                onClick={() => { setUserRoleMode('ADMIN'); navigate('/dashboard/admin'); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: userRoleMode === 'ADMIN' ? 'var(--navy-primary)' : 'transparent',
                  color: userRoleMode === 'ADMIN' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={14} /> Admin / Cadre HR
              </button>
            </div>

            {/* Language Switcher */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '6px 8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <option value="EN">English</option>
              <option value="HI">हिंदी</option>
              <option value="TE">తెలుగు</option>
            </select>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* User Profile Menu */}
            {currentUser && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', lineHeight: '1.2' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.cadre?.split(' ')[0]}</div>
                  </div>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {isUserMenuOpen && (
                  <div className="glass-card animate-fade-in" style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '260px',
                    padding: '16px',
                    zIndex: 200,
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--navy-primary)', fontWeight: '600' }}>{currentUser.designation}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.division}</div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border-color)' }} />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Settings size={16} /> Edit Profile
                    </button>

                    <button
                      onClick={handleSignOut}
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <LogOut size={16} /> Sign Out / Log Out
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentUser={currentUser} 
      />

      {/* Navigation Sub-Header Router Links */}
      <nav className="nav-tabs-container" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          
          {userRoleMode === 'LEARNER' ? (
            <>
              {[
                { path: '/dashboard/profiler', label: t('profiler'), icon: UserCheck },
                { path: '/dashboard/gap-matrix', label: t('gapMatrix'), icon: ShieldAlert },
                { path: '/dashboard/skill-tree', label: t('skillTree'), icon: Network },
                { path: '/dashboard/pathways', label: t('pathways'), icon: BookOpen },
                { path: '/dashboard/mcq-generator', label: 'AI Quiz & MCQ Generator', icon: Sparkles },
                { path: '/dashboard/ai-copilot', label: t('aiCopilot'), icon: Bot },
                { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
                { path: '/dashboard/contact-admin', label: t('contact_admin'), icon: Building2 }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path || (tab.path === '/dashboard' && location.pathname === '/dashboard');
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    style={{
                      padding: '14px 18px',
                      borderBottom: isActive ? '3px solid var(--saffron-main)' : '3px solid transparent',
                      background: 'transparent',
                      color: isActive ? 'var(--navy-primary)' : 'var(--text-muted)',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </Link>
                );
              })}
            </>
          ) : (
            <>
              {[
                { path: '/dashboard/admin', label: t('admin'), icon: Building2 },
                { path: '/dashboard/mcq-generator', label: 'AI Assessment Authoring Bank', icon: Sparkles },
                { path: '/dashboard/pathways', label: 'iGOT Course Mapping Registry', icon: BookOpen },
                { path: '/dashboard/contact-admin', label: t('contact_admin'), icon: Building2 }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    style={{
                      padding: '14px 18px',
                      borderBottom: isActive ? '3px solid var(--saffron-main)' : '3px solid transparent',
                      background: 'transparent',
                      color: isActive ? 'var(--navy-primary)' : 'var(--text-muted)',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </Link>
                );
              })}
            </>
          )}

        </div>
      </nav>

      {/* Main Body View Outlet */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ padding: '24px', background: 'var(--bg-sidebar)', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <SkillPathLogo size={36} showText={true} showTagline={true} isDarkBg={true} />
          <span style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MospiOfficialLogo size={24} />
            <span>Ministry of Statistics & Programme Implementation (MoSPI)</span>
          </div>
        </div>
        
        {/* Official Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <a href="https://www.skillindiadigital.gov.in/home" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '600' }}>Skill India Digital</a>
          <a href="https://swayam.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '600' }}>Swayam</a>
          <a href="https://nptel.ac.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '600' }}>NPTEL</a>
        </div>

        <p>© 2026 Government of India. All rights reserved. | iGOT Karmayogi Ecosystem</p>
        <p style={{ marginTop: '4px', fontSize: '0.75rem', opacity: 0.6 }}>Designed for the National Statistical Systems Training Academy (NSSTA)</p>
      </footer>

    </div>
  );
}

/**
 * Dashboard Sub-Route Wrapper Components to pass props
 */
function LearnerDashboardWrapper() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  return (
    <LearnerDashboard 
      activePersona={currentUser}
      userCompetencies={currentUser?.currentCompetencies || {}}
      onNavigate={(tabKey) => {
        const routes = {
          RECOMMENDATIONS: '/dashboard/pathways',
          MCQ_GENERATOR: '/dashboard/mcq-generator',
          PROFILER: '/dashboard/profiler'
        };
        navigate(routes[tabKey] || '/dashboard');
      }}
    />
  );
}

function CompetencyProfilerWrapper() {
  const { currentUser, setCurrentUser } = useAuth();
  const [competencies, setCompetencies] = useState(currentUser?.currentCompetencies || {});
  return (
    <CompetencyProfiler 
      activePersona={currentUser}
      setActivePersona={setCurrentUser}
      userCompetencies={competencies}
      setUserCompetencies={setCompetencies}
    />
  );
}

function SkillGapAnalyzerWrapper() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  return (
    <SkillGapAnalyzer 
      activePersona={currentUser}
      userCompetencies={currentUser?.currentCompetencies || {}}
      onNavigateToCourses={() => navigate('/dashboard/pathways')}
    />
  );
}

function CourseRecommendationsWrapper() {
  const { currentUser } = useAuth();
  return (
    <CourseRecommendations 
      activePersona={currentUser}
      userCompetencies={currentUser?.currentCompetencies || {}}
    />
  );
}

function AIMcqGeneratorWrapper() {
  const navigate = useNavigate();
  return (
    <AIMcqGenerator 
      onCompleteQuiz={() => navigate('/dashboard')}
    />
  );
}

function StatAICopilotWrapper() {
  const { currentUser } = useAuth();
  return (
    <StatAICopilot 
      activePersona={currentUser}
    />
  );
}

function KcmSkillTreeWrapper() {
  const { currentUser } = useAuth();
  return (
    <KcmSkillTree
      activePersona={currentUser}
    />
  );
}

/**
 * Extracted route component to access auth context
 */
function AppRoutes() {
  const { currentUser } = useAuth();
  
  return (
    <LearnerProgressProvider activePersona={currentUser}>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* STRICT PROTECTED ROUTES (Zero Unauthenticated Access) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<LearnerDashboardWrapper />} />
            <Route path="profiler" element={<CompetencyProfilerWrapper />} />
            <Route path="gap-matrix" element={<SkillGapAnalyzerWrapper />} />
            <Route path="pathways" element={<CourseRecommendationsWrapper />} />
            <Route path="skill-tree" element={<KcmSkillTreeWrapper />} />
            <Route path="mcq-generator" element={<AIMcqGeneratorWrapper />} />
            <Route path="ai-copilot" element={<StatAICopilotWrapper />} />
            <Route path="contact-admin" element={<ContactAdmin activePersona={currentUser} />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Catch-all redirect to /dashboard (which will trigger ProtectedRoute) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </LearnerProgressProvider>
  );
}

/**
 * Main Application Router Entry
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
