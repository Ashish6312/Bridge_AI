import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, GitMerge, Share2, Layers, Download, Puzzle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../apiConfig';

const FEATURES = [
  { icon: <Zap color="#8b5cf6" />, title: "5 Intelligence Modes", desc: "Quick TL;DR, Developer, Research, Study, or Project — each generates perfectly structured summaries." },
  { icon: <Share2 color="#06b6d4" />, title: "One-Click Resume", desc: "Copy context & open Gemini or Claude in a single click. No restarting, no manual paste hunting." },
  { icon: <Layers color="#f43f5e" />, title: "Project Memory Vault", desc: "Organise bridges into named projects. Your AI work stays structured, searchable, and retrievable." },
  { icon: <GitMerge color="#8b5cf6" />, title: "Multi-Chat Merge", desc: "Combine your last 3 bridges into one unified context. Perfect for developers and researchers." },
  { icon: <Download color="#06b6d4" />, title: "Export Anywhere", desc: "Download as Markdown, JSON, or Prompt Pack. Use your context in any tool, forever." },
  { icon: <Shield color="#f43f5e" />, title: "Local-First Privacy", desc: "Everything stored in your browser vault. Zero servers, zero subscriptions, zero data leaks." },
];

const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === 'true';

  return (
    <div className="landing-container" style={{ position: 'relative' }}>

      {/* ── Onboarding Overlay ─────────────────────────────────────── */}
      {isOnboarding && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(2,6,23,0.88)', backdropFilter: 'blur(10px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
          <motion.div animate={{ y: [0, -8, 0], x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}
            style={{ position: 'absolute', top: '8px', right: '15%', zIndex: 10000 }}>
            <div style={{ position: 'relative' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px var(--primary-glow))' }}>
                <line x1="2" y1="22" x2="22" y2="2" /><polyline points="10 2 22 2 22 14" />
              </svg>
              <div style={{ position: 'absolute', top: '70px', right: '-10px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
                PIN HERE ↗
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
            className="glass-card" style={{ maxWidth: '580px', width: '90%', padding: '40px', textAlign: 'center', zIndex: 10001 }}>
            <div style={{ background: 'var(--gradient-1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
              <Puzzle size={30} color="white" />
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px' }}>Installation Complete! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '1.05rem' }}>
              Pin BridgeAI to your browser toolbar for one-click access on any AI platform.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '14px', marginBottom: '28px' }}>
              {['Click the Puzzle Icon at the top right of your browser.', 'Find BridgeAI in the dropdown menu.', 'Click the Pin (📌) icon next to it!'].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <Link to="/dashboard" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}>
              I've Pinned It — Take me to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ padding: '110px 0 100px', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'rgba(139,92,246,0.12)', color: 'var(--primary)',
                padding: '7px 18px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: '600',
                border: '1px solid rgba(139,92,246,0.25)', display: 'inline-block', marginBottom: '28px'
              }}
            >
              🚀 Sovereign Context Engine v2.0
            </motion.span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4.8rem)', fontWeight: 900, lineHeight: 1, maxWidth: '960px', margin: '0 auto 24px', letterSpacing: '-0.04em' }}>
              The Intelligence Bridge for<br />
              <span className="premium-gradient-text">High-Density AI Work</span>
            </h1>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto 48px', lineHeight: 1.6 }}>
              Seamlessly sync, summarize, and resume your complex LLM workflows across ChatGPT, Gemini, and Claude in one click.
            </p>
            <div className="hero-cta" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1.1rem', padding: '18px 40px', borderRadius: '100px' }}>
                Start Your Bridge <ArrowRight size={20} />
              </Link>
              <Link to="/docs" style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', padding: '18px 40px', borderRadius: '100px',
                fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px',
                transition: '0.3s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                Explore Protocols 🪄
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '120px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.03em' }}>
              Elite Context <span className="premium-gradient-text">Orchestration</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>A professional unified intelligence layer for the AI-first modern stack.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
                style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.4)' }}
              >
                <div style={{ background: 'rgba(255,255,255,0.03)', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {f.icon}
                </div>
                <h3 style={{ marginBottom: '12px', fontSize: '1.4rem', fontWeight: '800' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default LandingPage;
