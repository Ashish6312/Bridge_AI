import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, LogOut, LayoutDashboard, Menu, X, Puzzle, Bell, Sparkles, Gift, CheckCircle2, Info } from 'lucide-react';
import ExtensionModal from './ExtensionModal';
import { apiFetch } from '../apiConfig';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExtModal, setShowExtModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const dropdownParentRef = useRef(null);
  const dropdownRef = useRef(null);

  // Read global read IDs
  const [readGlobalIds, setReadGlobalIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bridge_read_global_notifications') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchNotifications = async () => {
    try {
      const emailParam = user ? `?email=${encodeURIComponent(user.email)}` : '';
      const response = await apiFetch(`/api/notifications${emailParam}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && dropdownParentRef.current && !dropdownParentRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const markAsRead = async (notification) => {
    if (!notification.user_email) {
      const updatedRead = [...readGlobalIds];
      if (!updatedRead.includes(notification.id)) {
        updatedRead.push(notification.id);
        localStorage.setItem('bridge_read_global_notifications', JSON.stringify(updatedRead));
        setReadGlobalIds(updatedRead);
      }
    } else {
      try {
        const res = await apiFetch(`/api/notifications/${notification.id}/read`, { method: 'PATCH' });
        const data = await res.json();
        if (data.success) {
          setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    setDropdownOpen(false);
  };

  const markAllAsRead = async () => {
    const updatedRead = [...readGlobalIds];
    notifications.forEach(n => {
      if (!n.user_email && !updatedRead.includes(n.id)) {
        updatedRead.push(n.id);
      }
    });
    localStorage.setItem('bridge_read_global_notifications', JSON.stringify(updatedRead));
    setReadGlobalIds(updatedRead);
    
    // Optimistic UI update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    if (user) {
      try {
        await apiFetch('/api/notifications/read-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
    fetchNotifications();
    setDropdownOpen(false);
  };

  const unreadNotifications = notifications.filter(n => {
    if (!n.user_email) {
      return !readGlobalIds.includes(n.id);
    }
    return !n.is_read;
  });
  const unreadCount = unreadNotifications.length;

  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'feature':
        return <Sparkles size={16} />;
      case 'offer':
        return <Gift size={16} />;
      case 'issue_resolved':
        return <CheckCircle2 size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getNotificationIconBg = (type) => {
    switch (type) {
      case 'feature':
        return 'rgba(124, 58, 237, 0.15)';
      case 'offer':
        return 'rgba(16, 185, 129, 0.15)';
      case 'issue_resolved':
        return 'rgba(255, 107, 44, 0.15)';
      default:
        return 'rgba(59, 130, 246, 0.15)';
    }
  };

  const getNotificationIconColor = (type) => {
    switch (type) {
      case 'feature':
        return '#A78BFA';
      case 'offer':
        return '#34D399';
      case 'issue_resolved':
        return '#FF6B2C';
      default:
        return '#60A5FA';
    }
  };

  const renderNotificationsBell = () => {
    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={dropdownParentRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: dropdownOpen ? 'var(--nav-text-hover)' : 'var(--nav-text)',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderRadius: '50%',
            transition: 'all 0.25s',
            outline: 'none',
            background: dropdownOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
          }}
          onMouseEnter={e => {
            if (!dropdownOpen) e.currentTarget.style.color = 'var(--nav-text-hover)';
          }}
          onMouseLeave={e => {
            if (!dropdownOpen) e.currentTarget.style.color = 'var(--nav-text)';
          }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'linear-gradient(135deg, #FF8C00, #FF3C00)',
              color: 'white',
              fontSize: '9px',
              fontWeight: 800,
              borderRadius: '10px',
              padding: '1px 4px',
              minWidth: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(255, 60, 0, 0.6), 0 0 2px rgba(0,0,0,0.8)'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                position: isMobile ? 'fixed' : 'absolute',
                top: isMobile ? '76px' : '50px',
                left: isMobile ? '16px' : 'auto',
                right: isMobile ? '0px' : '0px',
                width: isMobile ? 'auto' : '360px',
                maxHeight: '480px',
                background: 'rgba(20, 20, 22, 0.95)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid var(--nav-border)',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                overflow: 'hidden',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--nav-logo-text)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FF6B2C',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      transition: 'background 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 107, 44, 0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div data-lenis-prevent style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: '380px'
              }}>
                {notifications.length === 0 ? (
                  <div style={{
                    padding: '32px 16px',
                    textAlign: 'center',
                    color: 'var(--nav-text)',
                    fontSize: '13px'
                  }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => {
                    const isRead = n.user_email ? n.is_read : readGlobalIds.includes(n.id);
                    return (
                      <div 
                        key={n.id}
                        onClick={() => markAsRead(n)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '12px',
                          background: isRead ? 'transparent' : 'rgba(255, 107, 44, 0.04)',
                          transition: 'background 0.2s',
                          alignItems: 'flex-start'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 107, 44, 0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = isRead ? 'transparent' : 'rgba(255, 107, 44, 0.04)'}
                      >
                        {/* Icon based on type */}
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: getNotificationIconBg(n.type),
                          color: getNotificationIconColor(n.type),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {getNotificationIcon(n.type)}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: isRead ? '600' : '700', color: 'var(--nav-logo-text)' }}>
                              {n.title}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--nav-text)', opacity: 0.7, flexShrink: 0 }}>
                              {timeAgo(n.created_at)}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--nav-text)', lineHeight: 1.4, margin: 0, textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                            {n.message}
                          </p>
                        </div>

                        {/* Unread dot */}
                        {!isRead && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#FF6B2C',
                            marginTop: '6px',
                            flexShrink: 0
                          }} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bridge_theme') || 'system';
  });

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

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location.pathname]);

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
          @media (max-width: 1024px) {
            .nav-capsule {
              display: none !important;
            }
            .nav-actions-desktop {
              display: none !important;
            }
            .nav-actions-mobile {
              display: flex !important;
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
          {renderNotificationsBell()}
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

        {/* Mobile Actions (Bell & Hamburger) */}
        <div className="nav-actions-mobile" style={{ display: 'none', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2 }}>
          {renderNotificationsBell()}
          <button onClick={() => setMenuOpen(v => !v)}
            style={{ background: 'transparent', border: 'none', color: 'var(--nav-logo-text)', cursor: 'pointer', padding: 4 }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
