import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, LogOut, LayoutDashboard, Menu, X, Puzzle } from 'lucide-react';
import ExtensionModal from './ExtensionModal';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExtModal, setShowExtModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('bridge_user');
    if (stored) setUser(JSON.parse(stored));
    const handler = () => {
      const s = localStorage.getItem('bridge_user');
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('bridge_user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <nav 
        className={`nav-standard ${scrolled ? 'nav-scrolled' : ''}`} 
        style={{
          padding: scrolled ? '10px 0' : '16px 0',
          position: 'sticky', top: 0, zIndex: 100,
          background: scrolled ? 'rgba(2, 6, 23, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Logo - Institutional Style */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'var(--gradient-1)', padding: '6px', borderRadius: scrolled ? '8px' : '10px', transition: 'all 0.3s ease' }}>
              <Layers size={scrolled ? 16 : 18} color="white" />
            </div>
            <span style={{ fontSize: scrolled ? '1.1rem' : '1.2rem', fontWeight: '800', letterSpacing: '-0.03em', transition: 'all 0.3s ease' }}>
              Bridge<span style={{ color: 'var(--primary)' }}>AI</span>
            </span>
          </Link>

          {/* Elite Navigation Links */}
          <div className="nav-desktop-links" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/about' },
                { label: 'Services', to: '/services' },
                { label: 'Docs', to: '/docs' }
              ].map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="nav-link-professional" 
                  style={{ 
                    fontSize: '0.8rem', 
                    padding: '8px 16px',
                    color: location.pathname === link.to ? 'white' : 'rgba(255,255,255,0.5)',
                    fontWeight: '700',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: '0', left: '16px', right: '16px', height: '2px', background: 'var(--primary)', borderRadius: '10px' }} />
                  )}
                </Link>
              ))}
            </div>

            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', margin: '0 12px' }} />

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/dashboard" className="nav-link-professional" style={{ gap: '6px', fontSize: '0.8rem', fontWeight: '800' }}>
                   DASHBOARD
                </Link>
                <Link to="/profile" className="user-profile-mini" style={{ width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                   <div className="user-avatar-mini" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>{user.name?.charAt(0)}</div>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setShowExtModal(true)} className="ext-pill-minimal" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
                  EXTENSION
                </button>
                <Link to="/login" className="btn-primary-small" style={{ fontSize: '0.75rem', padding: '8px 18px', borderRadius: '100px' }}>
                  JOIN NOW
                </Link>
              </div>
            )}
          </div>

          <button className="nav-hamburger" onClick={() => setMenuOpen(v => !v)} style={{ display: 'none', background: 'transparent', border: 'none', color: 'white' }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '65px', left: 0, right: 0, zIndex: 99,
          background: 'rgba(2, 6, 23, 0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px'
        }}>
          {[
            { label: 'Home', to: '/' },
            { label: 'About', to: '/about' },
            { label: 'Services', to: '/services' },
            { label: 'Docs', to: '/docs' }
          ].map(item => (
            <Link key={item.to} to={item.to} style={{
              padding: '14px 16px', borderRadius: '12px', textDecoration: 'none',
              color: location.pathname === item.to ? 'white' : 'var(--text-muted)',
              fontWeight: '600', fontSize: '1rem',
              background: location.pathname === item.to ? 'rgba(139,92,246,0.1)' : 'transparent',
              borderLeft: location.pathname === item.to ? '3px solid var(--primary)' : '3px solid transparent'
            }}>
              {item.label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '8px 0' }} />
          {/* Extension CTA in mobile drawer */}
          <button
            onClick={() => { setShowExtModal(true); setMenuOpen(false); }}
            style={{
              margin: '4px 0 8px', padding: '14px 16px', borderRadius: '12px', border: 'none',
              background: 'var(--gradient-1)', color: 'white', fontWeight: '700',
              fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              width: '100%',
            }}
          >
            <Puzzle size={18} /> Get Extension
          </button>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
              <Link to="/profile" className="user-profile-chip" style={{ textDecoration: 'none', padding: '10px 16px', width: '100%' }}>
                <div className="user-avatar-mini" style={{ width: '36px', height: '36px' }}>{user.name?.charAt(0)}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'white', fontSize: '1rem', fontWeight: '700' }}>{user.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>View Profile</span>
                </div>
              </Link>
              <Link to="/dashboard" style={{
                padding: '14px 16px', borderRadius: '12px', textDecoration: 'none',
                color: 'white', fontWeight: '600', fontSize: '1rem',
                border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <LayoutDashboard size={18} /> User Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn-exit-minimal" 
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <LogOut size={16} /> Sign Out from Device
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <Link to="/login" style={{ padding:'14px', borderRadius:'12px', textDecoration:'none', color:'white', fontWeight:'600', textAlign:'center', border:'1px solid var(--glass-border)' }}>Sign In</Link>
              <Link to="/login" className="btn-primary" style={{ padding:'14px', justifyContent:'center', fontSize:'0.95rem' }}>Get Started</Link>
            </div>
          )}
        </div>
      )}

      {/* Extension Install Modal */}
      {showExtModal && <ExtensionModal onClose={() => setShowExtModal(false)} />}
    </>
  );
};

export default Navbar;
