import React from 'react';
import { Shield, Eye, Lock, RefreshCw, Terminal, ExternalLink, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHelmet from '../components/SEOHelmet';

const PrivacyPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'transparent', 
      color: 'var(--text)', 
      padding: '120px 20px 100px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <SEOHelmet 
        title="Privacy Policy"
        description="Learn how BridgeAI handles your context data. Zero background tracking, local-first storage, and full user sovereignty under Manifest V3."
        keywords={['privacy policy', 'bridgeai privacy', 'chrome extension privacy', 'data protection', 'GDPR', 'local storage data']}
      />

      <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--muted)' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
          <span>/</span>
          <span>Compliance</span>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>Privacy Policy</span>
        </div>

        {/* Header Section */}
        <div style={{ marginBottom: '60px', textAlign: 'left' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', background: 'rgba(99, 102, 241, 0.05)', 
            borderRadius: '100px', border: '1px solid rgba(99, 102, 241, 0.1)',
            marginBottom: '24px'
          }}>
            <Shield size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>
              Compliance Protocol
            </span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: '900', 
            marginBottom: '20px', 
            letterSpacing: '-0.04em', 
            lineHeight: 1.1,
            color: 'var(--text)'
          }}>
            Privacy Policy
          </h1>
          
          <p style={{ color: 'var(--muted)', fontSize: '1.15rem', lineHeight: '1.7', maxWidth: '750px', margin: 0 }}>
            BridgeAI is architected with a local-first, zero-knowledge sync model. We treat your prompt context as sensitive intellectual capital. This document details how our Chrome Extension and web systems handle data.
          </p>
        </div>

        {/* Critical Disclosures Alert Panel */}
        <div style={{ 
          background: 'rgba(99, 102, 241, 0.03)', 
          border: '1px solid rgba(99, 102, 241, 0.15)', 
          borderRadius: '24px', 
          padding: '32px', 
          marginBottom: '48px',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} /> Core Privacy Commitments
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text)', fontSize: '1rem', lineHeight: '1.6' }}>
            <li>
              <strong>No Hidden Tracking:</strong> BridgeAI does not record passwords, payment information, or keystrokes.
            </li>
            <li>
              <strong>Manual Control:</strong> All extraction and sync actions are manually initiated by the user.
            </li>
            <li>
              <strong>Local-First Architecture:</strong> Data is stored locally unless explicitly synchronized by the user.
            </li>
          </ul>
        </div>

        {/* Policy Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section 1: Info Collection */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Terminal size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>1. Information Collection & Purpose</h3>
            </div>
            <p style={{ color: 'var(--text)', lineHeight: '1.7', fontSize: '0.95rem', margin: '0 0 20px 0' }}>
              We classify collected data into two distinct categories to guarantee absolute visibility over the system data lifecycle:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li>
                <strong style={{ color: 'var(--text)' }}>Service Metadata:</strong> When registering an account on our platform, we collect your email address and profile token to validate active sync sessions. We also compile aggregated telemetry regarding interaction rates (e.g., clicks on the bridge popup) to optimize interface layouts.
              </li>
              <li>
                <strong style={{ color: 'var(--text)' }}>Content Extraction Payload:</strong> When clicking the manual capture button on compatible AI sites (ChatGPT, Claude, Gemini, Perplexity, DeepSeek, Poe, and Mistral), BridgeAI reads the current conversation thread from the browser DOM in that specific tab. This is processed entirely locally.
              </li>
            </ul>
          </div>

          {/* Section 2: Local Storage */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Lock size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>2. Local Storage Usage</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
              BridgeAI utilizes the `chrome.storage.local` API inside Chrome to create a secure, isolated workspace buffer. When you execute a manual capture, the structured JSON representation of the conversation is stored in this local cache. It acts as an operational transit zone so you can paste it into another LLM. You can clear this cache at any time directly through the extension's Settings tab.
            </p>
          </div>

          {/* Section 3: Clipboard Usage */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <RefreshCw size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>3. Clipboard & Context Transfer</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
              The extension requires `clipboardWrite` permission to enable the manual **"Copy Formatted Context"** action. When triggered, the selected prompt template is written directly to the OS system clipboard. BridgeAI never reads your clipboard history or modifies contents outside of your explicit copy action.
            </p>
          </div>

          {/* Section 4: AI extraction & No background tracking */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Shield size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>4. Zero Background Tracking</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
              Unlike utility extensions that capture page contents automatically in the background, BridgeAI operates exclusively on a **user-triggered workflow**. We do not run persistent, uninitiated scripts that monitor network traffic, capture histories, or extract page contents without an active user click on the extension UI.
            </p>
          </div>

          {/* Section 5: No Selling and Syncing */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(34,197,94,0.1)', padding: '10px', borderRadius: '12px', color: '#16a34a' }}>
                <CheckCircle size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>5. No Selling & Optional Syncing</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: '0 0 20px 0' }}>
              Our commercial architecture is built entirely on premium dashboard subscription fees, not data monetization. We make three binding promises:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li>
                We will **never sell** your conversation histories, emails, or system metadata to any third party.
              </li>
              <li>
                We do not integrate advertising networks or tracking pixels into our interfaces.
              </li>
              <li>
                Synchronizing your local vaults to the cloud dashboard is completely voluntary and requires explicit opt-in inside the application panel.
              </li>
            </ul>
          </div>

          {/* Section 6: Manifest V3 Compliance */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Terminal size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>6. Manifest V3 Compliance</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
              The BridgeAI extension is fully built under Chrome's Manifest V3 security specification. It relies entirely on static, reviewable code packaged directly in the installation zip. No remotely hosted scripts are loaded, preventing hidden runtime modifications and protecting your browser environment from code injection exploits.
            </p>
          </div>

          {/* Section 7: Retention, Security & Contact */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Mail size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>7. Retention, Security & Support</h3>
            </div>
            <p style={{ color: 'var(--text)', lineHeight: '1.7', fontSize: '0.95rem', margin: '0 0 20px 0' }}>
              Your local vault stays on your device indefinitely until manually cleared. If synced to the cloud dashboard, all data is encrypted at rest using industry-standard AES-256 protocols and transit-secured via TLS 1.3 tunnels.
            </p>
            <p style={{ color: 'var(--text)', lineHeight: '1.7', fontSize: '0.95rem', margin: '0 0 20px 0' }}>
              To review, export, or permanently erase your synced data from our staging clusters, or for any compliance questions, please contact our support desk:
            </p>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '10px', 
              padding: '12px 24px', background: 'var(--gray-50)', 
              border: '1px solid var(--gray-200)', borderRadius: '12px',
              color: 'var(--primary)', fontSize: '0.95rem', fontWeight: '700'
            }}>
              <Mail size={16} /> 
              <a href="mailto:business@entrext.in" style={{ color: 'inherit', textDecoration: 'none' }}>
                business@entrext.in
              </a>
            </div>
          </div>

        </div>

        {/* Footer Navigation Back Link */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>←</span> Return to home page
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPage;
