import React from 'react';
import { Shield, BookOpen, AlertTriangle, Cpu, Terminal, Layers, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHelmet from '../components/SEOHelmet';

const TermsPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'transparent', 
      color: 'var(--text)', 
      padding: '120px 20px 100px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <SEOHelmet 
        title="Terms of Service"
        description="Review the terms and conditions governing the usage of BridgeAI extension, local synchronization modules, and dashboard software."
        keywords={['terms of service', 'bridgeai terms', 'user agreement', 'usage terms', 'compliance', 'disclaimer']}
      />

      <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--muted)' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
          <span>/</span>
          <span>Compliance</span>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>Terms of Service</span>
        </div>

        {/* Header Section */}
        <div style={{ marginBottom: '60px', textAlign: 'left' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', background: 'rgba(139, 92, 246, 0.05)', 
            borderRadius: '100px', border: '1px solid rgba(139, 92, 246, 0.1)',
            marginBottom: '24px'
          }}>
            <BookOpen size={14} color="var(--secondary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--secondary)' }}>
              Service Rules
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
            Terms of Service
          </h1>
          
          <p style={{ color: 'var(--muted)', fontSize: '1.15rem', lineHeight: '1.7', maxWidth: '750px', margin: 0 }}>
            By installing the BridgeAI browser extension or using our sync interfaces, you agree to these binding terms. Please read this document thoroughly to understand user responsibilities and platform limitations.
          </p>
        </div>

        {/* Third-Party Platform Disclaimer Panel */}
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.03)', 
          border: '1px solid rgba(239, 68, 68, 0.15)', 
          borderRadius: '24px', 
          padding: '32px', 
          marginBottom: '48px',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#dc2626', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Important Disclaimers
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <li>
              <strong>No Affiliation:</strong> BridgeAI is an independent workflow utility. It is NOT affiliated, authorized, endorsed by, or in any way officially connected with OpenAI, Anthropic, Google, Perplexity, DeepSeek, Mistral, or Poe, or any of their subsidiaries.
            </li>
            <li>
              <strong>Platform Compatibility Limitations:</strong> BridgeAI extracts chat logs by reading webpage markup. Changes to the layout, design, or class selectors made by third-party AI platforms may temporarily impact or degrade extraction features.
            </li>
          </ul>
        </div>

        {/* Terms Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section 1: Acceptable Use */}
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
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>1. Acceptable Use</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: '0 0 16px 0' }}>
              BridgeAI is designed to help professionals, researchers, and developers synchronize active workflows between artificial intelligence models. When using the tool, you agree to:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li>Not use the tool to automate mass queries, scraping, or spamming operations that violate third-party terms of service.</li>
              <li>Not attempt to decompile, reverse-engineer, or breach security protocols on the BridgeAI sync clusters.</li>
              <li>Ensure that the transfer of conversations does not violate corporate security guidelines or data sovereignty boundaries governing your workplace.</li>
            </ul>
          </div>

          {/* Section 2: Extension Behavior */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>2. Extension Behavior & Execution</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
              BridgeAI operates strictly under user direction. By clicking the active capture icon, copying contexts, or pasting content, you authorize the extension to run DOM scripts in the active tab to package conversation parameters. The tool behaves as a secure local buffer and does not actively relay commands to the page without an explicit user-initiated trigger.
            </p>
          </div>

          {/* Section 3: User Responsibilities */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Layers size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>3. User Responsibility</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
              You are sole master of the credentials, sync tokens, and contexts processed by your extension. You warrant that you have the right to transfer, analyze, and store any text data passed through the extension. BridgeAI is not responsible for any copyright claims or compliance failures arising from user-transferred content.
            </p>
          </div>

          {/* Section 4: Limitation of Liability */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '12px', color: '#dc2626' }}>
                <AlertTriangle size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>4. Limitation of Liability & No Warranty</h3>
            </div>
            <p style={{ color: 'var(--text)', lineHeight: '1.7', fontSize: '0.95rem', margin: '0 0 16px 0' }}>
              BridgeAI is provided "as is" and "as available," without warranty of any kind, express or implied.
            </p>
            <p style={{ color: 'var(--text)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
              To the maximum extent permitted by law, the BridgeAI protocol, developers, and operators shall not be liable for any indirect, incidental, special, or consequential damages. This includes, but is not limited to, data loss, prompt context decay, cloud API charges, rate limiting, IP blocks from third-party AI platforms, or service interruptions.
            </p>
          </div>

          {/* Section 5: Intellectual Property */}
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
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>5. Intellectual Property</h3>
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
              The software code, design configurations, branding, and assets representing BridgeAI remain the exclusive property of BridgeAI Protocol. Users retain complete, unencumbered ownership of all text contexts, logs, and prompt models buffered or transferred through our system.
            </p>
          </div>

          {/* Section 6: Contact */}
          <div className="glass-card" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="flex-responsive-wrap" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(34,197,94,0.1)', padding: '10px', borderRadius: '12px', color: '#16a34a' }}>
                <Mail size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>6. Contact & Support Desk</h3>
            </div>
            <p style={{ color: 'var(--text)', lineHeight: '1.7', fontSize: '0.95rem', margin: '0 0 20px 0' }}>
              If you have any questions regarding these terms, acceptable usage boundaries, or licensing options, please contact:
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

export default TermsPage;
