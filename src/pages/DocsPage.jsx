import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Layers, Shield, LifeBuoy, ChevronRight, 
  Terminal, BookOpen, Lock, Cpu, Globe, 
  Code2, Share2, Database, Activity 
} from 'lucide-react';

// ── Documentation Content Configuration ──────────────────────────

const SECTIONS = [
  { 
    group: 'ORIENTATION', 
    items: [
      { id: 'intro',     icon: <Zap size={18} />,       label: 'Operational Start' },
      { id: 'workflow',  icon: <Activity size={18} />,  label: 'Bridge Workflow' },
      { id: 'concepts',  icon: <Globe size={18} />,     label: 'Core Concepts' },
      { id: 'market',    icon: <Database size={18} />,  label: 'Market Intelligence' },
    ]
  },
  { 
    group: 'PLATFORM PROTOCOLS', 
    items: [
      { id: 'modes',     icon: <Layers size={18} />,    label: 'Intelligence Modes' },
      { id: 'vault',     icon: <Lock size={18} />,      label: 'Security Architecture' },
      { id: 'api',       icon: <Code2 size={18} />,     label: 'Developer API' },
    ]
  },
  { 
    group: 'GOVERNANCE', 
    items: [
      { id: 'rights',     icon: <Shield size={18} />,    label: 'Data Rights' },
      { id: 'support',    icon: <LifeBuoy size={18} />,  label: 'Technical Response' },
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
      rootMargin: '-20% 0px -70% 0px',
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
    <div style={{ 
      minHeight: '100vh', 
      background: 'transparent', 
      color: 'white', 
      position: 'relative'
    }}>
      
      {/* ── Layout ────────────────────────────────────────────────── */}
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: '1600px', 
        margin: '0 auto', 
        position: 'relative', 
        alignItems: 'flex-start',
        zIndex: 1 
      }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ 
          width: '320px',
          padding: '20px 32px',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(2, 6, 23, 0.4)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: '80px',
          height: 'calc(100vh - 80px)',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ background: 'var(--gradient-1)', padding: '8px', borderRadius: '10px' }}>
                <BookOpen size={20} color="white" />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>Sovereign Docs</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Version 2.0.1 Stable</p>
          </div>

          <nav style={{ flex: 1 }}>
            {SECTIONS.map(group => (
              <div key={group.group} style={{ marginBottom: '32px' }}>
                <h5 style={{ fontSize: '0.65rem', fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', paddingLeft: '16px' }}>{group.group}</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px',
                        border: 'none', background: active === item.id ? 'rgba(139,92,246,0.12)' : 'transparent',
                        color: active === item.id ? 'white' : '#94a3b8', fontWeight: '700', fontSize: '0.85rem',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: active === item.id ? 'var(--primary)' : 'inherit', display: 'flex' }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                      {active === item.id && <ChevronRight size={14} color="#8b5cf6" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={{ 
          flex: 1,
          padding: '100px 80px 100px',
          maxWidth: '1200px'
        }}>
          
          {/* Section: Operational Start */}
          <motion.section 
            id="intro"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '100px', border: '1px solid rgba(139, 92, 246, 0.15)', marginBottom: '24px' }}>
              <Activity size={12} className="premium-gradient-text" />
              <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.8)' }}>Onboarding Protocol</span>
            </div>
            
            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '24px', letterSpacing: '-0.04em', lineHeight: 1 }}>The Bridge <span className="premium-gradient-text">Manual</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', lineHeight: '1.7', marginBottom: '48px', maxWidth: '800px' }}>
              BridgeAI is a professional context-relay system. It connects your work across different AI platforms (like ChatGPT and Claude) so you never have to repeat yourself or lose progress.
            </p>

            <div className="glass-card" style={{ padding: '48px', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden', borderRadius: '32px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'var(--gradient-1)' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '28px' }}>Getting Started in 3 Simple Steps</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {[
                  { t: 'Install Extension', d: 'Add the BridgeAI extension to your browser from the Chrome Web Store.' },
                  { t: 'Sign In', d: 'Create an account to securely sync your bridges across all your devices.' },
                  { t: 'Extract Context', d: 'Click the "Bridge" button in any AI chat to capture the conversation instantly.' }
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem', fontWeight: '900', color: 'white', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}>{idx + 1}</div>
                    <div>
                      <h4 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: '800' }}>{step.t}</h4>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
          
          {/* Section: Bridge Workflow */}
          <motion.section 
            id="workflow"
            style={{ marginTop: '160px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '24px', letterSpacing: '-0.03em' }}>System <span className="premium-gradient-text">Workflow</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
              {[
                { n: '01', title: 'Context Capture', desc: 'Use the extension while chatting with an LLM. It captures raw state, thread reasoning, and logic variables without metadata pollution.' },
                { n: '02', title: 'Sovereign Summarization', desc: 'Our engine cleans the capture, isolating technical goals and bug states into a condensed "Prompt Core" suitable for any model.' },
                { n: '03', title: 'Vault Synchronization', desc: 'Securely store your bridge in the Hub. These are private, encrypted, and accessible only via your authenticated sovereign identity.' },
                { n: '04', title: 'Relay & Resume', desc: 'Select a target AI (Claude, Gemini, etc.) and "Forge" the bridge. The system dispatches the context so the new AI is immediately operational.' }
              ].map((w, i) => (
                <div key={i} className="glass-card" style={{ padding: '32px', position: 'relative' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '900', opacity: 0.1, position: 'absolute', top: '10px', right: '20px' }}>{w.n}</div>
                  <h4 style={{ fontWeight: '800', marginBottom: '12px', fontSize: '1.2rem' }}>{w.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>{w.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section: Core Concepts */}
          <motion.section 
            id="concepts" 
            style={{ marginTop: '160px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '24px', letterSpacing: '-0.03em' }}>Core Concepts</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '40px', maxWidth: '850px' }}>
              Understanding the BridgeAI ecosystem is key to mastering cross-AI workflows. Here are the three pillars of our platform:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                { title: 'The Bridge', desc: 'A temporary snapshot of an AI conversation, optimized for transfer.', icon: <Share2 color="#8b5cf6" /> },
                { title: 'The Vault', desc: 'Your permanent storage for important projects and context packs.', icon: <Database color="#06b6d4" /> },
                { title: 'The Relay', desc: 'The engine that rewrites context for different AI platforms.', icon: <Cpu color="#fb7185" /> }
              ].map((c, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -8 }}
                  style={{ padding: '32px', borderRadius: '28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}
                >
                  <div style={{ marginBottom: '20px', display: 'inline-flex', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>{c.icon}</div>
                  <h4 style={{ fontWeight: '800', marginBottom: '10px' }}>{c.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section: Market Intelligence */}
          <motion.section 
            id="market" 
            style={{ marginTop: '160px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '24px', letterSpacing: '-0.03em' }}>Market Intelligence</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '48px', maxWidth: '850px' }}>
              Why bridging matters: Recent institutional studies indicate a massive fracture in the modern developer and analyst workflow. AI capabilities are highly fragmented across different proprietary models.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              
              <div className="glass-card" style={{ padding: '40px', background: 'radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.1), transparent)' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', marginBottom: '8px' }}>68<span style={{ color: 'var(--primary)' }}>%</span></div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Context Loss Penalty</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  Knowledge workers lose an average of 42 minutes a day simply re-explaining project premises to different AI wrappers, leading to a 68% degradation in prompt effectiveness during platform switches.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '40px', background: 'radial-gradient(ellipse at top left, rgba(6, 182, 212, 0.1), transparent)' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', marginBottom: '8px' }}>4.2<span style={{ color: 'var(--secondary)' }}>x</span></div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Multi-LLM Velocity</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  Teams that dynamically switch between Gemini (for logical reasoning), Claude (for coding nuances), and Perplexity (for factual sourcing) produce results 4.2x faster than single-model practitioners.
                </p>
              </div>

              <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px 48px', display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px' }}>The "Bridge" Solution</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                    Our proprietary intelligence relay normalizes the token footprint across vendors. By isolating instructions, variables, and history, BridgeAI ensures you never start from zero. The total addressable market for context-middleware is projected to hit $14.2B by 2028, positioning BridgeAI at the epicenter of the sovereign data economy.
                  </p>
                </div>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Activity size={40} color="white" />
                </div>
              </div>
              
            </div>
          </motion.section>

          {/* Section: Intelligence Modes */}
          <section id="modes" style={{ marginTop: '160px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '24px' }}>Intelligence Modes</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '48px' }}>
              Different tasks require different types of context. Choose the mode that fits your current project:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
              {[
                { title: 'Quick Summary', desc: 'Best for getting the gist of a long meeting or article. Direct and concise.' },
                { title: 'Developer Pack', desc: 'Extracts code, library versions, and architectural decisions perfectly.' },
                { title: 'Research Bridge', desc: 'Links theories, citations, and data points into a logical flow.' },
                { title: 'Project Resume', desc: 'The ultimate tool for continuing a project as if you never left.' }
              ].map((m, i) => (
                <div key={i} className="glass-card" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139,92,246,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={24} color="#8b5cf6" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '800', marginBottom: '6px' }}>{m.title}</h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Security */}
          <section id="vault" style={{ marginTop: '160px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '24px' }}>Security Architecture</h2>
            <div className="glass-card" style={{ padding: '48px', background: 'rgba(244, 63, 94, 0.04)', border: '1px solid rgba(244, 63, 94, 0.15)', borderRadius: '32px' }}>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ padding: '20px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '24px' }}>
                  <Shield size={40} color="#f43f5e" />
                </div>
                <div>
                  <h4 style={{ fontWeight: '900', marginBottom: '12px', fontSize: '1.6rem' }}>Zero-Knowledge Sovereignty</h4>
                  <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0, lineHeight: '1.7', maxWidth: '700px' }}>
                    Your data is encrypted locally before it ever leaves your machine. BridgeAI employees and servers cannot read your conversations. You hold the only keys.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: API */}
          <section id="api" style={{ marginTop: '160px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '24px' }}>Developer API</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '32px' }}>
              Integrate BridgeAI into your own custom tools or CI/CD pipelines using our straightforward REST API.
            </p>
            <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '0.9rem', color: '#94a3b8' }}>
              <div style={{ color: '#8b5cf6', marginBottom: '8px' }}>// Initialize the Bridge Hub</div>
              <div>const bridge = await Bridge.init("YOUR_API_KEY");</div>
              <div style={{ color: '#8b5cf6', margin: '16px 0 8px' }}>// Capture current context</div>
              <div>const context = await bridge.capture();</div>
              <div style={{ color: '#8b5cf6', margin: '16px 0 8px' }}>// Send to specific target</div>
              <div>await bridge.relay(context, "claude-3-opus");</div>
            </div>
          </section>

          {/* Section: Support */}
          <section id="support" style={{ marginTop: '160px', paddingBottom: '100px' }}>
             <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '24px' }}>Technical Response</h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.7', maxWidth: '800px' }}>
               Need professional assistance? Our response team is available 24/7 for Institutional Tier users. Connect via the Secure Gateway in your dashboard.
             </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
