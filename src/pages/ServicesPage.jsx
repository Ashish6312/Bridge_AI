import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Share2, Layers, GitMerge, Download, Shield, Database, Cpu, Globe } from 'lucide-react';
import { API_BASE } from '../apiConfig';

const CheckIcon = ({ color = "#4ade80" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

const SERVICES = [
  { 
    icon: <Zap size={32} color="#8b5cf6" />, 
    title: "Intelligence Distillation", 
    desc: "Our proprietary extraction engine scours LLM sessions to isolate mission-critical logic from conversational noise. Support for Gemini, ChatGPT, Claude, and DeepSeek.",
    gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), transparent)"
  },
  { 
    icon: <Share2 size={32} color="#06b6d4" />, 
    title: "Zero-Click Bridge Relay", 
    desc: "Seamlessly transition context between hubs. Extract from Gemini and materialize in Claude in under 2 seconds. No manual copying, no context reset.",
    gradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), transparent)"
  },
  { 
    icon: <Layers size={32} color="#f43f5e" />, 
    title: "Multi-Tenant Sovereign Vault", 
    desc: "Each analyst is provided with a cryptographically isolated vault. Organize bridges by project, tag intelligence, and maintain a permanent audit trail.",
    gradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.2), transparent)"
  },
  { 
    icon: <Database size={32} color="#4ade80" />, 
    title: "Prompt Architecture Optimization", 
    desc: "Convert raw chat logs into high-fidelity 'Optimized Prompts'. Our engine refines context for the specific instruction-following strengths of each model.",
    gradient: "linear-gradient(135deg, rgba(74, 222, 128, 0.2), transparent)"
  },
  { 
    icon: <GitMerge size={32} color="#8b5cf6" />, 
    title: "Universal Bridge Forging", 
    desc: "Collect intelligence from any URL on the web. We bridge the gap between static research and interactive LLM sessions without friction.",
    gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), transparent)"
  },
  { 
    icon: <Shield size={32} color="#64748b" />, 
    title: "Enterprise Data Sovereignty", 
    desc: "Maintain absolute control over your intelligence assets. Zero data persistence in Transit. Everything is bound to your secure Google OAuth identity.",
    gradient: "linear-gradient(135deg, rgba(100, 116, 139, 0.2), transparent)"
  }
];

const ServicesPage = () => {
  const [upgrading, setUpgrading] = useState(null);
  const [message, setMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState({ show: false, planKey: null, amount: null });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bridge_user');
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  const handlePurchaseClick = (planKey, amount) => {
    if (!user) {
      navigate('/login?redirect=services');
      return;
    }
    setConfirmModal({ show: true, planKey, amount });
  };

  const handlePurchaseConfirm = async () => {
    const { planKey, amount } = confirmModal;
    setConfirmModal({ show: false, planKey: null, amount: null });
    
    setUpgrading(planKey);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/api/user/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          plan: planKey,
          amount: amount 
        })
      });
      const data = await response.json();
      if (data.success) {
        // Update local state
        const updatedUser = { ...user, plan: planKey };
        localStorage.setItem('bridge_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage(`Success! You have been upgraded to the ${planKey.toUpperCase()} tier.`);
        // Optional: Redirect or just show success
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("Sovereign purchase junction unreachable.");
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <div className="landing-container" style={{ background: 'transparent' }}>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="services-hero" style={{ padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="premium-gradient-text services-title" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '20px' }}>
              Operational Services
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="services-subtitle" style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', maxWidth: '700px', margin: '0 auto 60px' }}
            >
              BridgeAI provides industrial-grade intelligence mobility for modern AI workflows.
              Eliminate context reset and unify your LLM stack.
            </motion.p>
          </motion.div>

          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {SERVICES.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card"
                style={{ 
                  padding: '40px', textAlign: 'left', height: '100%',
                  background: s.gradient, border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ marginBottom: '24px' }}>{s.icon}</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: 'white' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sovereign Pricing Tiers ────────────────────────── */}
      <section id="pricing" style={{ padding: '80px 0', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: 'white', marginBottom: '16px' }}>
              Sovereign Tiers
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '24px' }}> Choose the intelligence relay that fits your project velocity. </p>
            
            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  padding: '12px 24px', borderRadius: '12px', display: 'inline-block',
                  background: message.includes('Error') ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
                  border: `1px solid ${message.includes('Error') ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}`,
                  color: message.includes('Error') ? '#fb7185' : '#10b981',
                  fontWeight: '600'
                }}
              >
                {message}
              </motion.div>
            )}
          </motion.div>

          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'flex-start' }}>
            
            {/* Free Plan */}
            <motion.div whileHover={{ y: -8 }} className="glass-card" style={{ padding: '48px 32px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '800', marginBottom: '24px' }}>SOVEREIGN FREE</h4>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'white' }}>₹0</span>
                <span style={{ color: 'var(--text-muted)' }}>/forever</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon /> 3 Extractions / Month</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon /> Basic TL;DR Mode</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon /> Secure Local Vault</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem', opacity: 0.4 }}><XIcon /> Multi-Chat Merge</li>
              </ul>
              <button 
                onClick={() => handlePurchaseClick('free', 0)}
                disabled={upgrading === 'free' || user?.plan === 'free'}
                className="btn-secondary" style={{ width: '100%', padding: '16px', justifyContent: 'center', opacity: user?.plan === 'free' ? 0.5 : 1 }}
              >
                {upgrading === 'free' ? "Enrolling..." : (user?.plan === 'free' || !user?.plan) ? "Current Plan" : "Enroll in Free"}
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div whileHover={{ y: -8 }} className="glass-card" style={{ 
              padding: '56px 32px', textAlign: 'center', 
              border: (user?.plan === 'pro') ? '2px solid #10b981' : '2px solid var(--primary)', position: 'relative',
              background: 'radial-gradient(circle at top left, rgba(139, 92, 246, 0.1), transparent)'
            }}>
              {(user?.plan === 'pro') && <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800' }}>ACTIVE</div>}
              {(!user?.plan || user.plan === 'free') && <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--gradient-1)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800' }}>MOST ANALYZED</div>}
              <h4 style={{ color: 'var(--primary)', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '800', marginBottom: '24px' }}>ANALYST PRO</h4>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'white' }}>₹499</span>
                <span style={{ color: 'var(--text-muted)' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon color="#8b5cf6" /> 100 Extractions / Month</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon color="#8b5cf6" /> 5 Intelligence Modes</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon color="#8b5cf6" /> Priority Relay Access</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon color="#8b5cf6" /> Project Memory Folders</li>
              </ul>
              <button 
                onClick={() => handlePurchaseClick('pro', 499)}
                disabled={upgrading === 'pro' || user?.plan === 'pro'}
                className="btn-primary" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}
              >
                {upgrading === 'pro' ? "Processing..." : (user?.plan === 'pro') ? "Current Plan" : (user?.plan === 'infinite' ? "Switch to Pro" : "Forge Pro Bridge")}
              </button>
            </motion.div>

            {/* Infinite Plan */}
            <motion.div whileHover={{ y: -8 }} className="glass-card" style={{ 
              padding: '48px 32px', textAlign: 'center', position: 'relative',
              border: (user?.plan === 'infinite') ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.05)' 
            }}>
              {(user?.plan === 'infinite') && <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800' }}>ACTIVE</div>}
              <h4 style={{ color: 'var(--secondary)', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '800', marginBottom: '24px' }}>INFINITE HUB</h4>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'white' }}>₹1,999</span>
                <span style={{ color: 'var(--text-muted)' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon color="#06b6d4" /> Unlimited Extractions</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon color="#06b6d4" /> Multi-Chat Logic Merge</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon color="#06b6d4" /> Export MD/JSON Vaults</li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.95rem' }}><CheckIcon color="#06b6d4" /> 24/7 Sovereign Support</li>
              </ul>
              <button 
                onClick={() => handlePurchaseClick('infinite', 1999)}
                disabled={upgrading === 'infinite' || user?.plan === 'infinite'}
                className="btn-secondary" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}
              >
                {upgrading === 'infinite' ? "Processing..." : (user?.plan === 'infinite') ? "Current Plan" : "Materialize Infinite"}
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Call to Action ──────────────────────────────── */}
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="container">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="services-cta" 
            style={{ 
              padding: '80px 40px', 
              background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '24px',
              backdropFilter: 'none',
              boxShadow: 'none'
            }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: 'white', marginBottom: '20px', fontWeight: '800' }}>
              Built for Professional Analysts
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginBottom: '40px', maxWidth: '650px', lineHeight: 1.7 }}>
              BridgeAI is the primary connective tissue for your generative workflow.
              Industrial-grade context mobility starts here.
            </p>
            <Link to="/dashboard" className="btn-primary" style={{ 
              padding: '18px 48px', fontSize: '1.1rem', background: 'white', color: 'var(--bg-main)', 
              fontWeight: '800', border: 'none', textDecoration: 'none', 
              boxShadow: '0 10px 30px rgba(255,255,255,0.1)' 
            }}>
              Open Your Sovereign Workspace
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Payment Confirmation Modal ─────────────────── */}
      {confirmModal.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center', border: '1px solid var(--primary)', background: '#020617' }}
          >
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={30} color="#8b5cf6" />
              </div>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'white' }}>Mock Payment Gateway</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6' }}>
              {confirmModal.amount === 0 ? (
                <>You are about to enroll in the <strong>{confirmModal.planKey.toUpperCase()}</strong> plan.</>
              ) : (
                <>You are about to purchase the <strong>{confirmModal.planKey.toUpperCase()}</strong> plan for <strong style={{ color: 'white' }}>₹{confirmModal.amount.toLocaleString('en-IN')}</strong>.</>
              )}
              <br/><br/>
              This is a sandbox environment. Your plan will be automatically applied and database will be updated.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setConfirmModal({ show: false, planKey: null, amount: null })}
                style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handlePurchaseConfirm}
                style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
              >
                {confirmModal.amount === 0 ? "Confirm Enrollment" : `Pay ₹${confirmModal.amount.toLocaleString('en-IN')}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ServicesPage;
