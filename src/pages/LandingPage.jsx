import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Check, X, Star, Layers, Copy, ClipboardX, FolderOpen, FileText, RefreshCw, BrainCircuit, Zap, Lock, Globe, FolderArchive } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../apiConfig';
import { useToast } from '../components/ToastContext';
import { Capacitor } from '@capacitor/core';

/* ── palette ── */
const P = '#DE6A39';       // Primary Soft Copper
const SEC_P = '#C55627';   // Secondary Soft Copper
const ACC_RED = '#CD6B6B'; // Accent Red (muted brick-red)
const PURP = '#7C3AED';    // Purple Accent
const BG = 'var(--bg-main)';
const TEXT = 'var(--text-main)';
const MUTED = 'var(--text-secondary)';
const DIM = 'var(--text-muted)';

/* ── Section IDs ── */
const SECTIONS = [
  { id: 'hero',       label: 'Home',     icon: '⊙' },
  { id: 'trusted',    label: 'Trusted',  icon: '◈' },
  { id: 'features',   label: 'Features', icon: '⬡' },
  { id: 'reviews',    label: 'Reviews',  icon: '★' },
  { id: 'comparison', label: 'Compare',  icon: '⊞' },
  { id: 'faq',        label: 'FAQ',      icon: '?' },
];

const FEATURES = [
  { icon: <Layers size={24} />, color: '#3b82f6', tag: 'All-In-One Space', title: 'Unified Project Space', desc: 'Bring chats, code, and project rules from ChatGPT, Claude, and Gemini into a single place.' },
  { icon: <BrainCircuit size={24} />, color: '#ec4899', tag: 'Decision History', title: 'Decision Log', desc: 'Keep track of chosen solutions, rejected options, and open questions with all details saved.' },
  { icon: <Zap size={24} />, color: '#eab308', tag: 'Speed', title: 'Save Hours Every Week', desc: 'Stop copying and pasting or explaining your code rules repeatedly when switching AI tools.' },
  { icon: <Lock size={24} />, color: '#f97316', tag: 'Safe & Secure', title: 'Private & Local-First', desc: 'Keep your sensitive project rules and code details private and stored safely on your own machine.' },
  { icon: <Globe size={24} />, color: '#06b6d4', tag: 'Universal', title: 'Works Everywhere', desc: 'Works with all popular AI tools, command line interfaces, code editors, and AI agents.' },
  { icon: <FolderArchive size={24} />, color: '#f59e0b', tag: 'Fast Start', title: 'Easy Onboarding', desc: 'Share your project history and reasoning logs instantly to get new developers or AI tools up to speed.' },
];

const REVIEWS = [
  { name: 'Mohit Gour', role: 'Backend Architect & Team Lead', rating: 5, avatar: 'MG', color: '#FF6B2C', review: 'I used to keep a manual project context file. BridgeAI auto-compiles that memory layer from our model logs, keeping requirements and business rules synced across teams.' },
  { name: 'Apoorv Nema', role: 'Senior AI Software Engineer', rating: 5, avatar: 'AN', color: '#FF5C5C', review: 'The separation of accepted decisions, rejected alternatives, and open questions is exactly how we reason. BridgeAI makes this memory layer infrastructure real.' },
  { name: 'Shishira Bhat', role: 'CTO, Tech Growth', rating: 5, avatar: 'SB', color: '#7C3AED', review: 'Code comments capture outcomes, but not historical context or reasoning. BridgeAI stores our organizational memory for both humans and AI coders.' },
  { name: 'Kumar Harsh', role: 'AI Agent Builder', rating: 5, avatar: 'KH', color: '#FF6B2C', review: 'Manual docs just do not scale in a multi-agent team. Having a shared memory layer that acts as infrastructure for our agents has doubled our throughput.' },
  { name: 'Francesco Gasparinetti', role: 'SaaS Consultant', rating: 4.5, avatar: 'FG', color: '#7C3AED', review: 'BridgeAI is not an AI utility — it is a productivity booster. It provides business continuity, faster onboarding, and seamless knowledge transfer.' },
  { name: 'Mayank Nirwan', role: 'Lead AI Engineer', rating: 5, avatar: 'MN', color: '#FF5C5C', review: 'My biggest pain was deciding what knowledge should be saved. BridgeAI automatically distills reasoning and active stack rules from raw logs. Truly exceptional.' },
];

const COMPARISON = [
  { us: 'Unified Project Memory Layer', them: 'Fragmented AI chats, Notion docs, and Slack' },
  { us: 'Decision Ledger (Accepted/Rejected/Open)', them: 'No records of why technical choices were made' },
  { us: 'AI-Distilled Context Compilation', them: 'Manual, outdated documentation pages' },
  { us: 'Instant Developer & Agent Onboarding', them: 'Hours spent explaining architecture from scratch' },
  { us: 'Local-First, Secure Encrypted Sync', them: 'Sensitive IP leaked across multiple chat hubs' },
];

const LOGOS = [
  'Students', 'Developers', 'Founders', 'Content Creators', 'Marketers', 'Researchers'
];

const FAQS = [
  { q: "Is BridgeAI just another AI utility or wrapper?", a: "No. BridgeAI is an Organizational Memory System. It functions as a shared knowledge infrastructure, consolidating context, reasoning, and technical decisions from humans, AI tools, and autonomous coding agents into a unified, searchable source of truth." },
  { q: "Why shouldn't our engineering team just build an internal Notion page or markdown document?", a: "Documentation is static and does not scale. Developers rarely keep Notion up to date, and code comments capture outcomes but fail to preserve historical reasoning or rejected alternatives. BridgeAI automates the creation and update of your memory layer directly from your team's chat logs and developer streams." },
  { q: "What business problems does a Shared Knowledge Layer solve?", a: "Organizations lose massive productivity during developer handoffs, onboarding, and model context resets. BridgeAI delivers value by enabling faster developer/agent onboarding, ensuring business continuity, preserving architectural reasoning, and allowing seamless knowledge transfer." },
  { q: "How does the security architecture work for sensitive enterprise code?", a: "BridgeAI is local-first. Your technical rules, code logs, and decision registers are stored encrypted on your device. We offer secure, self-hosted deployment options for enterprises that want absolute data sovereignty." },
  { q: "Can BridgeAI help write prompts or bootstrap autonomous AI coding agents?", a: "Yes. By distilling project memory (Active Stack, Goals, Rules, Decisions), BridgeAI's Context Engine can instantly generate tailored developer onboarding guides, system prompts, or configuration scripts for tools like Cursor, Claude Engineer, or custom AI agents." },
];

/* ── Helper: Star Rating ── */
const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={12} fill={i <= Math.floor(rating) ? '#FF6B2C' : 'transparent'} color={i <= rating ? '#FF6B2C' : '#3f3f46'} />
    ))}
  </div>
);

/* ── Floating UI card placeholder ── */
const FloatCard = ({ style, blurLevel = 0, delay = 0, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [0, -8, 0], transition: { y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay } } }}
    style={{
      position: 'absolute',
      background: 'rgba(13,13,13,0.92)',
      border: `1px solid rgba(255,107,44,0.2)`,
      borderRadius: 16,
      backdropFilter: `blur(${blurLevel}px)`,
      filter: blurLevel > 0 ? `blur(${blurLevel * 0.5}px)` : 'none',
      opacity: blurLevel > 0 ? 0.55 : 0.92,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      ...style
    }}>
    {children}
  </motion.div>
);

const LandingPage = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === 'true';
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');

  const isNative = Capacitor.isNativePlatform();
  const [showMobileIntro, setShowMobileIntro] = useState(isNative && !localStorage.getItem('bridge_mobile_intro_shown'));

  const closeMobileIntro = () => {
    localStorage.setItem('bridge_mobile_intro_shown', 'true');
    setShowMobileIntro(false);
  };

  // Feedback states
  const [feedbackLiked, setFeedbackLiked] = useState(null); // true = Love it, false = Needs work
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const userStr = localStorage.getItem('bridge_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || '';

  const handleGeneralFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedbackLiked === null) {
      showToast('Please select if you like it or not!', 'warning');
      return;
    }
    const finalEmail = userEmail || feedbackEmail || 'guest';
    const type = 'feedback';
    const title = `General Feedback: ${feedbackLiked ? 'Love it' : 'Needs work'}`;
    const description = feedbackText;

    try {
      setSubmittingFeedback(true);
      const res = await apiFetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: finalEmail,
          type,
          title,
          description
        })
      });
      if (res.ok) {
        setSubmittedFeedback(true);
        setFeedbackText('');
        setFeedbackEmail('');
        setFeedbackLiked(null);
        setTimeout(() => setSubmittedFeedback(false), 5000);
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to submit feedback', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error submitting feedback', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  /* ── Page setup ── */
  useEffect(() => {
    document.title = 'Bridge AI — The Shared Knowledge Layer for Humans, AI, and Agents';
  }, []);

  /* ── active section on scroll ── */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.35 });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  /* ── smooth scroll ── */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const MARQUEE_ITEMS = [
    { label: 'New in v2.0', hi: true }, { label: 'Enterprise Edition' },
    { label: 'GPT-4 Support', hi: true }, { label: 'Claude 3.5' },
    { label: 'Gemini Ultra', hi: true }, { label: 'Zero Latency Transfer' },
    { label: 'Mistral Large', hi: true }, { label: 'Memory Sync' },
  ];
  const allItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  const allLogos = [...LOGOS, ...LOGOS];

  const glassCard = { background: 'rgba(13,13,13,0.72)', backdropFilter: 'blur(16px)', border: `1px solid rgba(255,107,44,0.15)` };

  return (
    <div className="lp-root" style={{ background: BG, minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>

      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes lpMarquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes ldBlink    { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes ldFloat    { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes ldPulse    {
          0%,100%{box-shadow:0 0 40px rgba(255,107,44,0.2),0 0 80px rgba(255,107,44,0.08)}
          50%    {box-shadow:0 0 80px rgba(255,107,44,0.45),0 0 140px rgba(124,58,237,0.15)}
        }
        @keyframes ldSpin     { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ldDash     { to{stroke-dashoffset:-20} }
        @keyframes ldGlowOrb  { 0%,100%{transform:scale(1);opacity:0.55} 50%{transform:scale(1.15);opacity:0.85} }
        @keyframes lpGridPulse{ 0%,100%{opacity:0.25} 50%{opacity:0.4} }
        @keyframes dockGlow   { 0%,100%{box-shadow:0 0 30px rgba(255,107,44,0.2),0 16px 40px rgba(0,0,0,0.6)} 50%{box-shadow:0 0 50px rgba(255,107,44,0.4),0 16px 40px rgba(0,0,0,0.75)} }
        @keyframes reviewScroll1 { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes reviewScroll2 { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        .lp-root input { cursor: text !important; }
        .lp-root button, .lp-root a { cursor: pointer !important; }
        @media (max-width: 1200px) {
          .desktop-only-floats {
            display: none !important;
          }
        }
      `}</style>

      {/* ── ADDITIONAL SUBTLE GRID ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, animation:'lpGridPulse 6s ease-in-out infinite', backgroundImage:`radial-gradient(rgba(255,107,44, 0.15) 1.5px, transparent 1.5px)`, backgroundSize:'40px 40px' }} />



      {/* ── ONBOARDING ── */}
      {isOnboarding && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ position:'fixed', inset:0, background:'rgba(5,5,5,0.96)', backdropFilter:'blur(16px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <motion.div initial={{ scale:0.9, y:40 }} animate={{ scale:1, y:0 }} style={{ maxWidth:520, width:'90%', ...glassCard, borderRadius:24, padding:40, textAlign:'center', boxShadow:'0 0 60px rgba(255,107,44,0.2)' }}>
            <div style={{ width:60, height:60, background:'rgba(255,107,44,0.15)', border:'1px solid rgba(255,107,44,0.4)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:26 }}>⧉</div>
            <h2 style={{ fontSize:'2rem', fontWeight:800, marginBottom:12, color:TEXT }}>Installation Complete! 🎉</h2>
            <p style={{ color:MUTED, marginBottom:28, lineHeight:1.75, fontWeight:500, opacity:0.85 }}>Pin BridgeAI to your browser toolbar for one-click access.</p>
            <Link to="/dashboard" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'14px 28px', background:`linear-gradient(135deg,${P},${SEC_P})`, color:'#050505', borderRadius:12, fontWeight:800, textDecoration:'none', boxShadow:`0 0 20px rgba(255,107,44,0.35)` }}>
              I've Pinned It — Take me to Dashboard <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* ── MOBILE INTRO ── */}
      {showMobileIntro && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ position:'fixed', inset:0, background:'rgba(5,5,5,0.96)', backdropFilter:'blur(16px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <motion.div initial={{ scale:0.9, y:40 }} animate={{ scale:1, y:0 }} style={{ maxWidth:520, width:'90%', ...glassCard, borderRadius:24, padding:40, textAlign:'center', boxShadow:'0 0 60px rgba(255,107,44,0.2)' }}>
            <div style={{ width:60, height:60, background:'rgba(255,107,44,0.15)', border:'1px solid rgba(255,107,44,0.4)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:26 }}>📱</div>
            <h2 style={{ fontSize:'2.2rem', fontWeight:900, marginBottom:12, color:TEXT, lineHeight:1.25 }}>Welcome to BridgeAI Mobile! 🚀</h2>
            <p style={{ color:MUTED, marginBottom:28, lineHeight:1.75, fontWeight:500, opacity:0.85 }}>Your project memory, chats, and decision log are now synced and accessible on the go.</p>
            <button onClick={closeMobileIntro} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'14px 28px', background:`linear-gradient(135deg,${P},${SEC_P})`, color:'#050505', border:'none', borderRadius:12, fontWeight:800, cursor:'pointer', boxShadow:`0 0 20px rgba(255,107,44,0.35)`, fontSize:'0.95rem' }}>
              Let's Go to Dashboard <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 1: HERO
      ══════════════════════════════════════════════ */}
      <section id="hero" className="grid-responsive-2" style={{ position:'relative', zIndex:2, alignItems:'center', gap:'clamp(2rem, 5vw, 4rem)', padding:'20px clamp(1rem, 5vw, 3rem) 80px', minHeight:'calc(100vh - 72px)', marginTop:72, overflowX:'hidden', width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>
        {/* Local Ambient Glow for Hero */}
        <div style={{ position:'absolute', top:'10%', left:'30%', width:450, height:450, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,0.1) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents:'none', zIndex: 0 }} />

        {/* LEFT */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }} style={{ padding:'2.5rem 0 1.5rem', position:'relative', zIndex:1 }}>
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:99, border:`1px solid rgba(255,107,44,0.35)`, background:'rgba(255,107,44,0.08)', fontSize:12, fontWeight:600, color:P, letterSpacing:'0.05em', marginBottom:'1rem', boxShadow:'0 0 20px rgba(255,107,44,0.15)' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:ACC_RED, animation:'ldBlink 1.5s infinite', boxShadow:`0 0 6px ${ACC_RED}` }} />
            Now in v2.0 · Enterprise Edition
          </motion.div>

          <h1 style={{ fontSize:'clamp(32px,5vw,64px)', fontWeight:800, lineHeight:1.2, letterSpacing:'-0.03em', marginBottom:'1rem', color:TEXT }}>
            Stop Scattering<br />
            <span style={{ 
              background:`linear-gradient(135deg,#FF6B2C 0%,#FF5C5C 50%,#7C3AED 100%)`, 
              WebkitBackgroundClip:'text', 
              WebkitTextFillColor:'transparent', 
              backgroundClip:'text',
              WebkitBoxDecorationBreak: 'clone',
              boxDecorationBreak: 'clone'
            }}>Your Project Data</span>
          </h1>

          <p style={{ fontSize:16, color:MUTED, lineHeight:1.6, fontWeight:500, opacity:0.9, maxWidth:450, marginBottom:'1.5rem' }}>
            BridgeAI saves your project details and chats in one shared space, so you never lose context when switching between AI models.
          </p>

          <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:'1.5rem' }}>
            <Link to="/dashboard"
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:10, background:'rgba(255,107,44,0.08)', color:P, border:'1px solid rgba(255,107,44,0.3)', fontWeight:700, textDecoration:'none', fontSize:14, boxShadow:`0 0 20px rgba(255,107,44,0.2)`, transition:'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background=P; e.currentTarget.style.color='#050505'; e.currentTarget.style.boxShadow='0 0 35px rgba(255,107,44,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.background='rgba(255,107,44,0.08)'; e.currentTarget.style.color=P; e.currentTarget.style.boxShadow='0 0 20px rgba(255,107,44,0.2)'; }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/docs"
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:10, background:'rgba(255,255,255,0.03)', color:TEXT, border:`1px solid rgba(255,107,44,0.15)`, fontWeight:600, textDecoration:'none', fontSize:14, transition:'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor=`rgba(255,107,44,0.45)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,107,44,0.15)'; }}>
              View Documentation
            </Link>
          </div>

          <div style={{ padding: '12px 20px', background: 'rgba(255,107,44,0.08)', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,107,44,0.2)', maxWidth: '450px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px' }}>📱</span>
              <strong style={{ color: '#FF6B2C', fontSize: '14px' }}>New: APK Update v2.0 Available</strong>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Take your project memory on the go. The new Android APK brings zero-latency sync and offline access to all your AI decision logs.
            </p>
          </div>


          <div>
            <div style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:MUTED, fontWeight:600, marginBottom:'0.75rem', fontFamily:"'Space Mono',monospace" }}>Works with</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              {[{ label:'GPT-4', color:'#34d399' },{ label:'Claude', color:'#E57373' },{ label:'Gemini', color:'#64a0ff' },{ label:'Mistral', color:'#ffbe32' },{ label:'Llama 3', color:'#c084fc' }].map(m => (
                <span key={m.label} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:99, border:`1px solid rgba(255,107,44,0.15)`, background:'rgba(255,107,44,0.04)', fontSize:11.5, fontWeight:600, color:MUTED, transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=`rgba(255,107,44,0.35)`; e.currentTarget.style.color=P; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,107,44,0.15)'; e.currentTarget.style.color=MUTED; }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:m.color, boxShadow:`0 0 6px ${m.color}80` }} />
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: NETWORK VIZ */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4, duration:1 }} style={{ display:'flex', alignItems:'center', justifyContent: 'center', padding:'2.5rem 0 1.5rem', position:'relative', zIndex:1, width:'100%' }}>
          <div className="hero-viz-wrapper">
            <div className="hero-viz-scaler">
              <div className="hero-viz-container">
                {[{ s:300, d:30, c:'rgba(255,107,44,0.2)' },{ s:400, d:45, c:'rgba(124,58,237,0.12)', rev:true }].map((r,i) => (
                  <div key={i} style={{ position:'absolute', borderRadius:'50%', border:`1px dashed ${r.c}`, width:r.s, height:r.s, top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:`ldSpin ${r.d}s linear infinite ${r.rev?'reverse':''}` }} />
                ))}
                <svg viewBox="0 0 460 460" style={{ position:'absolute', inset:0, pointerEvents:'none', width:'100%', height:'100%' }}>
                  {[[230,230,90,90],[230,230,370,90],[230,230,90,370],[230,230,370,370]].map(([x1,y1,x2,y2],i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(222,106,57,0.15)" strokeWidth={1.5} strokeDasharray="6 4" fill="none" style={{ animation:`ldDash 2s linear infinite`, animationDelay:`${i*0.4}s` }} />
                  ))}
                </svg>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:90, height:90, background:`radial-gradient(circle at 40% 40%,rgba(222,106,57,0.15),rgba(5,5,5,0.9))`, border:`2px solid rgba(222,106,57,0.25)`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, animation:'ldPulse 3s ease-in-out infinite' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DE6A39" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(222,106,57,0.15))' }}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </div>
                {[
                  { label:'GPT-4',  pos:{ top:55,   left:55 }, color:'#34d399', bg:'radial-gradient(#0d2018,#051210)', bd:'rgba(52,211,153,0.3)' },
                  { label:'Claude', pos:{ top:55,   right:55  }, color:'#E57373', bg:'radial-gradient(#1a0e0c,#100503)', bd:'rgba(229,115,115,0.3)' },
                  { label:'Gemini', pos:{ top:335,  left:55   }, color:'#64a0ff', bg:'radial-gradient(#0d1220,#080b18)', bd:'rgba(100,160,255,0.3)' },
                  { label:'Mistral',pos:{ top:335,  right:55  }, color:'#ffbe32', bg:'radial-gradient(#1a1005,#0d0803)', bd:'rgba(255,190,50,0.3)' },
                ].map(n => (
                  <div key={n.label} style={{ position:'absolute', ...n.pos, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                    <div style={{ width:70, height:70, borderRadius:'50%', background:n.bg, border:`2px solid ${n.bd}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s', boxShadow:`0 0 20px ${n.bd}` }}
                      onMouseEnter={e => { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.boxShadow=`0 0 30px ${n.color}60`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 0 20px ${n.bd}`; }}>
                      <div style={{ width:38, height:38, borderRadius:'50%', background:n.color, boxShadow:`0 0 12px ${n.color}80` }} />
                    </div>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, fontWeight:700, color:TEXT, letterSpacing:'0.05em' }}>{n.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2: TRUSTED BY (blurred logos strip)
      ══════════════════════════════════════════════ */}
      <section id="trusted" style={{ position:'relative', zIndex:2, padding:'5rem 0', borderTop:'1px solid rgba(255,107,44,0.1)', background:'rgba(13,13,13,0.4)', backdropFilter:'blur(8px)', overflow:'hidden' }}>
        {/* Edge blur masks */}
        <div style={{ position:'absolute', top:0, left:0, bottom:0, width:200, background:'linear-gradient(90deg, rgba(5,5,5,1) 0%, transparent 100%)', zIndex:3, pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:200, background:'linear-gradient(270deg, rgba(5,5,5,1) 0%, transparent 100%)', zIndex:3, pointerEvents:'none' }} />

        <div style={{ textAlign:'center', marginBottom:'3rem', position:'relative', zIndex:2 }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:MUTED, fontWeight:600, marginBottom:12 }}>Used By People Who Work With AI Every Day</div>
        </div>

        <div style={{ overflow:'hidden', position:'relative' }}>
          <div style={{ display:'flex', gap:'5rem', width:'max-content', animation:'lpMarquee 30s linear infinite', alignItems:'center' }}>
            {allLogos.map((logo, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 24px', borderRadius:10, border:'1px solid rgba(255,107,44,0.06)', background:'rgba(255,107,44,0.02)', whiteSpace:'nowrap', transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,107,44,0.25)'; e.currentTarget.style.background='rgba(255,107,44,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,107,44,0.06)'; e.currentTarget.style.background='rgba(255,107,44,0.02)'; }}>
                <span style={{ fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.7)', letterSpacing:'-0.01em', textTransform:'capitalize' }}>{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <motion.div className="grid-responsive-4" initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        style={{ position:'relative', zIndex:2, borderTop:`1px solid rgba(255,107,44,0.15)`, borderBottom:`1px solid rgba(255,107,44,0.15)`, background:'rgba(13,13,13,0.6)', backdropFilter:'blur(12px)' }}>
        {[{ num:'50', unit:'K+', label:'Active Users' },{ num:'12', unit:'+', label:'LLMs Supported' },{ num:'0.3', unit:'s', label:'Avg Transfer Time' },{ num:'99.9', unit:'%', label:'Uptime SLA' }].map((s,i) => (
          <div key={i} style={{ padding:'2rem 2.5rem', borderRight:i<3?`1px solid rgba(255,107,44,0.1)`:'none', position:'relative', overflow:'hidden', transition:'background 0.3s', cursor:'default' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,107,44,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${P},${PURP})`, transform:'scaleX(0)', transformOrigin:'left', transition:'transform 0.4s' }}
              ref={el => { if(el){ const p=el.parentElement; p.addEventListener('mouseenter',()=>el.style.transform='scaleX(1)'); p.addEventListener('mouseleave',()=>el.style.transform='scaleX(0)'); } }} />
            <div style={{ fontSize:36, fontWeight:800, letterSpacing:'-0.04em', color:TEXT, marginBottom:4 }}>
              <span style={{ background:`linear-gradient(135deg,${P},${PURP})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{s.num}</span>{s.unit}
            </div>
            <div style={{ fontSize:12, color:MUTED, fontWeight:500, letterSpacing:'0.02em', fontFamily:"'Space Mono',monospace" }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════
          SECTION 3: FEATURES
      ══════════════════════════════════════════════ */}
      <motion.section id="features" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
        style={{ position:'relative', zIndex:2, padding:'6rem 3rem' }}>
        <div style={{ position:'absolute', bottom:'5%', right:'10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,0.08) 0%, transparent 70%)', filter:'blur(110px)', pointerEvents:'none', zIndex:-1 }} />
        
        <div style={{ maxWidth: 1100, margin: '0 auto 6rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:ACC_RED, fontWeight:700, marginBottom:'0.75rem' }}>The Challenge</div>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,48px)', fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.25, color:TEXT }}>Scattered Info is the Real Enemy.<br />Switching AI Tools Just Makes it Worse.</h2>
          </div>

          {/* Animated Browser Mockup */}
          <div style={{ background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(239, 68, 68, 0.05)', maxWidth: 800, margin: '0 auto', position: 'relative' }} className="browser-mockup">
            
            {/* Browser Header with Tabs */}
            <div style={{ background: '#18181b', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#EF4444' }} />
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#F59E0B' }} />
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#10B981' }} />
              </div>
              
              <div style={{ display: 'flex', gap: 8, flex: 1, overflowX: 'auto' }}>
                <motion.div animate={{ background: ['#27272a', '#27272a', 'transparent', 'transparent', '#27272a'], color: ['#fff', '#fff', '#A1A1AA', '#A1A1AA', '#fff'] }} transition={{ duration: 10, repeat: Infinity }} style={{ padding: '6px 16px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                  <div style={{ width:12, height:12, borderRadius:'50%', background:'#10A37F' }} /> ChatGPT
                </motion.div>
                <motion.div animate={{ background: ['transparent', 'transparent', '#27272a', '#27272a', 'transparent'], color: ['#A1A1AA', '#A1A1AA', '#fff', '#fff', '#A1A1AA'] }} transition={{ duration: 10, repeat: Infinity }} style={{ padding: '6px 16px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                  <div style={{ width:12, height:12, borderRadius:'50%', background:'#D97757' }} /> Claude
                </motion.div>
              </div>
            </div>

            {/* Chat Content */}
            <div style={{ padding: '30px 40px', position: 'relative', height: 320 }} className="browser-chat-area">
              
              {/* ChatGPT View */}
              <motion.div animate={{ opacity: [1, 1, 0, 0, 1] }} transition={{ duration: 10, repeat: Infinity }} style={{ position: 'absolute', inset: '30px 40px' }} className="browser-chat-inset">
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                   {/* User message */}
                   <div style={{ alignSelf: 'flex-end', background: '#27272a', padding: '16px 20px', borderRadius: 12, color: '#e4e4e7', fontSize: 14, maxWidth: '80%', border: '1px solid rgba(255,255,255,0.05)' }} className="browser-chat-msg">
                      "Here is the 10-page architecture document. Remember all these rules."
                   </div>
                   {/* AI message */}
                   <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:'#10A37F', flexShrink:0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✨</div>
                      <div style={{ color: '#d4d4d8', fontSize: 14, lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.02)' }} className="browser-chat-msg">
                        "Understood! I have memorized the architecture document and all rules. How can I help you?"
                      </div>
                   </div>
                 </div>
              </motion.div>

              {/* Claude View */}
              <motion.div animate={{ opacity: [0, 0, 1, 1, 0] }} transition={{ duration: 10, repeat: Infinity }} style={{ position: 'absolute', inset: '30px 40px' }} className="browser-chat-inset">
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                   {/* User message */}
                   <div style={{ alignSelf: 'flex-end', background: '#27272a', padding: '16px 20px', borderRadius: 12, color: '#e4e4e7', fontSize: 14, maxWidth: '80%', border: '1px solid rgba(255,255,255,0.05)' }} className="browser-chat-msg">
                      "Okay, write the backend code based on the architecture rules."
                   </div>
                   {/* AI message */}
                   <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:'#D97757', flexShrink:0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✨</div>
                      <div style={{ color: '#d4d4d8', fontSize: 14, lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.02)' }} className="browser-chat-msg">
                        "I apologize, but I don't have access to any architecture rules. Could you please provide the document?"
                      </div>
                   </div>
                 </div>
                 
                 <motion.div animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1, 1] }} transition={{ duration: 10, repeat: Infinity, times: [0, 0.45, 0.5] }} 
                    style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', padding: '12px 24px', borderRadius: 8, color: '#FCA5A5', fontWeight: 700, fontSize: 13, boxShadow: '0 10px 30px rgba(239,68,68,0.2)', backdropFilter: 'blur(8px)' }} className="context-lost-alert">
                    ⚠️ CONTEXT LOST
                 </motion.div>
              </motion.div>

            </div>
          </div>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.5 }}
            style={{ marginTop: '5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', position: 'relative' }} className="problem-cta-wrapper">
            
            <Link to="/dashboard" style={{ textDecoration: 'none', zIndex: 1 }}>
              <motion.div 
                whileHover="hover"
                style={{ 
                  position: 'relative', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255,255,255,0.15)', 
                  borderRadius: '12px', 
                  padding: '8px 8px 8px 24px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(20px)',
                  gap: '24px',
                  overflow: 'hidden'
                }} 
                className="problem-cta"
              >
                
                {/* Shimmer overlay */}
                <motion.div
                  variants={{
                    hover: { x: ['-100%', '200%'], transition: { duration: 1.5, ease: 'linear', repeat: Infinity, repeatDelay: 1 } }
                  }}
                  style={{
                    position: 'absolute', inset: 0, 
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    transform: 'skewX(-20deg)', pointerEvents: 'none', left: '-100%'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }} className="problem-cta-text">
                  <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e4e4e7', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>Stop losing context.</span>
                </div>
                
                <motion.div 
                  variants={{ hover: { scale: 1.02, background: 'rgba(255, 107, 44, 0.15)' } }}
                  style={{ 
                    position: 'relative', overflow: 'hidden',
                    background: 'rgba(255, 107, 44, 0.08)', 
                    border: '1px solid rgba(255, 107, 44, 0.3)',
                    padding: '13px 31px', borderRadius: '8px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                    boxShadow: 'none',
                    zIndex: 2,
                    transition: 'all 0.3s'
                  }}>
                  <span style={{ color: '#FF6B2C', fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap' }}>Start Bridging</span>
                  <motion.div variants={{ hover: { x: [0, 5, 0], transition: { duration: 1, repeat: Infinity } } }}>
                    <ArrowRight size={18} color="#FF6B2C" style={{ flexShrink: 0 }} />
                  </motion.div>
                </motion.div>

              </motion.div>
            </Link>
          </motion.div>
        </div>

        <div style={{ marginBottom:'3rem' }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:P, fontWeight:700, marginBottom:'0.75rem' }}>The Shared Project Space</div>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,48px)', fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.25, color:TEXT }}>Bring Chats, Decisions,<br />and Code Together Instantly.</h2>
        </div>
        <div className="grid-responsive-3" style={{ gap:'24px' }}>
          {FEATURES.map((f,i) => (
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07, type: 'spring', bounce: 0.4 }}
              style={{
                background: 'linear-gradient(180deg, rgba(24,24,27,0.8) 0%, rgba(9,9,11,0.8) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 24,
                padding: '36px 32px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(20px)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(255,107,44,0.3)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255, 107, 44, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
              }}>
              
              {/* Massive animated background glow */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                  x: [0, -30, 0],
                  y: [0, 30, 0]
                }} 
                transition={{ duration: 8 + (i % 3) * 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ position:'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,107,44,0.15) 0%, transparent 70%)`, pointerEvents: 'none' }} 
              />
              
              <div style={{ position: 'relative', zIndex: 1, width: 56, height: 56, borderRadius: 16, border: `1px solid ${f.color}40`, background: `linear-gradient(135deg, ${f.color}20, ${f.color}05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: '2rem', boxShadow: `inset 0 0 20px ${f.color}20` }}>
                <motion.div 
                   animate={{ rotate: [0, 5, -5, 0] }} 
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i }}
                   style={{ filter: `drop-shadow(0 0 10px ${f.color}80)`, display: 'inline-block' }}>
                   {f.icon}
                </motion.div>
              </div>
              
              <div style={{ position: 'relative', zIndex: 1, fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: TEXT, letterSpacing: '-0.01em' }}>{f.title}</div>
              <p style={{ position: 'relative', zIndex: 1, fontSize: '0.95rem', color: MUTED, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SECTION 4: REVIEWS
      ══════════════════════════════════════════════ */}
      <section id="reviews" style={{ position:'relative', zIndex:2, padding:'6rem 0', borderTop:`1px solid rgba(255,107,44,0.12)`, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'20%', left:'5%', width:450, height:450, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', filter:'blur(100px)', pointerEvents:'none', zIndex:-1 }} />

        {/* Edge blur masks */}
        <div style={{ position:'absolute', top:0, left:0, bottom:0, width:160, background:'linear-gradient(90deg,rgba(5,5,5,1) 0%,transparent 100%)', zIndex:3, pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:160, background:'linear-gradient(270deg,rgba(5,5,5,1) 0%,transparent 100%)', zIndex:3, pointerEvents:'none' }} />

        <div style={{ textAlign:'center', marginBottom:'3.5rem', position:'relative', zIndex:4, padding:'0 3rem' }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:P, fontWeight:700, marginBottom:12 }}>Social Proof</div>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,48px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:1.05, color:TEXT, marginBottom:12 }}>
            Loved by <span style={{ background:`linear-gradient(135deg,${P},${PURP})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>10,000+ engineers</span>
          </h2>
          <p style={{ color:MUTED, fontSize:15, fontWeight:500, opacity:0.8 }}>Real feedback from developers shipping real products.</p>
        </div>

        {/* Row 1 — scroll right */}
        <div style={{ overflow:'hidden', marginBottom:16, position:'relative' }}>
          <div style={{ display:'flex', gap:16, width:'max-content', animation:'reviewScroll1 35s linear infinite' }}>
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div key={i} style={{ width:320, flexShrink:0, ...glassCard, borderRadius:16, padding:'24px', transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,107,44,0.06)'; e.currentTarget.style.borderColor='rgba(255,107,44,0.3)'; e.currentTarget.style.boxShadow='0 0 30px rgba(255,107,44,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(13,13,13,0.72)'; e.currentTarget.style.borderColor='rgba(255,107,44,0.15)'; e.currentTarget.style.boxShadow=''; }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${r.color}40,${r.color}20)`, border:`1px solid ${r.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:r.color, flexShrink:0 }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:TEXT }}>{r.name}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{r.role}</div>
                  </div>
                </div>
                <StarRating rating={r.rating} />
                <p style={{ fontSize:13, color:MUTED, lineHeight:1.8, fontWeight:500, opacity:0.8, marginTop:12, margin:'12px 0 0' }}>"{r.review}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scroll left (reverse) */}
        <div style={{ overflow:'hidden', position:'relative' }}>
          <div style={{ display:'flex', gap:16, width:'max-content', animation:'reviewScroll2 40s linear infinite' }}>
            {[...REVIEWS.slice().reverse(), ...REVIEWS.slice().reverse()].map((r, i) => (
              <div key={i} style={{ width:320, flexShrink:0, ...glassCard, borderRadius:16, padding:'24px', transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,107,44,0.06)'; e.currentTarget.style.borderColor='rgba(255,107,44,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(13,13,13,0.72)'; e.currentTarget.style.borderColor='rgba(255,107,44,0.15)'; }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${r.color}40,${r.color}20)`, border:`1px solid ${r.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:r.color, flexShrink:0 }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:TEXT }}>{r.name}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{r.role}</div>
                  </div>
                </div>
                <StarRating rating={r.rating} />
                <p style={{ fontSize:13, color:MUTED, lineHeight:1.8, fontWeight:500, opacity:0.8, marginTop:12, margin:'12px 0 0' }}>"{r.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5: COMPARISON
      ══════════════════════════════════════════════ */}
      <motion.section id="comparison" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
        style={{ position:'relative', zIndex:2, padding:'6rem 3rem', borderTop:`1px solid rgba(255,107,44,0.12)` }}>
        <div style={{ position:'absolute', top:'30%', right:'5%', width:550, height:550, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,0.07) 0%, transparent 70%)', filter:'blur(120px)', pointerEvents:'none', zIndex:-1 }} />

        <div style={{ textAlign:'center', marginBottom:'4rem' }}>
          <div style={{ display:'inline-block', padding:'6px 20px', borderRadius:99, border:'1px solid rgba(255,107,44,0.25)', background:'rgba(255,107,44,0.06)', fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:P, marginBottom:20 }}>COMPARISON</div>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,52px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:1.1, color:TEXT, marginBottom:12 }}>
            What Sets BridgeAI Apart<br />From{' '}
            <span style={{ background:`linear-gradient(135deg,${P},${PURP})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>the Competition</span>
          </h2>
        </div>

        <div className="grid-responsive-2" style={{ maxWidth:900, margin:'0 auto', gap:0, borderRadius:20, overflow:'hidden', border:`1px solid rgba(255,107,44,0.18)`, boxShadow:`0 0 60px rgba(255,107,44,0.08)` }}>
          {/* BridgeAI Column */}
          <div style={{ background:'rgba(255,107,44,0.04)', borderRight:`1px solid rgba(255,107,44,0.15)` }}>
            <div style={{ padding:'28px 32px', borderBottom:`1px solid rgba(255,107,44,0.15)`, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${P},${SEC_P})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, boxShadow:`0 0 16px rgba(255,107,44,0.4)` }}>⧉</div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:TEXT }}>With BridgeAI</div>
                <div style={{ fontSize:11, color:P, fontWeight:600 }}>The Smart Choice</div>
              </div>
            </div>
            {COMPARISON.map((row, i) => (
              <motion.div key={i} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'20px 32px', borderBottom:i<COMPARISON.length-1?`1px solid rgba(255,107,44,0.08)`:'none', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,107,44,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(0,193,118,0.15)', border:'1px solid rgba(0,193,118,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Check size={12} color="#00C176" />
                </div>
                <span style={{ fontSize:14, color:TEXT, fontWeight:500 }}>{row.us}</span>
              </motion.div>
            ))}
          </div>

          {/* Others Column */}
          <div style={{ background:'rgba(255,255,255,0.015)' }}>
            <div style={{ padding:'28px 32px', borderBottom:`1px solid rgba(255,255,255,0.06)`, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Layers size={18} color={MUTED} />
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:MUTED }}>Without BridgeAI</div>
                <div style={{ fontSize:11, color:MUTED, fontWeight:600 }}>The Old Way</div>
              </div>
            </div>
            {COMPARISON.map((row, i) => (
              <motion.div key={i} initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'20px 32px', borderBottom:i<COMPARISON.length-1?`1px solid rgba(255,255,255,0.04)`:'none', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <X size={12} color="#EF4444" />
                </div>
                <span style={{ fontSize:14, color:MUTED, fontWeight:500 }}>{row.them}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SECTION 6: FLOATING BLURRED CARDS CTA
      ══════════════════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:2, minHeight:'80vh', padding:'120px 20px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'visible', borderTop:`1px solid rgba(255,107,44,0.12)`, background:`radial-gradient(ellipse at 50% 50%, rgba(255,107,44,0.06) 0%, rgba(5,5,5,0) 65%)` }}>

        {/* Deep radial glow */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,107,44,0.08) 0%, rgba(124,58,237,0.03) 40%, transparent 70%)`, filter:'blur(30px)', pointerEvents:'none' }} />

        {/* Floating UI cards */}
        <div className="desktop-only-floats">
          <FloatCard style={{ width:160, height:100, top:'8%', left:'12%' }} blurLevel={3} delay={0}>
            <div style={{ padding:14 }}>
              <div style={{ width:'60%', height:8, background:`linear-gradient(90deg,${P}40,transparent)`, borderRadius:4, marginBottom:8 }} />
              <div style={{ width:'80%', height:6, background:'rgba(255,255,255,0.06)', borderRadius:4, marginBottom:6 }} />
              <div style={{ width:'50%', height:6, background:'rgba(255,255,255,0.04)', borderRadius:4 }} />
              <div style={{ marginTop:12, width:60, height:20, borderRadius:6, background:`rgba(255,107,44,0.15)`, border:`1px solid rgba(255,107,44,0.25)` }} />
            </div>
          </FloatCard>

          <FloatCard style={{ width:180, height:120, top:'5%', right:'18%' }} blurLevel={4} delay={1}>
            <div style={{ padding:14 }}>
              <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                {['#FF6B2C','#7C3AED','#FF5C5C'].map(c=><div key={c} style={{ width:16, height:16, borderRadius:'50%', background:c, boxShadow:`0 0 8px ${c}80` }}/>)}
              </div>
              <div style={{ width:'90%', height:6, background:'rgba(255,255,255,0.05)', borderRadius:4, marginBottom:6 }} />
              <div style={{ width:'70%', height:6, background:'rgba(255,255,255,0.04)', borderRadius:4, marginBottom:6 }} />
              <div style={{ width:'50%', height:20, borderRadius:6, background:`rgba(255,107,44,0.12)`, border:`1px solid rgba(255,107,44,0.25)`, marginTop:8 }} />
            </div>
          </FloatCard>

          <FloatCard style={{ width:140, height:90, top:'55%', left:'8%' }} blurLevel={5} delay={2}>
            <div style={{ padding:12 }}>
              <div style={{ fontSize:10, color:P, fontFamily:"'Space Mono',monospace", marginBottom:8, letterSpacing:'0.08em' }}>CONTEXT SYNC</div>
              <div style={{ display:'flex', gap:4 }}>
                {[1,2,3].map(i=><div key={i} style={{ flex:1, height:30, borderRadius:6, background:`rgba(255,107,44,${0.1+i*0.08})` }}/>)}
              </div>
            </div>
          </FloatCard>

          <FloatCard style={{ width:170, height:110, bottom:'15%', right:'12%' }} blurLevel={4} delay={1.5}>
            <div style={{ padding:14 }}>
              <div style={{ display:'flex', justifyContent: 'space-between', marginBottom:10 }}>
                <div style={{ fontSize:11, color:MUTED, fontFamily:"'Space Mono',monospace" }}>VAULT</div>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#00C176', boxShadow:'0 0 6px #00C17660' }} />
              </div>
              <div style={{ width:'100%', height:6, background:`rgba(255,107,44,0.15)`, borderRadius:4, marginBottom:8, overflow:'hidden' }}>
                <div style={{ width:'72%', height:'100%', background:`linear-gradient(90deg,${P},${PURP})`, borderRadius:4 }} />
              </div>
              <div style={{ fontSize:10, color:DIM }}>72% context preserved</div>
            </div>
          </FloatCard>

          <FloatCard style={{ width:130, height:80, bottom:'20%', left:'20%' }} blurLevel={6} delay={0.5}>
            <div style={{ padding:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:P }} />
                <div style={{ fontSize:10, color:P, fontFamily:"'Space Mono',monospace" }}>LIVE</div>
              </div>
              <div style={{ width:'80%', height:5, background:'rgba(255,107,44,0.15)', borderRadius:3, marginBottom:5 }} />
              <div style={{ width:'60%', height:5, background:'rgba(255,255,255,0.05)', borderRadius:3 }} />
            </div>
          </FloatCard>

          <FloatCard style={{ width:150, height:95, top:'30%', right:'6%' }} blurLevel={7} delay={3}>
            <div style={{ padding:14 }}>
              <div style={{ fontSize:22, marginBottom:8 }}>🔀</div>
              <div style={{ fontSize:11, color:TEXT, fontWeight:700, marginBottom:4 }}>Transfer Active</div>
              <div style={{ fontSize:10, color:MUTED }}>GPT-4 → Claude 3.5</div>
            </div>
          </FloatCard>
        </div>

        {/* Center CTA */}
        <div style={{ position:'relative', zIndex:5, textAlign:'center', maxWidth:560, padding:'0 2rem' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 style={{ fontSize:'clamp(24px,5vw,58px)', fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.25, color:TEXT, marginBottom:'1.25rem' }}>
              The Future of Building Software Isn't Writing Docs Later.<br />
              <span style={{ background:`linear-gradient(135deg,${P},${PURP})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>It's Saving Your Decisions Now.</span>
            </h2>
            <p style={{ color:MUTED, fontSize:15, lineHeight:1.85, fontWeight:500, opacity:0.8, marginBottom:'2rem' }}>
              Keep developers and AI tools synced with a single, shared project history.
            </p>
            <div style={{ display:'flex', gap:12, justifyContent: 'center', flexWrap:'wrap' }}>
              <Link to="/dashboard"
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', borderRadius:12, background:`linear-gradient(135deg,${P},${SEC_P})`, color:'#050505', fontWeight:700, textDecoration:'none', fontSize:15, boxShadow:`0 0 30px rgba(255,107,44,0.3)`, transition:'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow='0 0 50px rgba(255,107,44,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 0 30px rgba(255,107,44,0.3)'; }}>
                Start Free <ArrowRight size={16} />
              </Link>
              <Link to="/services"
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:12, background:'rgba(255,255,255,0.03)', color:TEXT, border:`1px solid rgba(255,107,44,0.25)`, fontWeight:600, textDecoration:'none', fontSize:15, transition:'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`rgba(255,107,44,0.5)`; e.currentTarget.style.color=P; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,107,44,0.25)'; e.currentTarget.style.color=TEXT; }}>
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 7: FAQ
      ══════════════════════════════════════════════ */}
      <motion.section id="faq" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
        style={{ position:'relative', zIndex:2, padding:'6rem 3rem', borderTop:`1px solid rgba(255,107,44,0.12)`, background:'rgba(13,13,13,0.4)', backdropFilter:'blur(8px)' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:P, fontWeight:700, marginBottom:16 }}>Common Questions</div>
            <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:800, color:TEXT, letterSpacing:'-0.03em', marginBottom:16, lineHeight:1.2 }}>
              Things people{' '}
              <span style={{ background:`linear-gradient(135deg,${P},${PURP})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>actually ask us</span>
            </h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {FAQS.map((faq,idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} style={{ ...glassCard, borderRadius:14, border:`1px solid ${isOpen?'rgba(255,107,44,0.35)':'rgba(255,107,44,0.12)'}`, overflow:'hidden', transition:'all 0.25s', boxShadow:isOpen?'0 0 20px rgba(255,107,44,0.1)':'none' }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{ width:'100%', padding:'22px 28px', display:'flex', justifyContent: 'space-between', alignItems:'center', background:'none', border:'none', cursor:'pointer', textAlign:'left', outline:'none', fontFamily:'inherit' }}>
                    <span style={{ fontSize:'1.02rem', fontWeight:700, color:TEXT, paddingRight:20 }}>{faq.q}</span>
                    <ChevronDown size={18} style={{ color:isOpen?P:DIM, transform:isOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.25s,color 0.25s', flexShrink:0 }} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }}>
                        <div style={{ padding:'0 28px 22px', color:MUTED, fontSize:'0.95rem', lineHeight:1.75, borderTop:`1px solid rgba(255,107,44,0.12)` }}>{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SECTION 8: GENERAL FEEDBACK
      ══════════════════════════════════════════════ */}
      <motion.section id="general-feedback" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
        style={{ position:'relative', zIndex:2, padding:'6rem 3rem', borderTop:`1px solid rgba(255,107,44,0.12)`, background:'rgba(5,5,5,0.2)' }}>
        <div style={{ position:'absolute', bottom:'10%', left:'10%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(222,106,57,0.05) 0%, transparent 70%)', filter:'blur(100px)', pointerEvents:'none', zIndex:-1 }} />

        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:P, fontWeight:700, marginBottom:16 }}>Your Voice</div>
          <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:800, color:TEXT, letterSpacing:'-0.03em', marginBottom:12 }}>
            Do you like <span style={{ background:`linear-gradient(135deg,${P},${PURP})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>BridgeAI</span>?
          </h2>
          <p style={{ color:MUTED, fontSize:15, fontWeight:500, opacity:0.8, marginBottom:40 }}>
            Tell us if we are on the right track or how we can improve. Your input shapes our roadmap.
          </p>

          <div style={{ ...glassCard, borderRadius: 20, padding: 32, textAlign: 'left', border: '1px solid rgba(255, 107, 44, 0.15)', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
            {submittedFeedback ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(222,106,57,0.15)', border: '1px solid rgba(222,106,57,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: P, marginBottom: 20 }}>
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: TEXT, marginBottom: 8 }}>Thank you! 🧡</h3>
                <p style={{ color: MUTED, fontSize: '0.95rem' }}>Your feedback has been submitted directly to the dev team.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleGeneralFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Like / Dislike Toggle */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: MUTED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    How is your experience?
                  </label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button
                      type="button"
                      onClick={() => setFeedbackLiked(true)}
                      style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: 12,
                        background: feedbackLiked === true ? 'rgba(222, 106, 57, 0.15)' : 'rgba(255,255,255,0.02)',
                        border: feedbackLiked === true ? '1px solid rgba(222, 106, 57, 0.5)' : '1px solid rgba(255,255,255,0.05)',
                        color: feedbackLiked === true ? 'white' : MUTED,
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>😍</span> I love it!
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackLiked(false)}
                      style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: 12,
                        background: feedbackLiked === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: feedbackLiked === false ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                        color: feedbackLiked === false ? 'white' : MUTED,
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>🛠️</span> It needs work
                    </button>
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <label htmlFor="feedback-text-area" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: MUTED, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    What did you like or dislike? <span style={{ fontWeight: 400, opacity: 0.6 }}>(Optional)</span>
                  </label>
                  <textarea
                    id="feedback-text-area"
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you think. Your direct experience helps us build a better platform..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: TEXT,
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: '1.5',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Email Input (if guest) */}
                {!userEmail && (
                  <div>
                    <label htmlFor="feedback-email-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: MUTED, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Your Email (Optional)
                    </label>
                    <input
                      id="feedback-email-input"
                      type="email"
                      value={feedbackEmail}
                      onChange={e => setFeedbackEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: TEXT,
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--primary) 0%, #ff8038 100%)',
                    border: 'none',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 20px rgba(222, 106, 57, 0.25)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default LandingPage;
