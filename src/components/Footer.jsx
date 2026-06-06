import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Globe, X, Mail, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/* ── SVG Social Icons ───────────────────────────────────────── */
const TwitterIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const LinkedinIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const GithubIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
const InstagramIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

/* ── Legal popup content ────────────────────────────────────── */
const getPopupContent = (type) => {
  const headStyle = { color: '#F5F5F5', fontSize: '1rem', fontWeight: '600', marginTop: '24px', marginBottom: '12px' };
  const pStyle = { marginBottom: '24px', color: '#A1A1AA', lineHeight: 1.75 };
  const badgeStyle = { marginBottom: '24px', fontSize: '0.75rem', color: '#FF6B2C', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' };

  switch (type) {
    case 'privacy': return (<>
      <div style={badgeStyle}>Last Updated: May 2026 · GDPR · CCPA · CPRA</div>
      <p style={pStyle}>At BridgeAI, privacy is the core pillar of our product architecture. We operate on a local-first, zero-knowledge synchronizing system.</p>
      <h4 style={headStyle}>1. Information We Collect</h4>
      <p style={pStyle}>We classify collected data into: <strong>Personal Data</strong> (email addresses), <strong>Technical Data</strong> (IP, browser config), and <strong>Usage Data</strong> (aggregated, non-identifying telemetry). We never collect your prompt content or model responses.</p>
      <h4 style={headStyle}>2. Legal Basis for Processing</h4>
      <p style={pStyle}>Under GDPR, we process data based on: (1) <strong>Consent</strong> for newsletters; (2) <strong>Contractual Obligation</strong> for account management; (3) <strong>Legitimate Interests</strong> for abuse detection.</p>
      <h4 style={headStyle}>3. International Data Transfers</h4>
      <p style={pStyle}>Infrastructure is within EU and US. Standard Contractual Clauses are established for cross-border transfers. Prompt content is encrypted E2E before routing — no intermediary can decrypt it.</p>
      <h4 style={headStyle}>4. User Rights</h4>
      <p style={{ ...pStyle, margin: 0 }}>Right to Access, Deletion, and Portability. Export vaults as JSON or Markdown directly from the app.</p>
    </>);
    case 'terms of actions': return (<>
      <div style={badgeStyle}>Last Updated: May 2026 · Global Terms of Service</div>
      <p style={pStyle}>Welcome to BridgeAI. These Terms govern your access to the BridgeAI applications, extensions, and local synchronization daemons.</p>
      <h4 style={headStyle}>1. User Accounts</h4>
      <p style={pStyle}>Must be 18+ or have institutional authorization. You are solely responsible for safeguarding your credentials.</p>
      <h4 style={headStyle}>2. Intellectual Property</h4>
      <p style={pStyle}>BridgeAI owns proprietary rights to the sync protocol. You retain full ownership of your prompts, context blocks, and model outputs.</p>
      <h4 style={headStyle}>3. Prohibited Activities</h4>
      <p style={pStyle}>No malware distribution, reverse-engineering of the daemon, or automated DoS operations against the orchestration layer.</p>
      <h4 style={headStyle}>4. Governing Law</h4>
      <p style={{ ...pStyle, margin: 0 }}>Governed by the laws of Delaware, United States.</p>
    </>);
    case 'cookie': return (<>
      <div style={badgeStyle}>Last Updated: May 2026 · ePrivacy &amp; GDPR Cookie Policy</div>
      <p style={pStyle}>This Cookie Policy explains how BridgeAI uses cookies and similar tracking protocols on our website and dashboard.</p>
      <h4 style={headStyle}>Cookie Types</h4>
      <p style={pStyle}><strong>Strictly Necessary:</strong> Login state, JWT. <strong>Performance:</strong> Anonymous speed stats. <strong>Functional:</strong> UI preferences. <strong>Advertising:</strong> None — we don't sell ad cookies.</p>
      <h4 style={headStyle}>Control</h4>
      <p style={{ ...pStyle, margin: 0 }}>Modify, block, or delete cookies via your browser settings at any time.</p>
    </>);
    case 'refund policy': return (<>
      <div style={badgeStyle}>Last Updated: May 2026 · Fairness Guarantee</div>
      <p style={pStyle}>BridgeAI provides developer utilities to bridge prompt sessions. We are not liable for third-party LLM API charges.</p>
      <h4 style={headStyle}>Subscription Refunds</h4>
      <p style={pStyle}>We offer a <strong>7-day money-back guarantee</strong> on all premium tiers. API token packs are non-refundable.</p>
      <h4 style={headStyle}>Requesting a Refund</h4>
      <p style={{ ...pStyle, margin: 0 }}>Email billing@bridgeai.io with your account details. Processed within 5 business days.</p>
    </>);
    default: return null;
  }
};

const Footer = () => {
  const [activePopup, setActivePopup] = useState(null);

  return (
    <>
      {/* ── LEGAL POPUP MODAL ──────────────────────────────── */}
      <AnimatePresence>
        {activePopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActivePopup(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 24 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'rgba(13,13,13,0.98)', border: '1px solid rgba(255,107,44,0.25)', borderRadius: 20, maxWidth: 620, width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 60px rgba(255,107,44,0.15), 0 40px 80px rgba(0,0,0,0.6)' }}>
              
              <div style={{ padding: '24px 36px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F5F5F5', margin: 0, letterSpacing: '-0.02em', textTransform: 'capitalize' }}>{activePopup}</h3>
                <button onClick={() => setActivePopup(null)}
                  style={{ background: 'rgba(255,107,44,0.12)', border: '1px solid rgba(255,107,44,0.2)', borderRadius: 8, color: '#A1A1AA', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,44,0.25)'; e.currentTarget.style.color = '#F5F5F5'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,44,0.12)'; e.currentTarget.style.color = '#A1A1AA'; }}>
                  <X size={16} />
                </button>
              </div>

              <div data-lenis-prevent="true" style={{ padding: '24px 36px', overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', flex: 1 }}>
                {getPopupContent(activePopup)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{
        position: 'relative',
        overflow: 'hidden',
        marginTop: 0,
        background: 'var(--footer-bg)',
        fontFamily: "'Satoshi', 'General Sans', sans-serif",
        borderTop: '1px solid var(--footer-border)'
      }}>

        {/* ── TOP RADIAL GLOW ─────────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '120px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 107, 44, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* ── ANIMATED GRID ───────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.25,
          backgroundImage: `linear-gradient(rgba(255,107,44,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,44,0.01) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        {/* ── AMBIENT GLOW ORBS ───────────────────────────── */}
        <div style={{ position: 'absolute', bottom: -60, left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,44,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, right: '5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <style>{`
          @keyframes footerLogoGlow {
            0%,100% { box-shadow: 0 0 20px rgba(255,107,44,0.35), 0 0 40px rgba(255,107,44,0.15); }
            50%      { box-shadow: 0 0 35px rgba(255,107,44,0.55), 0 0 70px rgba(255,107,44,0.25); }
          }
          .ft-social-icon {
            display: flex; align-items: center; justify-content: center;
            width: 38px; height: 38px; border-radius: 10px;
            background: rgba(255,107,44,0.06);
            color: #FF6B2C;
            border: 1px solid rgba(255,107,44,0.2);
            transition: all 0.25s ease;
            text-decoration: none;
            cursor: pointer;
          }
          .ft-social-icon:hover {
            background: rgba(255,107,44,0.18);
            color: #FF6B2C;
            border-color: rgba(255,107,44,0.45);
            box-shadow: 0 0 16px rgba(255,107,44,0.25), 0 0 40px rgba(124,58,237,0.15);
            transform: translateY(-3px) scale(1.08);
          }
          .ft-link {
            font-size: 14px; color: #A1A1AA; text-decoration: none;
            line-height: 2.2; transition: all 0.2s;
            display: inline-flex; align-items: center; gap: 6px;
            font-weight: 500;
          }
          .ft-link:hover { color: #FF6B2C; transform: translateX(4px); }
          .ft-bottom-link {
            font-size: 12px; color: #71717A; text-decoration: none;
            font-weight: 500; transition: color 0.2s;
          }
          .ft-bottom-link:hover { color: #FF6B2C; }
          .ft-col-heading {
            font-size: 11px; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.12em;
            margin-bottom: 20px;
            background: linear-gradient(90deg, #FF6B2C, #7C3AED);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          @property --mouse-x { syntax: '<length>'; inherits: true; initial-value: 50%; }
          @property --mouse-y { syntax: '<length>'; inherits: true; initial-value: 50%; }
          
          .ft-watermark {
            position: relative;
            font-size: clamp(3rem, 16vw, 15rem);
            font-weight: 900;
            font-family: 'Clash Display', sans-serif;
            letter-spacing: -0.02em;
            line-height: 1.15;
            user-select: none;
            pointer-events: auto;
            margin-bottom: 64px;
            text-align: center;
            width: 100%;
            white-space: nowrap;
            overflow: visible;
            color: transparent;
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.35);
            transition: color 0.6s ease, -webkit-text-stroke 0.6s ease;
            cursor: default;
          }
          .ft-watermark:hover {
            color: #DE6A39; /* Matte orange finish */
            -webkit-text-stroke: 1px transparent;
          }
          .footer-main-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 80px;
            margin-bottom: 72px;
          }
          @media (max-width: 768px) {
            .footer-main-grid {
              grid-template-columns: 1fr;
              gap: 40px;
              margin-bottom: 48px;
            }
          }
        `}</style>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 0', position: 'relative', zIndex: 1 }}>

          {/* Large Outlined Brand Watermark "Bridge AI" */}
          <div 
            className="ft-watermark"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            }}
          >
            Bridge AI
          </div>

          {/* ── MAIN GRID ───────────────────────────────── */}
          <div className="footer-main-grid">

            {/* Brand Column */}
            <div>
              {/* Logo with glow */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                {/* B Logo Icon */}
                <div style={{ width: 42, height: 42, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                    <defs>
                      <mask id="footer-logo-cutout">
                        <rect x="0" y="0" width="100" height="100" fill="white" />
                        <path d="M 16 66 C 30 50, 60 42, 92 60 C 60 46, 30 54, 16 66 Z" fill="black" />
                      </mask>
                    </defs>
                    <path fillRule="evenodd" clipRule="evenodd" d="M30 20 H58 C72 20 80 26 80 35 C80 42 75 47 68 49 C77 51 82 56 82 65 C82 76 73 80 58 80 H30 V20 Z M44 32 H55 C61 32 66 34 66 38 C66 42 61 44 55 44 H44 V32 Z M44 54 H57 C63 54 68 56 68 60 C68 64 63 66 57 66 H44 V54 Z" fill="currentColor" mask="url(#footer-logo-cutout)"/>
                    <path d="M 19 65 C 32 52, 60 45, 89 59 C 60 49, 32 56, 19 65 Z" fill="currentColor" />
                  </svg>
                </div>
                {/* Vertical Divider */}
                <div style={{ width: 1, height: 32, background: 'rgba(255, 255, 255, 0.25)' }} />
                {/* Two-Line Brand Text */}
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                    Bridge
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FF6B2C', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                    AI
                  </span>
                </div>
              </div>

              <p style={{ color: '#A1A1AA', lineHeight: 1.85, maxWidth: 300, marginBottom: 32, fontSize: 14, fontWeight: 400, opacity: 0.85 }}>
                BridgeAI — The easiest way to move your AI conversations anywhere.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: <Mail size={16} />, label: 'Support Email', href: 'mailto:business@entrext.in', external: true },
                  { icon: <LinkedinIcon />, label: 'LinkedIn', href: 'https://www.linkedin.com/company/entrext/posts/?feedView=all', external: true },
                  { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/entrext.labs', external: true },
                  { icon: <Link2 size={16} />, label: 'Linktree', href: 'https://linktr.ee/entrext.pro', external: true },
                ].map((s, i) => {
                  const Tag = 'a';
                  return (
                    <Tag key={i} href={s.href} title={s.label} className="ft-social-icon"
                      {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {s.icon}
                    </Tag>
                  );
                })}
              </div>
            </div>

            {/* Platform */}
            <div>
              <div className="ft-col-heading">Platform</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: 'Intelligence Forge', to: '/dashboard' },
                  { label: 'Analyst Module', to: '/extension' },
                  { label: 'Pricing Plans', to: '/services' },
                ].map((l, i) => (
                  <Link key={i} to={l.to} className="ft-link" onClick={() => window.scrollTo(0, 0)}>{l.label}</Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="ft-col-heading">Resources</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: 'Protocol Docs', to: '/docs' },
                  { label: 'About BridgeAI', to: '/about' },
                  { label: 'Insights Blog', to: '/blog' },
                  { label: 'Support Center', to: '/support' },
                ].map((l, i) => (
                  <Link key={i} to={l.to} className="ft-link" onClick={() => window.scrollTo(0, 0)}>{l.label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM BAR ──────────────────────────────── */}
          <div style={{ borderTop: '1px solid rgba(255,107,44,0.12)', paddingTop: 28, paddingBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ fontSize: 12, color: '#71717A', fontWeight: 500, letterSpacing: '0.02em' }}>
              © 2026 BridgeAI Protocol. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { label: 'Privacy Policy', key: 'privacy' },
                { label: 'Terms of Service', key: 'terms of actions' },
                { label: 'Cookie Policy', key: 'cookie' },
                { label: 'Refund Policy', key: 'refund policy' },
              ].map(item => (
                <button key={item.key} onClick={() => setActivePopup(item.key)}
                  className="ft-bottom-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
