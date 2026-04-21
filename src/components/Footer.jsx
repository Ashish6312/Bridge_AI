import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../apiConfig';


const TwitterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 11.5 5 10c-3-2-2.1-5.2-2.1-5.2 2 1.6 4.3 2 4.3 2C5 4.5 9 1 12 5c1.4.0 2.8-.7 4-1.5-1 2-2 3-2 3s1.2-.5 2-1z"/></svg>;
const GithubIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.8c0-1.2-.5-2.4-1.4-3.2 3.4-.4 7-1.7 7-7.5 0-1.7-.6-3-1.5-4-.2-.5-.7-2.2.1-4.4 0 0-1.3-.4-4 1.4-1.2-.3-2.5-.5-3.8-.5s-2.6.2-3.8.5C5.5 2.8 4.2 3.2 4.2 3.2.9 5.4.5 7.1.3 7.6c-.9 1-1.5 2.4-1.5 4 0 5.8 3.6 7 7 7.5-.9.8-1.4 2-1.4 3.2V23"/></svg>;
const LinkedinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const location = useLocation();

  const hideNewsletter = ['/dashboard', '/login', '/signup', '/profile'].includes(location.pathname);

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
        
        {/* Top Newsletter CTA */}
        {!hideNewsletter && (
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '24px', padding: '40px', display: 'flex', justifyContent: 'space-between', 
            alignItems: 'center', flexWrap: 'wrap', gap: '24px'
          }}>
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
            <h4 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.5px' }}>Platform Capabilities</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { l: 'Operational Services', t: '/services' },
                { l: 'Intelligence Dashboard', t: '/dashboard' },
                { l: 'Developer Options', t: '/dashboard' },
                { l: 'Sovereign Vault', t: '/dashboard' }
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
            <h4 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.5px' }}>Sovereign Entity</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { l: 'About BridgeAI', t: '/about' },
                { l: 'Mission & Vision', t: '/about' },
                { l: 'Security Protocols', t: '/services' },
                { l: 'Privacy Rights', t: '/services' }
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
            <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>Privacy Policy</Link>
            <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>Terms of Service</Link>
            <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>Cookie Protocols</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
