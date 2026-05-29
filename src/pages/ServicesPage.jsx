import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Share2, Layers, GitMerge, Database, Shield, Check, X, ArrowRight, Puzzle, Globe } from 'lucide-react';
import { API_BASE } from '../apiConfig';

const CheckIcon = ({ color = "var(--primary)" }) => (
  <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Check size={14} color={color} strokeWidth={3} />
  </div>
);

const XIcon = () => (
  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <X size={14} color="#ef4444" strokeWidth={3} />
  </div>
);

const SERVICES = [
  { 
    icon: <Share2 size={24} />, 
    title: "Context Transfer", 
    desc: "Move conversations from ChatGPT to Claude, Gemini, DeepSeek, Perplexity, and more with a single click. No copy-pasting. No re-explaining. No lost context."
  },
  { 
    icon: <Zap size={24} />, 
    title: "Smart Context Extraction", 
    desc: "BridgeAI automatically identifies the important parts of your conversation, including instructions, project requirements, research findings, and code snippets while filtering out unnecessary noise."
  },
  { 
    icon: <GitMerge size={24} />, 
    title: "Instant AI Switching", 
    desc: "Use the best AI for every task. Start brainstorming in one platform, continue refining in another, and finish in the tool that works best for you. BridgeAI keeps everything connected."
  },
  { 
    icon: <Shield size={24} />, 
    title: "Private & Secure", 
    desc: "Your conversations stay under your control. BridgeAI is designed with privacy in mind, using secure storage and encrypted transfers to protect your information."
  },
  { 
    icon: <Layers size={24} />, 
    title: "Project Workspaces", 
    desc: "Organize conversations, prompts, and research by project. Keep everything structured so you can return to important work whenever you need it."
  },
  { 
    icon: <Globe size={24} />, 
    title: "Universal AI Compatibility", 
    desc: "Works with leading AI platforms including ChatGPT, Claude, Gemini, DeepSeek, Perplexity, Mistral, and more."
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
        const updatedUser = { ...user, plan: planKey };
        localStorage.setItem('bridge_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage(`Success! Upgraded to ${planKey.toUpperCase()} tier.`);
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("Connection error. Please try again.");
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ padding: '100px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--gray-100)', borderRadius: '100px', marginBottom: '24px', border: '1px solid var(--gray-200)' }}>
              <Puzzle size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Services</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 1.1 }}>
              Everything You Need to <br /> <span style={{ color: 'var(--primary)' }}>Work Across AI Platforms</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 64px' }}>
              BridgeAI helps you move conversations, projects, prompts, research, and workflows between AI tools without losing context. Whether you're a student, developer, founder, marketer, writer, or researcher, BridgeAI keeps your work moving forward.
            </p>
          </motion.div>

          <div className="grid-auto-fit-medium" style={{ gap: '24px' }}>
            {SERVICES.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  padding: '40px', textAlign: 'left', borderRadius: '24px',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow)',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ y: -5, borderColor: 'var(--primary)', boxShadow: 'var(--shadow-hover)' }}
              >
                <div style={{ 
                  background: 'var(--gray-100)', color: 'var(--primary)', 
                  width: '48px', height: '48px', borderRadius: '12px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
                }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers ─────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 0', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
              Pricing
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Everything you need to work seamlessly across AI platforms.</p>
            
            {message && (
              <div style={{ 
                marginTop: '24px', padding: '12px 24px', borderRadius: '12px', display: 'inline-block',
                background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${message.includes('Error') ? '#fee2e2' : '#dcfce7'}`,
                color: message.includes('Error') ? '#b91c1c' : '#15803d',
                fontWeight: '600', fontSize: '0.9rem'
              }}>
                {message}
              </div>
            )}
          </div>

          <div className="grid-responsive-2" style={{ gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
            
            {/* Free Tier */}
            <div style={{ 
              background: 'var(--bg-secondary)', padding: '48px 40px', borderRadius: '24px', 
              border: '1px solid var(--border)', position: 'relative', width: '100%',
              boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>Free</span>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)' }}>₹0</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> 7-Day Pro Trial</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> 100 Context Transfers / Month</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> ChatGPT, Claude, Gemini Support</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> Basic Context Transfer</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> Community Support</li>
              </ul>
              <button 
                onClick={() => navigate('/signup')}
                className="btn-secondary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '700' }}
              >
                Start Free
              </button>
            </div>

            {/* Pro Tier */}
            <div style={{ 
              background: 'var(--bg-secondary)', padding: '48px 40px', borderRadius: '24px', 
              border: '2px solid var(--primary)', position: 'relative', width: '100%',
              boxShadow: 'var(--shadow-hover)', display: 'flex', flexDirection: 'column', zIndex: 2
            }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '4px 16px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>Pro (Recommended)</span>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)' }}>₹299</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> Unlimited Transfers</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> Unlimited Projects</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> Context Vault</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> Smart Context Optimization</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> Priority Support</li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}><CheckIcon /> Early Access Features</li>
              </ul>
              <button 
                onClick={() => handlePurchaseClick('premium', 299)}
                disabled={upgrading === 'premium' || user?.plan === 'premium'}
                className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '700' }}
              >
                {upgrading === 'premium' ? "Processing..." : (user?.plan === 'premium') ? "Current Plan" : "Upgrade to Pro"}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ 
            background: 'var(--bg-secondary)', padding: '100px 40px', borderRadius: '40px', 
            textAlign: 'center', color: 'var(--text-main)', position: 'relative', overflow: 'hidden',
            border: '2px solid var(--primary)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: '900', marginBottom: '24px', position: 'relative', letterSpacing: '-0.04em', lineHeight: 1.1 }}>Ready to Stop<br />Repeating Yourself?</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '48px', maxWidth: '700px', margin: '0 auto 48px', position: 'relative', lineHeight: 1.6 }}>
              Thousands of people use multiple AI tools every day. BridgeAI helps them switch platforms without losing context, momentum, or productivity. Start using the right AI for every task—without starting over every time.
            </p>
            <div className="mobile-col" style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative' }}>
              <Link to="/signup" className="btn-primary" style={{ padding: '18px 48px', fontSize: '1.1rem', borderRadius: '14px', textDecoration: 'none' }}>
                Start Free Trial
              </Link>
              <Link to="/extension" style={{ padding: '18px 48px', background: 'var(--gray-50)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                Install Extension <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Payment Confirmation Modal ─────────────────── */}
      {confirmModal.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              padding: '48px', maxWidth: '440px', width: '90%', textAlign: 'center', 
              background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}
          >
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Shield size={32} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>Secure Enrollment</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6', fontSize: '1rem' }}>
              {confirmModal.amount === 0 ? (
                <>You are about to enroll in the <strong>{confirmModal.planKey.toUpperCase()}</strong> plan.</>
              ) : (
                <>You are about to upgrade to the <strong>{confirmModal.planKey.toUpperCase()}</strong> plan for <strong style={{ color: 'var(--text-main)' }}>${confirmModal.amount}</strong>.</>
              )}
              <br/><br/>
              This is a sandbox payment simulation. Your plan will be updated instantly.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setConfirmModal({ show: false, planKey: null, amount: null })}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: '700' }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handlePurchaseConfirm}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: '700' }}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ServicesPage;
