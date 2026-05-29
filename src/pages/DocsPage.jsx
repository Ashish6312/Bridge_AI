import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Users, Layers, Heart, Shield, Target, 
  ArrowRight, CheckCircle, Search, FileText, Code2, Briefcase,
  GraduationCap, Terminal, LineChart, Rocket, PenTool, Microscope
} from 'lucide-react';
import SEOHelmet from '../components/SEOHelmet';

const SECTIONS = [
  { 
    group: 'INTRODUCTION', 
    items: [
      { id: 'intro',     icon: <BookOpen size={18} />,  label: 'What is BridgeAI?' },
      { id: 'audience',  icon: <Users size={18} />,     label: 'Who Is It For?' },
    ]
  },
  { 
    group: 'GETTING STARTED', 
    items: [
      { id: 'workflow',  icon: <Layers size={18} />,    label: 'How It Works' },
      { id: 'benefits',  icon: <Heart size={18} />,     label: 'Why People Love It' },
    ]
  },
  { 
    group: 'DEEP DIVE', 
    items: [
      { id: 'privacy',   icon: <Shield size={18} />,    label: 'Privacy First' },
      { id: 'usecases',  icon: <Target size={18} />,    label: 'Use Cases' },
    ]
  }
];

const DocsPage = () => {
  const [active, setActive] = useState('intro');
  const scrollLock = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (scrollLock.current) return;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0
    });

    SECTIONS.forEach(group => {
      group.items.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: 'var(--text-main)' }}>
      <SEOHelmet 
        title="Documentation - BridgeAI"
        description="BridgeAI — The easiest way to move your AI conversations anywhere."
        keywords={['documentation', 'how it works', 'guide', 'context bridge', 'ai workflow']}
      />

      <style>
        {`
          .docs-layout {
            display: flex;
            width: 100%;
            max-width: 1440px;
            margin: 0 auto;
            position: relative;
          }
          .docs-sidebar {
            width: 300px;
            padding: 40px 24px;
            border-right: 1px solid var(--border-subtle);
            background: var(--bg-secondary);
            position: sticky;
            top: 70px;
            height: calc(100vh - 70px);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            z-index: 10;
          }
          .docs-main {
            flex: 1;
            padding: 60px 80px 120px;
            max-width: 1000px;
          }
          .docs-section {
            margin-bottom: 80px;
            scroll-margin-top: 100px;
          }
          .docs-section h2 {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--text-main);
            margin-bottom: 24px;
            letter-spacing: -0.03em;
          }
          .docs-section h3 {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--text-main);
            margin: 40px 0 16px;
            letter-spacing: -0.02em;
          }
          .docs-section p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            line-height: 1.7;
            margin-bottom: 24px;
          }
          .docs-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-subtle);
            border-radius: 20px;
            padding: 32px;
            margin-top: 32px;
          }
          .docs-list li {
            font-size: 1.1rem;
            color: var(--text-secondary);
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }
          .grid-responsive-2 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
          }
          @media (max-width: 768px) {
            .docs-layout {
              flex-direction: column;
            }
            .docs-sidebar {
              width: 100%;
              height: auto;
              max-height: 280px;
              overflow-y: auto;
              position: relative;
              top: 0;
              border-right: none;
              border-bottom: 1px solid var(--border-subtle);
              padding: 24px 20px;
            }
            .docs-main {
              padding: 40px 20px 80px;
            }
            .docs-section {
              margin-bottom: 60px;
            }
          }
        `}
      </style>
      
      <div className="docs-layout">
        
        <aside className="docs-sidebar">
          <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Guide</h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700' }}>BridgeAI User Manual</span>
            </div>
          </div>

          <nav style={{ flex: 1 }}>
            {SECTIONS.map(group => (
              <div key={group.group} style={{ marginBottom: '32px' }}>
                <h5 style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', paddingLeft: '12px' }}>{group.group}</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {group.items.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        setActive(item.id);
                        scrollLock.current = true;
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setTimeout(() => { scrollLock.current = false; }, 800);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px',
                        border: 'none', background: active === item.id ? 'var(--bg-secondary)' : 'transparent',
                        color: active === item.id ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: '700', fontSize: '0.9rem',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                        border: active === item.id ? '1px solid var(--border-subtle)' : '1px solid transparent',
                        boxShadow: active === item.id ? 'var(--shadow)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: active === item.id ? 'var(--primary)' : 'var(--muted)', display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                      <ArrowRight size={14} style={{ opacity: active === item.id ? 1 : 0, transition: 'opacity 0.2s' }} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="docs-main">
          
          <section id="intro" className="docs-section">
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '24px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              What is <span style={{ color: 'var(--primary)' }}>BridgeAI?</span>
            </h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Your Universal AI Conversation Bridge
            </h2>
            <p>
              Every AI platform has different strengths. ChatGPT for coding, Claude for long documents, Gemini for research, DeepSeek for technical reasoning. 
            </p>
            <p>
              <strong>The problem?</strong> Every time you switch platforms, you have to explain everything again.
            </p>
            <p>
              BridgeAI solves this by helping you move important conversation context from one AI to another, so your work keeps moving forward.
            </p>

            <div className="docs-card">
              <ul className="docs-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><CheckCircle size={20} color="var(--primary)" /> One-click transfer</li>
                <li><CheckCircle size={20} color="var(--primary)" /> Works across major AI platforms</li>
                <li><CheckCircle size={20} color="var(--primary)" /> Privacy-first design</li>
                <li><CheckCircle size={20} color="var(--primary)" /> No more copy-paste chaos</li>
              </ul>
            </div>
          </section>

          <section id="audience" className="docs-section">
            <h2>Who Is It For?</h2>
            <p>Built for anyone using AI to accelerate their workflows.</p>
            
            <div className="grid-responsive-2" style={{ gap: '24px', marginTop: '32px' }}>
              {[
                { i: <GraduationCap size={26} />, c: '#8b5cf6', rgb: '139, 92, 246', t: 'Students', d: 'Move study sessions between different AI tools without losing notes and explanations.' },
                { i: <Terminal size={26} />, c: '#10b981', rgb: '16, 185, 129', t: 'Developers', d: 'Transfer coding discussions, debugging sessions, and project requirements instantly.' },
                { i: <LineChart size={26} />, c: '#f59e0b', rgb: '245, 158, 11', t: 'Marketers', d: 'Continue content planning, campaign research, and strategy discussions across platforms.' },
                { i: <Rocket size={26} />, c: '#ef4444', rgb: '239, 68, 68', t: 'Founders', d: 'Keep product ideas, business plans, and brainstorming sessions connected.' },
                { i: <PenTool size={26} />, c: '#ec4899', rgb: '236, 72, 153', t: 'Writers', d: 'Move drafts, outlines, and creative workflows wherever you work best.' },
                { i: <Microscope size={26} />, c: '#0ea5e9', rgb: '14, 165, 233', t: 'Researchers', d: 'Keep research context organized while exploring multiple AI systems.' }
              ].map((role, idx) => (
                <div key={idx} style={{ 
                    padding: '32px', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.06)', 
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = `rgba(${role.rgb}, 0.3)`;
                    e.currentTarget.style.boxShadow = `0 30px 60px rgba(${role.rgb}, 0.15)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                    background: `linear-gradient(90deg, ${role.c}, transparent)`
                  }} />
                  <div style={{ 
                      width: '56px', height: '56px', borderRadius: '16px', 
                      background: `rgba(${role.rgb}, 0.1)`,
                      color: role.c,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '20px'
                    }}>
                    {role.i}
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f2f2f2', marginBottom: '12px' }}>{role.t}</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{role.d}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section id="workflow" className="docs-section">
            <h2>How It Works</h2>
            <p>Three simple steps to move your conversations anywhere.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '40px' }}>
              {[
                { t: '1. Capture Your Conversation', d: 'Click the BridgeAI extension and extract the important parts of your current chat.' },
                { t: '2. Switch to Another AI', d: 'Open ChatGPT, Claude, Gemini, DeepSeek, Perplexity, or another supported platform.' },
                { t: '3. Continue Instantly', d: 'BridgeAI transfers the context so you can pick up exactly where you left off.' }
              ].map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem', fontWeight: '800', border: '1px solid var(--primary)' }}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>{w.t}</h4>
                    <p style={{ margin: 0 }}>{w.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="docs-card" style={{ marginTop: '48px', background: 'var(--primary-soft)', borderColor: 'rgba(255, 107, 44, 0.2)' }}>
              <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: '600', fontSize: '1.2rem', textAlign: 'center' }}>
                No re-explaining. No lost information. No wasted time.
              </p>
            </div>
          </section>

          <section id="benefits" className="docs-section">
            <h2>Why People Love BridgeAI</h2>
            <h3>Save Hours Every Week</h3>
            <p>Instead of repeatedly explaining your project, your requirements, previous decisions, existing code, or research findings... BridgeAI carries the context for you.</p>
            <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.2rem', marginTop: '24px' }}>
              Focus on solving problems, not repeating them.
            </p>
          </section>

          <section id="privacy" className="docs-section">
            <h2>Privacy First</h2>
            <h3>Your Conversations Stay Under Your Control</h3>
            <p>BridgeAI is designed with privacy in mind. You decide what gets transferred.</p>
            
            <ul className="docs-list" style={{ listStyle: 'none', padding: 0, marginTop: '32px' }}>
              <li><Shield size={20} color="var(--primary)" /> Your data stays under your control</li>
              <li><Shield size={20} color="var(--primary)" /> No unnecessary collection of conversations</li>
              <li><Shield size={20} color="var(--primary)" /> Secure transfer mechanisms</li>
              <li><Shield size={20} color="var(--primary)" /> Easy data removal whenever you want</li>
            </ul>
          </section>

          <section id="usecases" className="docs-section">
            <h2>Use Cases</h2>
            <div className="grid-responsive-2" style={{ gap: '24px' }}>
              {[
                { icon: <Code2 />, title: 'Continue Coding Across AI Models', desc: 'Start building in ChatGPT and continue debugging in Claude.' },
                { icon: <Search />, title: 'Research Faster', desc: 'Move research findings between multiple AI assistants without losing context.' },
                { icon: <FileText />, title: 'Build Better Content', desc: 'Draft in one platform, refine in another, and publish faster.' },
                { icon: <Briefcase />, title: 'Manage Complex Projects', desc: 'Keep requirements, decisions, and discussions connected across tools.' },
              ].map((uc, i) => (
                <div key={i} className="docs-card" style={{ marginTop: 0 }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>{uc.icon}</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>{uc.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{uc.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default DocsPage;
