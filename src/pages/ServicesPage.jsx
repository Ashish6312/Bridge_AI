import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, Share2, Layers, GitMerge, Database, Shield, Check, X, 
  ArrowRight, Puzzle, Globe, Brain, MessageSquare, Settings, 
  BookOpen, Wand2, Download, Search, RefreshCw, Cpu, Target
} from 'lucide-react';
import { API_BASE } from '../apiConfig';

const CheckIcon = ({ color = "var(--primary)" }) => (
  <div style={{ background: 'rgba(222, 106, 57, 0.12)', padding: '3px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(222, 106, 57, 0.2)' }}>
    <Check size={11} color={color} strokeWidth={3.5} />
  </div>
);

const XIcon = () => (
  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '3px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <X size={11} color="#ef4444" strokeWidth={3.5} />
  </div>
);

const SERVICES = [
  { 
    icon: <Brain size={24} />, 
    title: "AI Memory Compilation", 
    desc: "Let AI automatically read all your saved chats and distill them into a structured memory layer — tech stack, goals, rules, and problem statement. One click to compile everything."
  },
  { 
    icon: <MessageSquare size={24} />, 
    title: "AI Project Assistant", 
    desc: "Chat with an AI that knows your entire project — saved conversations, decisions, tech stack and rules. Ask questions, generate onboarding docs, or draft system prompts grounded in your actual context."
  },
  { 
    icon: <Layers size={24} />, 
    title: "Project Workspaces", 
    desc: "Organize all your AI conversations, decisions, and memory into dedicated project folders. Each workspace has its own Saved Chats, Problem & Rules, Decisions Ledger, and AI Assistant tab."
  },
  { 
    icon: <Settings size={24} />, 
    title: "Decision Ledger", 
    desc: "Log, track, and elaborate on every architectural or business decision with AI. Mark decisions as Accepted, Rejected, or Open Questions. Get full AI analysis on any decision instantly."
  },
  { 
    icon: <Zap size={24} />, 
    title: "5 Intelligence Modes", 
    desc: "Extract intelligence in the exact format you need — Quick TL;DR, Developer Context (goals/bugs/next steps), Research Notes, Study Notes, or Project Status report. AI adapts to your workflow."
  },
  { 
    icon: <Share2 size={24} />, 
    title: "Universal Context Transfer", 
    desc: "Move conversations from ChatGPT to Claude, Gemini, DeepSeek, Perplexity, Mistral, Poe and more with one click. Sync context instantly — no re-explaining, no lost state."
  },
  { 
    icon: <Wand2 size={24} />, 
    title: "Smart AI Tools", 
    desc: "Smart Rename uses AI to auto-generate titles for your saved bridges. Prompt Optimizer distills any summary into a battle-tested system prompt. Regenerate summaries with a single click."
  },
  { 
    icon: <Download size={24} />, 
    title: "Multi-Format Export", 
    desc: "Export any saved conversation bridge as Markdown (.md), structured JSON, or a ready-to-paste Prompt Pack (.txt). Share intelligence across your tools and teammates effortlessly."
  },
  { 
    icon: <Globe size={24} />, 
    title: "Universal Bridge Forge", 
    desc: "Forge a bridge to any AI platform — even ones not in the built-in list. Enter any URL, and BridgeAI will copy your context and open the target directly. Works everywhere AI works."
  },
];

const FREE_FEATURES = [
  { label: '10 Saved Bridges / Month', included: true },
  { label: 'Quick Intelligence Mode', included: true },
  { label: 'Transfer to 7 AI Platforms', included: true },
  { label: 'Last 7 Days of History', included: true },
  { label: 'Basic Title Search', included: true },
  { label: 'Community Support', included: true },
  { label: 'Project Workspaces', included: false },
  { label: 'AI Memory Compilation', included: false },
  { label: 'AI Project Assistant Chat', included: false },
  { label: 'Decision Ledger', included: false },
];

const PRO_FEATURES = [
  { label: 'Unlimited Saved Bridges', included: true },
  { label: 'All 5 Intelligence Modes', included: true },
  { label: 'Full Conversation History', included: true },
  { label: 'Advanced Context Search', included: true },
  { label: 'Project Workspaces', included: true },
  { label: 'AI Memory Compilation', included: true },
  { label: 'AI Project Assistant Chat', included: true },
  { label: 'Decision Ledger + AI Analysis', included: true },
  { label: 'Problem & Rules Memory Layer', included: true },
  { label: 'Smart Rename + Prompt Optimizer', included: true },
  { label: 'Multi-Format Export (MD/JSON/TXT)', included: true },
  { label: 'Priority Support', included: true },
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
        body: JSON.stringify({ email: user.email, plan: planKey, amount })
      });
      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...user, plan: planKey };
        localStorage.setItem('bridge_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        try {
          window.dispatchEvent(new CustomEvent('BRIDGE_AUTH_UPDATE', { detail: { user: updatedUser } }));
          window.dispatchEvent(new CustomEvent('RELOAD_EXTENSION'));
        } catch (e) {}
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(222, 106, 57, 0.08)', borderRadius: '100px', marginBottom: '24px', border: '1px solid rgba(222, 106, 57, 0.2)' }}>
              <Puzzle size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>Services & Pricing</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 1.1 }}>
              Your AI Intelligence <br /><span style={{ color: 'var(--primary)' }}>Headquarters</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.6', maxWidth: '680px', margin: '0 auto 72px' }}>
              BridgeAI is more than a context switcher. It's a full project memory system — compile AI knowledge, track decisions, chat with your vault, and transfer context across every platform you use.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid-auto-fit-medium" style={{ gap: '20px' }}>
            {SERVICES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  padding: '32px', textAlign: 'left', borderRadius: '20px',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow)', transition: 'all 0.3s ease'
                }}
                whileHover={{ y: -4, borderColor: 'rgba(222, 106, 57, 0.3)', boxShadow: '0 12px 40px rgba(222, 106, 57, 0.06)' }}
              >
                <div style={{
                  background: 'rgba(222, 106, 57, 0.08)', color: 'var(--primary)',
                  width: '48px', height: '48px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px', border: '1px solid rgba(222, 106, 57, 0.15)'
                }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.88rem' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers ─────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 0', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.03em' }}>
              Simple Pricing
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Start free. Unlock the full intelligence stack when you're ready.</p>
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

          <div className="grid-responsive-2" style={{ gap: '28px', maxWidth: '960px', margin: '0 auto', alignItems: 'stretch' }}>

            {/* ── Free Tier ───────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                background: 'var(--bg-secondary)', padding: '36px 32px', borderRadius: '24px',
                border: '1px solid var(--border)', position: 'relative',
                boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px', display: 'block' }}>FREE</span>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>$0</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>/month</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px', lineHeight: '1.55' }}>
                Perfect for exploring BridgeAI and testing cross-AI workflows.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {FREE_FEATURES.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.83rem', color: f.included ? 'var(--text-main)' : 'var(--text-muted)', alignItems: 'center', lineHeight: '1.3' }}>
                    {f.included ? <CheckIcon /> : <XIcon />}
                    <span style={{ textDecoration: f.included ? 'none' : 'none', opacity: f.included ? 1 : 0.5 }}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (user) {
                    if (user.plan !== 'free') handlePurchaseClick('free', 0);
                  } else {
                    navigate('/signup');
                  }
                }}
                disabled={user?.plan === 'free'}
                className="btn-secondary"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem' }}
              >
                {user?.plan === 'free' ? 'Current Plan' : 'Start Free'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                No credit card required.
              </div>
            </motion.div>

            {/* ── Pro Tier ────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                background: 'var(--bg-secondary)', padding: '36px 32px', borderRadius: '24px',
                border: '2px solid var(--primary)', position: 'relative',
                boxShadow: '0 0 0 1px rgba(222,106,57,0.1), 0 24px 60px rgba(222,106,57,0.08)',
                display: 'flex', flexDirection: 'column', zIndex: 2
              }}
            >
              {/* Most Popular badge */}
              <div style={{
                position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--primary)', color: 'white', padding: '5px 18px',
                borderRadius: '100px', fontSize: '0.68rem', fontWeight: '800',
                letterSpacing: '0.08em', whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(222,106,57,0.4)'
              }}>
                MOST POPULAR
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>PRO</span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: '800',
                  background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  padding: '4px 12px', borderRadius: '100px'
                }}>🎁 7-Day Free Trial</span>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>$5</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>/month</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px', lineHeight: '1.55' }}>
                Full AI memory stack for developers, researchers, and power users.
              </p>

              {/* Pro features in 2 columns */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px 20px', flex: 1 }}>
                {PRO_FEATURES.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.83rem', color: 'var(--text-main)', alignItems: 'flex-start', lineHeight: '1.3' }}>
                    <CheckIcon />
                    {f.label}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchaseClick('pro', 5)}
                disabled={upgrading === 'pro' || user?.plan === 'pro' || user?.plan === 'infinite'}
                className="btn-primary"
                style={{ width: '100%', padding: '15px', borderRadius: '12px', fontWeight: '700', fontSize: '0.97rem' }}
              >
                {upgrading === 'pro'
                  ? 'Processing...'
                  : (user?.plan === 'pro' || user?.plan === 'infinite')
                  ? 'Current Plan'
                  : 'Start 7-Day Free Trial'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Cancel anytime.
              </div>
            </motion.div>
          </div>

          {/* Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: '860px', margin: '64px auto 0' }}
          >
            <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '32px', letterSpacing: '-0.02em' }}>
              Full Feature Comparison
            </h3>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', background: 'rgba(0,0,0,0.15)', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>FEATURE</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', textAlign: 'center' }}>FREE</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.05em', textAlign: 'center' }}>PRO</span>
              </div>
              {[
                { feature: 'Saved Bridges / Month',            free: '10',            pro: 'Unlimited' },
                { feature: 'Context History',                  free: '7 Days',        pro: 'Unlimited' },
                { feature: 'Intelligence Modes',               free: 'Quick Only',    pro: 'All 5 Modes' },
                { feature: 'Context Search',                   free: 'Title Only',    pro: 'Full-Text + Source' },
                { feature: 'Project Workspaces',               free: false,           pro: true },
                { feature: 'AI Memory Compilation',            free: false,           pro: true },
                { feature: 'AI Project Assistant Chat',        free: false,           pro: true },
                { feature: 'Decision Ledger + AI Elaboration', free: false,           pro: true },
                { feature: 'Problem & Rules Memory Layer',     free: false,           pro: true },
                { feature: 'Smart Rename (AI Title Gen)',       free: false,           pro: true },
                { feature: 'Prompt Optimizer',                 free: false,           pro: true },
                { feature: 'Multi-Format Export (MD/JSON/TXT)',free: false,           pro: true },
                { feature: 'Dispatch to Email',                free: false,           pro: true },
                { feature: 'Universal Bridge Forge',           free: true,            pro: true },
                { feature: 'Transfer to 7+ AI Platforms',     free: true,            pro: true },
                { feature: 'Chrome Extension',                 free: true,            pro: true },
                { feature: 'Support',                         free: 'Community',     pro: 'Priority' },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 120px 120px',
                    padding: '13px 24px', borderBottom: i < 16 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '500' }}>{row.feature}</span>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {typeof row.free === 'boolean'
                      ? (row.free ? <CheckIcon /> : <XIcon />)
                      : <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>{row.free}</span>
                    }
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {typeof row.pro === 'boolean'
                      ? (row.pro ? <CheckIcon /> : <XIcon />)
                      : <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '700', textAlign: 'center' }}>{row.pro}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{
            background: 'var(--bg-secondary)', padding: '100px 40px', borderRadius: '40px',
            textAlign: 'center', color: 'var(--text-main)', position: 'relative', overflow: 'hidden',
            border: '2px solid var(--primary)', boxShadow: 'var(--shadow)'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(222, 106, 57, 0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: '900', marginBottom: '24px', position: 'relative', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              Your AI Vault is<br />Waiting to Be Built
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '48px', maxWidth: '680px', margin: '0 auto 48px', position: 'relative', lineHeight: 1.6 }}>
              Stop repeating yourself across AI platforms. Build a persistent memory layer for every project — powered by your own conversations, decisions, and context.
            </p>
            <div className="mobile-col" style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative' }}>
              <Link to="/signup" className="btn-primary" style={{ padding: '18px 48px', fontSize: '1.05rem', borderRadius: '14px', textDecoration: 'none' }}>
                Start Free Trial
              </Link>
              <Link to="/extension" style={{ padding: '18px 48px', background: 'var(--gray-50)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem' }}>
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
          background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '48px', maxWidth: '440px', width: '90%', textAlign: 'center',
              background: 'var(--bg-secondary)', borderRadius: '24px',
              border: '1px solid var(--border)', boxShadow: 'var(--shadow)'
            }}
          >
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(222, 106, 57, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(222, 106, 57, 0.2)' }}>
                <Shield size={32} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>Secure Enrollment</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6', fontSize: '1rem' }}>
              {confirmModal.amount === 0 ? (
                <>You are about to enroll in the <strong>{confirmModal.planKey?.toUpperCase()}</strong> plan.</>
              ) : (
                <>You are about to upgrade to the <strong>{confirmModal.planKey?.toUpperCase()}</strong> plan for <strong style={{ color: 'var(--text-main)' }}>${confirmModal.amount}/mo</strong>.</>
              )}
              <br /><br />
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
