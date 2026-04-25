import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Puzzle, Pin, CheckCircle, ExternalLink, Activity, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    icon: <Download size={24} color="#8b5cf6" />,
    title: "Download Intelligence Package",
    desc: "Obtain the official BridgeAI extension bundle. This contains the sovereign relay logic for your browser.",
    action: true,
  },
  {
    icon: <ExternalLink size={24} color="#06b6d4" />,
    title: 'Initialize Developer Protocol',
    desc: 'Navigate to chrome://extensions and enable "Developer Mode" in the top-right corner.',
    code: 'chrome://extensions',
  },
  {
    icon: <Puzzle size={24} color="#f43f5e" />,
    title: 'Materialize Unpacked',
    desc: 'Select "Load unpacked" and point it to the extracted BridgeAI folder in your downloads.',
  },
  {
    icon: <Pin size={24} color="#4ade80" />,
    title: 'Pin to Command Center',
    desc: 'Click the extensions icon (🧩), find BridgeAI, and pin it to your primary toolbar.',
  },
  {
    icon: <CheckCircle size={24} color="#8b5cf6" />,
    title: 'Relay Operational',
    desc: 'Open any AI platform (Gemini, Claude, ChatGPT) and click the 🔷 icon to start bridging.',
  },
];

const ExtensionPage = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    window.open('/bridgeai-extension.zip', '_blank');
    setDownloaded(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', padding: '120px 20px 100px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* ── Header ────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', 
              borderRadius: '100px', border: '1px solid rgba(139, 92, 246, 0.2)',
              marginBottom: '32px'
            }}>
              <Puzzle size={14} className="premium-gradient-text" />
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)' }}>Installation Protocol</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '900', marginBottom: '24px', letterSpacing: '-0.04em', lineHeight: 1 }}>
              Deploy the <span className="premium-gradient-text">BridgeAI Relay</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: '1.7', maxWidth: '700px', margin: '0 auto' }}>
              Equip your browser with the sovereign context engine. Works across all Chromium-based browsers including Chrome, Brave, and Edge.
            </p>
          </motion.div>
        </div>

        {/* ── Main Action ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'start' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card" style={{ padding: '48px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px' }}>
              <div style={{ background: 'var(--gradient-1)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
                <Download size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', color: 'white' }}>Ready for Deployment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
                Download the latest stable build of the BridgeAI sovereign package. 
                This ZIP contains everything needed to bridge context across your LLM hubs.
              </p>
              
              <button 
                onClick={handleDownload}
                className="btn-primary" 
                style={{ width: '100%', padding: '20px', fontSize: '1.1rem', justifyContent: 'center', borderRadius: '16px' }}
              >
                {downloaded ? <><CheckCircle size={22} /> Package Obtained</> : <><Download size={22} /> Download Package (.zip)</>}
              </button>
              
              <div style={{ marginTop: '32px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
                  <Shield size={16} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase' }}>Verified Build</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  This package is stripped of all server-side logic and secrets. It is safe for local developer installation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Steps Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="glass-card" 
                style={{ padding: '24px 32px', display: 'flex', gap: '24px', alignItems: 'center' }}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--primary)', opacity: 0.6 }}>PROTOCOL {i + 1}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{step.title}</h4>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                  {step.code && <code style={{ display: 'inline-block', marginTop: '10px', background: 'rgba(139,92,246,0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace' }}>{step.code}</code>}
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ── Footer Link ───────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '600' }} className="hover-white">
            Return to Dashboard <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ExtensionPage;
