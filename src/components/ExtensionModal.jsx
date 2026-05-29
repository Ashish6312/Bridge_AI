import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const [downloaded, setDownloaded] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        <style>{`
          .extension-modal-content::-webkit-scrollbar {
            width: 6px;
          }
          .extension-modal-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.01);
            border-radius: 10px;
          }
          .extension-modal-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .extension-modal-content::-webkit-scrollbar-thumb:hover {
            background: var(--primary);
          }
        `}</style>
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="extension-modal-content"
          style={{
            width: '100%', maxWidth: '560px',
            padding: '40px',
            borderRadius: '24px',
            background: '#0D0D0D',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(255, 107, 44, 0.05)',
            maxHeight: '90vh', overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0.01)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '14px', display: 'flex' }}>
                  <Puzzle size={22} color="white" />
                </div>
                <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: '800', color: '#F5F5F5', letterSpacing: '-0.02em' }}>Install BridgeAI Extension</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                Works on Chrome, Brave, Edge — any Chromium browser.
              </p>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-secondary)', borderRadius: '10px', padding: '8px',
              cursor: 'pointer', display: 'flex', flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#F5F5F5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Download CTA */}
          <a
            href="/bridgeai-extension.zip"
            download="bridgeai-extension.zip"
            onClick={() => setDownloaded(true)}
            className="btn-primary"
            style={{ width: '100%', padding: '18px', fontSize: '1.1rem', justifyContent: 'center', marginBottom: '40px', borderRadius: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {downloaded
              ? <><CheckCircle size={20} /> Extension Obtained</>
              : <><Download size={20} /> Download Extension (.zip)</>
            }
          </a>

          {/* Steps */}
          <p style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase' }}>
            Installation Steps
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                padding: '20px', borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)', background: 'var(--primary-soft)', padding: '2px 10px', borderRadius: '100px' }}>
                      STEP {i + 1}
                    </span>
                    <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#F5F5F5' }}>{step.title}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                  {step.code && (
                    <code style={{
                      display: 'inline-block', marginTop: '10px',
                      background: 'rgba(255, 107, 44, 0.08)', color: 'var(--primary)',
                      border: '1px solid rgba(255, 107, 44, 0.15)',
                      padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem',
                      fontFamily: 'monospace', fontWeight: '600'
                    }}>{step.code}</code>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            Ready to relay? Open your browser and start bridging context.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExtensionModal;
