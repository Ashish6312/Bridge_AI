import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowRight, Mail, CheckCircle2, X, Shield, Lock, Cookie } from 'lucide-react';
import { apiFetch } from '../apiConfig';


const TwitterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 11.5 5 10c-3-2-2.1-5.2-2.1-5.2 2 1.6 4.3 2 4.3 2C5 4.5 9 1 12 5c1.4.0 2.8-.7 4-1.5-1 2-2 3-2 3s1.2-.5 2-1z"/></svg>;
const GithubIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.8c0-1.2-.5-2.4-1.4-3.2 3.4-.4 7-1.7 7-7.5 0-1.7-.6-3-1.5-4-.2-.5-.7-2.2.1-4.4 0 0-1.3-.4-4 1.4-1.2-.3-2.5-.5-3.8-.5s-2.6.2-3.8.5C5.5 2.8 4.2 3.2 4.2 3.2.9 5.4.5 7.1.3 7.6c-.9 1-1.5 2.4-1.5 4 0 5.8 3.6 7 7 7.5-.9.8-1.4 2-1.4 3.2V23"/></svg>;
const LinkedinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [activeModal, setActiveModal] = useState(null);
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('bridge_user');

  const showCTA = location.pathname === '/';

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus('loading');
    try {
      const response = await apiFetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  };

  const modalContent = {
    privacy: {
      title: "Privacy Rights & Data Sovereignity",
      icon: <Shield size={32} className="premium-gradient-text" style={{ stroke: 'var(--primary)' }} />,
      content: [
        "Your intelligence tokens are encrypted using AES-256 before being vaulted in the Sovereign Hub.",
        "We implement a zero-retention policy for raw chat logs once the Bridge Intelligence Bundle is generated.",
        "Local telemetry is only used to optimize extraction speed and is never shared with third-party networks.",
        "You maintain full ownership of all synthesized prompts and optimized context bridges."
      ]
    },
    terms: {
      title: "Terms of Sovereign Operation",
      icon: <Lock size={32} style={{ color: 'var(--secondary)' }} />,
      content: [
        "The BridgeAI protocol is designed for technical workflow acceleration and logical context relay.",
        "Users agree not to use the platform for the generation of malicious code or restricted intelligence vectors.",
        "Subscription tiers dictate extraction quotas; exceeding these will trigger automated rate-limiting.",
        "BridgeAI is not liable for hallucinations produced by the destination LLMs after context relay."
      ]
    },
    cookies: {
      title: "Cookie & Protocol Telemetry",
      icon: <Cookie size={32} style={{ color: 'var(--accent)' }} />,
      content: [
        "We utilize functional session cookies to maintain your Sovereign Hub authentication state.",
        "Protocol cookies are used to track extraction success rates across different AI platforms.",
        "No marketing or third-party tracking pixels are permitted within the BridgeAI architecture.",
        "Analytics are strictly limited to system performance and API latency monitoring."
      ]
    }
  };

  const PolicyModal = ({ type, onClose }) => {
    const data = modalContent[type];
    if (!data) return null;

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', 
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card"
          style={{ 
            maxWidth: '550px', width: '100%', padding: '40px', position: 'relative',
            border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden'
          }}
        >
          {/* Decorative background glow */}
          <div style={{ 
            position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px',
            background: type === 'privacy' ? 'var(--primary)' : type === 'terms' ? 'var(--secondary)' : 'var(--accent)',
            filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%', zIndex: -1
          }} />

          <button 
            onClick={onClose}
            style={{ 
              position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', padding: '8px',
              color: 'white', cursor: 'pointer', display: 'flex', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ 
              padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)', display: 'flex'
            }}>
              {data.icon}
            </div>
            <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'white', letterSpacing: '-0.5px' }}>{data.title}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {data.content.map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ 
                  width: '6px', height: '6px', borderRadius: '50%', 
                  background: type === 'privacy' ? 'var(--primary)' : type === 'terms' ? 'var(--secondary)' : 'var(--accent)',
                  marginTop: '10px', flexShrink: 0, boxShadow: `0 0 10px ${type === 'privacy' ? 'var(--primary)' : type === 'terms' ? 'var(--secondary)' : 'var(--accent)'}`
                }} />
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>

          <button 
            className="btn-primary" 
            onClick={onClose}
            style={{ width: '100%', marginTop: '40px', padding: '16px' }}
          >
            Acknowledge Protocol
          </button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <footer 
      style={{ 
        padding: '80px 0 40px', 
        background: 'linear-gradient(to bottom, transparent, rgba(2, 6, 23, 0.95))', 
        backdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(255,255,255,0.08)', 
        marginTop: 'auto',
        position: 'relative',
        zIndex: 100
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* Top CTA Section */}
        {showCTA && (
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '24px', padding: '40px', display: 'flex', justifyContent: 'space-between', 
            alignItems: 'center', flexWrap: 'wrap', gap: '24px'
          }}>
            {!isLoggedIn ? (
              <>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: 'white' }}>Join the Sovereign Network</h3>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Get weekly insights on cross-LLM context protocols and bridging strategies.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flex: '1', maxWidth: '400px' }}>
                  <input 
                    type="email" 
                    placeholder="analyst@bridgeai.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleSubscribe(); }}
                    style={{ 
                      flex: 1, padding: '14px 20px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', 
                      border: '1px solid var(--glass-border)', color: 'white', outline: 'none' 
                    }}
                  />
                  <button 
                    className="btn-primary" 
                    onClick={handleSubscribe}
                    disabled={status === 'loading' || status === 'success'}
                    style={{ padding: '0 24px' }}
                  >
                    {status === 'loading' ? 'Subscribing...' : status === 'success' ? <><CheckCircle2 size={16} style={{marginRight: '8px'}} /> Subscribed</> : <>Subscribe <ArrowRight size={16} style={{marginLeft: '8px'}} /></>}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} className="pulse" />
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: 'white', letterSpacing: '-0.5px' }}>Protocol Status: Optimal</h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem', maxWidth: '650px', lineHeight: 1.6 }}>
                    Your intelligence hub is synchronized across the network. Monitor your extraction rates or update your security protocols in the dashboard.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: '0.95rem', borderRadius: '14px', fontWeight: '800' }}>Go to Dashboard</Link>
                  <Link to="/docs" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '0.95rem', borderRadius: '14px', fontWeight: '800', background: 'rgba(255,255,255,0.03)' }}>Read Docs</Link>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px' }}>
          
          {/* Brand */}
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--gradient-1)', padding: '8px', borderRadius: '12px', display: 'flex', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
                <Layers size={24} color="white" />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' }}>BridgeAI</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px' }}>
              The world's first cross-LLM context bridge. Unifying developer workflows across all intelligence networks safely and securely.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { icon: <TwitterIcon />, link: '#' },
                { icon: <GithubIcon />, link: '#' },
                { icon: <LinkedinIcon />, link: '#' },
                { icon: <Mail size={18} />, link: '#' }
              ].map((s, i) => (
                <motion.a key={i} href={s.link} whileHover={{ y: -4, color: 'var(--primary)', borderColor: 'var(--primary)' }} style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.5px' }}>Our Features</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { l: 'Plans & Pricing', t: '/services' },
                { l: 'My Dashboard', t: '/dashboard' },
                { l: 'AI Settings', t: '/dashboard' },
                { l: 'Secure Storage', t: '/dashboard' }
              ].map(item => (
                <Link key={item.l} to={item.t} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.querySelector('svg').style.opacity = '1'; e.currentTarget.querySelector('svg').style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.querySelector('svg').style.opacity = '0'; e.currentTarget.querySelector('svg').style.transform = 'translateX(0)'; }}
                >
                  <ArrowRight size={14} color="var(--primary)" style={{ opacity: 0, transition: 'all 0.2s' }} /> {item.l}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.5px' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { l: 'About Us', t: '/about' },
                { l: 'Our Goal', t: '/about' },
                { l: 'Safety First', t: '/services' },
                { l: 'Your Data', t: '/services' }
              ].map(item => (
                <Link key={item.l} to={item.t} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.querySelector('svg').style.opacity = '1'; e.currentTarget.querySelector('svg').style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.querySelector('svg').style.opacity = '0'; e.currentTarget.querySelector('svg').style.transform = 'translateX(0)'; }}
                >
                  <ArrowRight size={14} color="var(--primary)" style={{ opacity: 0, transition: 'all 0.2s' }} /> {item.l}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} BridgeAI Workflow Systems. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem' }}>
            <button 
              onClick={() => setActiveModal('privacy')}
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} 
              onMouseEnter={e => e.currentTarget.style.color='white'} 
              onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setActiveModal('terms')}
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} 
              onMouseEnter={e => e.currentTarget.style.color='white'} 
              onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setActiveModal('cookies')}
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} 
              onMouseEnter={e => e.currentTarget.style.color='white'} 
              onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
            >
              Cookie Protocols
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeModal && (
            <PolicyModal type={activeModal} onClose={() => setActiveModal(null)} />
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
};

export default Footer;
