import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Users, Award, Target, BookOpen, Puzzle, ArrowRight, Activity, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHelmet from '../components/SEOHelmet';

const StatCounter = ({ value, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(/[0-9]/.test(value) ? "0" : value);
  
  useEffect(() => {
    const hasNumbers = /[0-9]/.test(value);
    if (!hasNumbers) {
      setDisplayValue(value);
      return;
    }
    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));
    const stringSuffix = value.replace(/[0-9.]/g, ''); 
    const duration = 2000; 
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = (numericPart * easeProgress).toFixed(value.includes('.') ? 1 : 0);
      setDisplayValue(`${current}${stringSuffix}`);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [value]);

  return <span>{displayValue}</span>;
};

const AboutPage = () => {
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <SEOHelmet 
        title="About Us"
        description="Learn more about BridgeAI - our mission to enable context portability and eliminate redundant typing across AI platforms."
        keywords={['about bridgeai', 'context bridge team', 'Entrext Labs', 'LLM workflow automation', 'local-first tool']}
      />

      {/* ── Hero / Mission ─────────────────────────────────────── */}
      <section style={{ padding: '160px 0 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '600px', background: 'linear-gradient(180deg, var(--primary-soft) 0%, transparent 100%)', pointerEvents: 'none' }} />
        <div className="container">
          <div className="grid-responsive-2" style={{ gap: '80px', alignItems: 'center' }}>
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--primary-soft)', borderRadius: '100px', marginBottom: '32px', border: '1px solid var(--border-subtle)' }}>
                <Globe size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>About BridgeAI</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.05em', marginBottom: '32px', lineHeight: 1.1 }}>
                Making AI Tools <br /> <span style={{ color: 'var(--primary)' }}>Work Together.</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '48px', maxWidth: '650px' }}>
                Every AI tool has different strengths. Some people use ChatGPT for coding, Claude for long documents, Gemini for research, and DeepSeek for technical reasoning.
                <br /><br />
                The problem? Every time you switch tools, you have to explain everything again. BridgeAI helps people move conversations, projects, research, prompts, and ideas between AI platforms without losing context.
              </p>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.04em' }}>
                    <StatCounter value="1.2M+" />
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Context Transfers Completed</div>
                </div>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.04em' }}>
                    <StatCounter value="10k+" />
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Users</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ position: 'relative' }}>
              <div style={{ width: '100%', aspectRatio: '4/5', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '40px', overflow: 'hidden', position: 'relative', zIndex: 1, boxShadow: 'var(--shadow)' }}>
                <img src="/about_hq.png" alt="BridgeAI Headquarters" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px', padding: '24px', background: 'var(--card)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <Award color="var(--primary)" size={20} />
                      <span style={{ fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-main)' }}>Our Mission</span>
                   </div>
                   <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: '600' }}>
                      "To make switching between AI tools as easy as switching between browser tabs."
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Core Principles ─────────────────────────────────────────── */}
      <section style={{ padding: '120px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '24px', letterSpacing: '-0.04em' }}>Our Core Principles</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6 }}>We believe AI should make people more productive—not force them to repeat the same instructions over and over.</p>
          </div>
          <div className="grid-responsive-2" style={{ gap: '32px' }}>
            {[
              { icon: <Activity />, title: "Save Time", desc: "Stop copying entire conversations between AI platforms. Continue where you left off." },
              { icon: <Shield />, title: "Privacy First", desc: "Your conversations belong to you. BridgeAI is designed to keep your data secure and under your control." },
              { icon: <Globe />, title: "AI-Agnostic", desc: "We don't believe in locking people into one AI platform. Use whichever AI is best for the task. BridgeAI helps them work together." },
              { icon: <Target />, title: "Productivity Without Friction", desc: "The best tools disappear into the background. BridgeAI is designed to make switching between AI platforms feel effortless." }
            ].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: '48px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '32px', boxShadow: 'var(--shadow)', transition: 'all 0.3s' }}
                whileHover={{ y: -8, borderColor: 'var(--primary)', boxShadow: 'var(--shadow-hover)' }}
              >
                <div style={{ color: 'var(--primary)', background: 'var(--primary-soft)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>{v.icon}</div>
                <h3 style={{ color: 'var(--text-main)', fontWeight: '900', fontSize: '1.5rem', marginBottom: '20px', letterSpacing: '-0.02em' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Network Section ───────────────────────────────────── */}
      <section style={{ padding: '140px 0', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
             style={{ background: 'var(--bg-main)', padding: '100px 40px', borderRadius: '48px', color: 'var(--text-main)', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border-subtle)' }}
          >
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, background: 'var(--primary-soft)' }} />
             <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '24px', letterSpacing: '-0.05em', color: 'var(--text-main)' }}>Trusted by thousands of AI users worldwide.</h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
                   BridgeAI exists so you can focus on creating, learning, building, and researching instead of managing context.
                </p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works (Step by Step) ─────────────────────────────────── */}
      <section style={{ padding: '140px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--primary-soft)', borderRadius: '100px', marginBottom: '24px', border: '1px solid var(--border-subtle)' }}>
              <Layers size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>The Workflow</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '900', color: 'var(--text-main)', marginBottom: '24px', letterSpacing: '-0.04em' }}>How BridgeAI Works</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              A seamless, zero-friction pipeline that moves your active logic across any LLM in seconds.
            </p>
          </div>

          <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Connecting Line for Desktop */}
            <div style={{ position: 'absolute', top: '0', bottom: '0', left: '50px', width: '2px', background: 'linear-gradient(to bottom, var(--primary), transparent)', opacity: 0.3, display: 'none' }} className="desktop-line" />
            
            <style>{`
              @media (min-width: 768px) {
                .desktop-line { display: block !important; }
                .step-item { flex-direction: row !important; align-items: flex-start !important; }
                .step-icon-wrap { margin-bottom: 0 !important; }
              }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
              {[
                { 
                  num: '01', 
                  title: 'Capture Your Conversation', 
                  desc: 'Click the BridgeAI extension while using your favorite AI platform.',
                  icon: <Activity size={24} color="var(--primary)" />
                },
                { 
                  num: '02', 
                  title: 'Save Context Securely', 
                  desc: 'BridgeAI prepares the important information from your conversation while keeping it protected.',
                  icon: <Shield size={24} color="var(--primary)" />
                },
                { 
                  num: '03', 
                  title: 'Continue Anywhere', 
                  desc: 'Open another supported AI platform and continue your work without starting over.',
                  icon: <ArrowRight size={24} color="var(--primary)" />
                }
              ].map((step, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} 
                  className="step-item" style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 2 }}>
                  
                  <div className="step-icon-wrap" style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow)', position: 'relative', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', top: -10, left: -10, fontSize: '0.8rem', fontWeight: '900', color: 'var(--bg-main)', background: 'var(--text-main)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {step.num}
                    </div>
                    {step.icon}
                  </div>

                  <div style={{ flex: 1, padding: '32px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.02em' }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '120px 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '24px', letterSpacing: '-0.02em' }}>The Future of AI Isn't One Model</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 48px' }}>
              It's many models working together. BridgeAI helps people move seamlessly between AI platforms so they can always use the right tool for the job.
            </p>
            <div className="mobile-col" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/extension" className="btn-primary" style={{ padding: '18px 48px', fontSize: '1.1rem' }}>Get Extension</Link>
              <Link to="/services" className="btn-secondary" style={{ padding: '18px 48px', fontSize: '1.1rem' }}>View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
