import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, LogOut, LayoutDashboard, Menu, X, Puzzle, Sun, Moon, Monitor } from 'lucide-react';
import ExtensionModal from './ExtensionModal';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExtModal, setShowExtModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bridge_theme') || 'system';
  });
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  useEffect(() => {
    const applyTheme = (t) => {
      let activeTheme = t;
      if (t === 'system') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', activeTheme);
      window.dispatchEvent(new CustomEvent('bridge_theme_change', { detail: t }));
    };

    applyTheme(theme);
    localStorage.setItem('bridge_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        applyTheme('system');
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else {
        mediaQuery.addListener(listener);
      }
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', listener);
        } else {
          mediaQuery.removeListener(listener);
        }
      };
    }
  }, [theme]);

  // Click outside to close theme dropdown
  useEffect(() => {
    if (!showThemeDropdown) return;
    const clickHandler = () => setShowThemeDropdown(false);
    window.addEventListener('click', clickHandler);
    return () => window.removeEventListener('click', clickHandler);
  }, [showThemeDropdown]);

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > 60) {
        if (currentScrollY > lastScrollY) {
          setVisible(false); // Scrolling down -> Hide navbar
        } else {
          setVisible(true);  // Scrolling up -> Show navbar
        }
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('bridge_user');
    setUser(null);
    navigate('/logout');
  };

  const LINKS = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Docs', to: '/docs' },
    { label: 'Blog', to: '/blog' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--nav-border)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        <style>{`
          @media (max-width: 768px) {
            .nav-capsule {
              display: none !important;
            }
            .nav-actions-desktop {
              display: none !important;
            }
            .nav-hamburger {
              display: block !important;
            }
          }
        `}</style>

        {/* Logo (Left side) */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', position: 'relative', zIndex: 2 }}>
          <div style={{ width: 34, height: 34, color: 'var(--nav-logo-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <defs>
                <mask id="logo-cutout">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <path d="M 16 66 C 30 50, 60 42, 92 60 C 60 46, 30 54, 16 66 Z" fill="black" />
                </mask>
              </defs>
              <path fillRule="evenodd" clipRule="evenodd" d="M30 20 H58 C72 20 80 26 80 35 C80 42 75 47 68 49 C77 51 82 56 82 65 C82 76 73 80 58 80 H30 V20 Z M44 32 H55 C61 32 66 34 66 38 C66 42 61 44 55 44 H44 V32 Z M44 54 H57 C63 54 68 56 68 60 C68 64 63 66 57 66 H44 V54 Z" fill="currentColor" mask="url(#logo-cutout)"/>
              <path d="M 19 65 C 32 52, 60 45, 89 59 C 60 49, 32 56, 19 65 Z" fill="currentColor" />
            </svg>
          </div>
          <div style={{ width: 1, height: 28, background: 'var(--nav-divider)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--nav-logo-text)', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
              Bridge
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF6B2C', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
              AI
            </span>
          </div>
        </Link>

        {/* Floating Center Capsule */}
        <div className="nav-capsule" style={{ 
          display: 'flex', 
          gap: '4px', 
          alignItems: 'center',
          background: 'var(--nav-capsule-bg)',
          border: '1px solid var(--nav-capsule-border)',
          borderRadius: '8px',
          padding: '5px 6px',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: 'var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
        }}>
          {LINKS.map(link => {
            const isActive = location.pathname === link.to || 
              (link.to === '/blog' && location.pathname.startsWith('/blog'));
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  textDecoration: 'none',
                  color: isActive ? 'var(--nav-text-hover)' : 'var(--nav-text)',
                  transition: 'all 0.25s ease',
                  padding: '7px 18px',
                  borderRadius: '6px',
                  background: isActive ? 'var(--nav-capsule-active-bg)' : 'transparent',
                  border: isActive ? '1px solid var(--nav-capsule-border)' : '1px solid transparent',
                  letterSpacing: '0.01em'
                }}
                onMouseEnter={e => { 
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--nav-text-hover)'; 
                  }
                }}
                onMouseLeave={e => { 
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--nav-text)'; 
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Authentication & Theme Actions (Right side) */}
        <div className="nav-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 2 }}>
          {/* Theme Toggler Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowThemeDropdown(!showThemeDropdown);
              }}
              style={{
                width: 32, height: 32,
                borderRadius: '50%',
                border: '1px solid var(--nav-capsule-border)',
                background: 'var(--nav-capsule-active-bg)',
                color: 'var(--nav-text-hover)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s',
              }}
              title="Toggle Theme"
            >
              {theme === 'light' && <Sun size={14} />}
              {theme === 'dark' && <Moon size={14} />}
              {theme === 'system' && <Monitor size={14} />}
            </button>
            <AnimatePresence>
              {showThemeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  style={{
                    position: 'absolute', top: '40px', right: 0,
                    width: '120px',
                    background: 'var(--nav-capsule-bg)',
                    border: '1px solid var(--nav-capsule-border)',
                    borderRadius: '10px',
                    padding: '6px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                    display: 'flex', flexDirection: 'column', gap: '4px',
                    zIndex: 110,
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)'
                  }}
                >
                  {[
                    { val: 'light', label: 'Light', icon: <Sun size={13} /> },
                    { val: 'dark', label: 'Dark', icon: <Moon size={13} /> },
                    { val: 'system', label: 'System', icon: <Monitor size={13} /> }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setTheme(opt.val);
                        setShowThemeDropdown(false);
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: theme === opt.val ? 'var(--nav-capsule-active-bg)' : 'transparent',
                        border: 'none',
                        color: theme === opt.val ? 'var(--primary)' : 'var(--nav-text)',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={e => {
                        if (theme !== opt.val) {
                          e.currentTarget.style.color = 'var(--nav-text-hover)';
                          e.currentTarget.style.background = 'var(--nav-capsule-active-bg)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (theme !== opt.val) {
                          e.currentTarget.style.color = 'var(--nav-text)';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setShowExtModal(true)}
            style={{
              fontSize: '13px',
              fontWeight: '500',
              border: 'none',
              color: 'var(--nav-text)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'color 0.25s',
              fontFamily: "'Outfit', 'Inter', sans-serif"
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--nav-text-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--nav-text)'; }}
          >
            Extension
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Link to="/dashboard" style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--nav-text)',
                textDecoration: 'none',
                transition: 'color 0.25s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--nav-text-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--nav-text)'; }}
              >
                Dashboard
              </Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                <div style={{ 
                  width: 30, height: 30, 
                  background: 'linear-gradient(135deg, #7C3AED, #FF6B2C)', color: 'white', 
                  borderRadius: '50%', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 800, fontSize: '0.8rem',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              </Link>
            </div>
          ) : (
            <Link to="/login" style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--nav-text-hover)',
              textDecoration: 'none',
              transition: 'opacity 0.25s',
              opacity: 0.85
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.85}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(v => !v)}
          style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--nav-logo-text)', cursor: 'pointer', padding: 4, position: 'relative', zIndex: 2 }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed', top: 72, left: 0, right: 0, zIndex: 99,
              background: 'var(--bg-secondary)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border-light)',
              padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
            {LINKS.map(item => (
              <Link key={item.to} to={item.to} style={{
                padding: '14px 16px', borderRadius: 10, textDecoration: 'none',
                color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem',
                background: location.pathname === item.to ? 'rgba(255,107,44,0.05)' : 'transparent',
              }}>{item.label}</Link>
            ))}
            <div style={{ height: 1, background: 'var(--border-light)', margin: '12px 0' }} />
            
            {/* Mobile Theme Toggle Selection */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', marginBottom: 12 }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Theme</span>
              <div style={{ display: 'flex', gap: '4px', background: 'var(--nav-capsule-bg)', border: '1px solid var(--nav-capsule-border)', borderRadius: '12px', padding: '4px' }}>
                {[
                  { val: 'light', icon: <Sun size={15} /> },
                  { val: 'dark', icon: <Moon size={15} /> },
                  { val: 'system', icon: <Monitor size={15} /> }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setTheme(opt.val)}
                    style={{
                      width: '32px', height: '32px',
                      borderRadius: '8px',
                      background: theme === opt.val ? 'var(--primary)' : 'transparent',
                      border: 'none',
                      color: theme === opt.val ? '#050505' : 'var(--nav-text)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { setShowExtModal(true); setMenuOpen(false); }}
              style={{ padding: '14px', borderRadius: 10, background: 'transparent', border: '1px solid var(--border-light)', color: '#FF6B2C', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Browser Extension
            </button>
            {user ? (
              <>
                <Link to="/dashboard" style={{ padding: '14px', borderRadius: 10, textAlign: 'center', background: '#FF6B2C', color: '#050505', fontWeight: 700, textDecoration: 'none', marginTop: 8, marginBottom: 8 }}>Dashboard</Link>
                <Link to="/profile" style={{ padding: '14px', borderRadius: 10, textAlign: 'center', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', fontWeight: 700, textDecoration: 'none', display: 'block', marginBottom: 8 }}>Profile Settings</Link>
                <button onClick={handleLogout} style={{ padding: '14px', background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
              </>
            ) : (
              <Link to="/login" style={{ padding: '14px', borderRadius: 10, textAlign: 'center', background: '#FF6B2C', color: '#050505', fontWeight: 700, textDecoration: 'none', display: 'block', marginTop: 8 }}>Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showExtModal && <ExtensionModal onClose={() => setShowExtModal(false)} />}
    </>
  );
};

export default Navbar;
