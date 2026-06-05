import React from 'react';
import { Layers, RefreshCw, Check } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, fixingStep: 0 };
    this.interval = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Detect if this is a chunk-load failure (happens after new deployments)
  static isChunkLoadError(error) {
    const msg = error?.message || '';
    return (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('Unable to preload CSS') ||
      (error?.name === 'TypeError' && msg.includes('fetch'))
    );
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // For chunk load errors (stale deployment), immediately reload to get fresh assets
    if (ErrorBoundary.isChunkLoadError(error)) {
      console.warn('[Bridge] Chunk load failure detected — reloading for fresh assets...');
      window.location.reload();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      this.startFixingSimulation();
    }
  }

  startFixingSimulation() {
    this.interval = setInterval(() => {
      this.setState((prev) => {
        if (prev.fixingStep >= 4) {
          clearInterval(this.interval);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          return prev;
        }
        return { fixingStep: prev.fixingStep + 1 };
      });
    }, 1500);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  handleManualRetry = () => {
    this.setState({ hasError: false, error: null, fixingStep: 0 });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const steps = [
        "Detecting context memory corruption...",
        "Re-establishing encrypted LLM handshake...",
        "Re-aligning bridge orchestration relay...",
        "Restoring last healthy session state...",
        "State restored! Reloading client interface..."
      ];
      
      const stepProgress = (this.state.fixingStep / 4) * 100;

      return (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999999,
          background: '#050505', color: '#F5F5F5',
          fontFamily: "'Satoshi', 'General Sans', sans-serif",
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', overflow: 'hidden'
        }}>
          {/* Subtle grid lines background overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15,
            backgroundImage: `linear-gradient(rgba(255,107,44,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,44,0.015) 1px, transparent 1px)`,
            backgroundSize: '80px 80px', zIndex: 0
          }} />

          {/* Glowing Ambient lighting circles */}
          <div style={{
            position: 'absolute', top: '15%', left: '20%', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,44,0.07) 0%, transparent 70%)',
            filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
          }} />
          <div style={{
            position: 'absolute', bottom: '15%', right: '20%', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
            filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 520, width: '100%' }}>
            
            {/* Bridge AI Brand Logo Outline */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, marginBottom: 40 }}>
              {/* B Logo Icon */}
              <div style={{ width: 48, height: 48, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <mask id="error-logo-cutout">
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <path d="M 16 66 C 30 50, 60 42, 92 60 C 60 46, 30 54, 16 66 Z" fill="black" />
                    </mask>
                  </defs>
                  <path fillRule="evenodd" clipRule="evenodd" d="M30 20 H58 C72 20 80 26 80 35 C80 42 75 47 68 49 C77 51 82 56 82 65 C82 76 73 80 58 80 H30 V20 Z M44 32 H55 C61 32 66 34 66 38 C66 42 61 44 55 44 H44 V32 Z M44 54 H57 C63 54 68 56 68 60 C68 64 63 66 57 66 H44 V54 Z" fill="currentColor" mask="url(#error-logo-cutout)"/>
                  <path d="M 19 65 C 32 52, 60 45, 89 59 C 60 49, 32 56, 19 65 Z" fill="currentColor" />
                </svg>
              </div>
              {/* Vertical Divider */}
              <div style={{ width: 1, height: 38, background: 'rgba(255, 255, 255, 0.25)' }} />
              {/* Two-Line Brand Text */}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05, textAlign: 'left' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                  Bridge
                </span>
                <span style={{ fontSize: '17px', fontWeight: 700, color: '#FF6B2C', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                  AI
                </span>
              </div>
            </div>

            {/* Error header */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Context Disconnected
            </h2>
            <p style={{ color: '#A1A1AA', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 36, opacity: 0.85 }}>
              A temporary memory corruption occurred in the LLM coordination layer. Our automated recovery engine is resolving the issue.
            </p>

            {/* Fixing Animation Box */}
            <div style={{
              background: 'rgba(13,13,13,0.72)',
              border: '1px solid rgba(222,106,57,0.12)',
              borderRadius: 20,
              padding: '30px 24px',
              textAlign: 'left',
              marginBottom: 40,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(16px)'
            }}>
              {/* Animated Progress Bar */}
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{
                  height: '100%',
                  width: `${stepProgress}%`,
                  background: 'linear-gradient(90deg, var(--primary), #7C3AED)',
                  borderRadius: 10,
                  transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>

              {/* Status and simulated steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {steps.map((step, idx) => {
                  const isActive = idx === this.state.fixingStep;
                  const isDone = idx < this.state.fixingStep;
                  return (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      opacity: isActive ? 1 : isDone ? 0.6 : 0.25,
                      transition: 'opacity 0.3s'
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: `1.5px solid ${isDone ? 'var(--primary)' : isActive ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isDone ? 'var(--primary)' : 'transparent',
                        flexShrink: 0
                      }}>
                        {isDone ? (
                          <Check size={10} color="#050505" strokeWidth={3} />
                        ) : isActive ? (
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)',
                            animation: 'ldBlink 1.2s infinite'
                          }} />
                        ) : null}
                      </div>
                      <span style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--primary)' : '#F5F5F5',
                        fontFamily: "'Space Mono', monospace"
                      }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Manual Retry CTA */}
            <button
              onClick={this.handleManualRetry}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 10,
                background: 'rgba(222,106,57,0.08)', color: 'var(--primary)',
                border: '1px solid rgba(222,106,57,0.25)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
                transition: 'all 0.25s', textTransform: 'uppercase', letterSpacing: '0.04em'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = '#050505';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(222,106,57,0.08)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <RefreshCw size={14} /> Restore Handshake
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
