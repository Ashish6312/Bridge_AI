import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Puzzle, Pin, CheckCircle, ExternalLink, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    icon: <Download size={22} color="#8b5cf6" />,
    title: "Download Extension",
    desc: "Click the button below to download the BridgeAI extension zip file.",
    action: true,
  },
  {
    icon: <ExternalLink size={22} color="#06b6d4" />,
    title: 'Open Extensions Page',
    desc: 'In Chrome, navigate to chrome://extensions and enable Developer Mode (top-right toggle).',
    code: 'chrome://extensions',
  },
  {
    icon: <Puzzle size={22} color="#f43f5e" />,
    title: 'Load Unpacked',
    desc: 'Click "Load unpacked" and select the extracted BridgeAI folder from your Downloads.',
  },
  {
    icon: <Pin size={22} color="#4ade80" />,
    title: 'Pin to Toolbar',
    desc: 'Click the puzzle icon (🧩) in Chrome toolbar, find BridgeAI and click the Pin icon.',
  },
  {
    icon: <CheckCircle size={22} color="#8b5cf6" />,
    title: 'You\'re Live!',
    desc: 'Open any ChatGPT, Gemini, or Claude tab and click the BridgeAI icon to start bridging.',
  },
];

const ExtensionModal = ({ onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    // Point to the clean, packaged extension zip in the public folder
    window.open('/bridgeai-extension.zip', '_blank');
    setDownloaded(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          initial={{ scale: 0.92, y: 32 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 32 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
          className="glass-card"
          style={{
            width: '100%', maxWidth: '560px',
            padding: '40px',
            border: '1px solid rgba(139,92,246,0.25)',
            background: 'rgba(10,12,30,0.96)',
            maxHeight: '90vh', overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: 'var(--gradient-1)', padding: '10px', borderRadius: '14px', display: 'flex' }}>
                  <Puzzle size={22} color="white" />
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Install BridgeAI Extension</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Works on Chrome, Brave, Edge — any Chromium browser.
              </p>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
              color: 'var(--text-muted)', borderRadius: '10px', padding: '8px',
              cursor: 'pointer', display: 'flex', flexShrink: 0,
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Download CTA */}
          <button
            onClick={handleDownload}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', marginBottom: '32px' }}
          >
            {downloaded
              ? <><CheckCircle size={18} /> Downloaded!</>
              : <><Download size={18} /> Download Extension (.zip)</>
            }
          </button>

          {/* Steps */}
          <p style={{ fontSize: '0.78rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            INSTALLATION STEPS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                padding: '16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary)', background: 'rgba(139,92,246,0.12)', padding: '2px 8px', borderRadius: '100px' }}>
                      Step {i + 1}
                    </span>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{step.title}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                  {step.code && (
                    <code style={{
                      display: 'inline-block', marginTop: '8px',
                      background: 'rgba(139,92,246,0.1)', color: 'var(--primary)',
                      padding: '4px 10px', borderRadius: '8px', fontSize: '0.82rem',
                      fontFamily: 'monospace',
                    }}>{step.code}</code>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            After install, open any AI chat page and click the 🔷 BridgeAI icon in your toolbar.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExtensionModal;
