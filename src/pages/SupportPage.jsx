import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, CheckCircle, 
  AlertTriangle, Mail, Send, Cpu, Settings, MessageSquare, 
  Terminal, ShieldAlert, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHelmet from '../components/SEOHelmet';
import { apiFetch } from '../apiConfig';

const PlatformLogo = ({ name }) => {
  const logos = {
    ChatGPT: (
      <svg width="22" height="22" viewBox="0 0 41 41" fill="none">
        <path d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835 9.964 9.964 0 00-7.505-3.360 10.079 10.079 0 00-9.612 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.504 3.36 10.079 10.079 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.814zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103l-8.051 4.648a7.504 7.504 0 01-10.24-2.743zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.012L7.044 23.86a7.504 7.504 0 01-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.114-.012l8.048 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.499v4.993l-4.330 2.5-4.332-2.5V18z" fill="#74aa9c"/>
      </svg>
    ),
    Claude: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-1.227-.072L2 12.66l.097-.791.766-.072 1.156.025 2.29.097 2.507.122 1.194.048-.048-.178L9.61 11.2 8.978 9.485 8.008 6.876l-.571-1.784-.388-1.316.534-.766h.938l.433.388.388 1.123.655 2.036.875 2.616.534 1.614.194.607.146-.097.972-2.616.729-1.93.777-1.735.534-.97.729-.389h.801l.656.583-.146.85-.534.923-.875 1.832-.826 1.98-.631 1.784.157.048 1.39-.157 2.786-.146 1.784-.024h1.026l.8.754-.146.68-.607.51-1.784.122-2.362.17-1.978.17-.986.097.048.146.729.777 1.784 2.12.996 1.297.55 1.03-.194.85-.777.388-.534-.146-.68-.63-1.49-1.784-1.784-1.954-.84-.996-.097.048-.048 1.16v1.736l-.073 1.49-.17 1.3-.413.729-.729.194-.68-.437-.17-.68.073-.948.17-1.832.048-1.783v-2.12l-.048-1.33-.146.072-1.27 3.005-.923 2.169-.826 1.59-.656.923-.85.122-.607-.437.097-.85.34-.607.777-1.42.875-2.023.972-2.41z" fill="#D97757"/>
      </svg>
    ),
    Gemini: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 24A14.232 14.232 0 019.86 12 14.232 14.232 0 0112 0a14.232 14.232 0 012.14 12A14.232 14.232 0 0112 24z" fill="url(#spga)"/>
        <path d="M24 12c-3.53.35-8.765 2.14-12 2.14C8.765 14.14 3.53 12.35 0 12c3.53-.35 8.765-2.14 12-2.14C15.235 9.86 20.47 11.65 24 12z" fill="url(#spgb)"/>
        <defs>
          <linearGradient id="spga" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#1C7DFF"/><stop offset="1" stopColor="#1C69FF"/></linearGradient>
          <linearGradient id="spgb" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#1C7DFF"/><stop offset="1" stopColor="#1C69FF"/></linearGradient>
        </defs>
      </svg>
    ),
    Perplexity: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="1" width="22" height="22" rx="6" fill="#20B2AA" opacity="0.12" stroke="#20B2AA" strokeWidth="1.2"/>
        <path d="M12 5v14M5 12h14" stroke="#20B2AA" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" fill="#20B2AA" opacity="0.35"/>
      </svg>
    ),
    DeepSeek: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="1" width="22" height="22" rx="6" fill="#4D6BFE" opacity="0.12" stroke="#4D6BFE" strokeWidth="1.2"/>
        <text x="4.5" y="16" fill="#4D6BFE" fontSize="9" fontWeight="bold" fontFamily="sans-serif">DS</text>
      </svg>
    ),
    Poe: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="1" width="22" height="22" rx="6" fill="#8B5CF6" opacity="0.12" stroke="#8B5CF6" strokeWidth="1.2"/>
        <circle cx="12" cy="12" r="5" fill="#8B5CF6" opacity="0.4"/>
        <circle cx="12" cy="12" r="2.5" fill="#8B5CF6"/>
      </svg>
    ),
    Mistral: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="1" width="22" height="22" rx="6" fill="#F97316" opacity="0.12" stroke="#F97316" strokeWidth="1.2"/>
        <path d="M6 8h12M6 12h12M6 16h8" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  };
  return logos[name] || null;
};

const PLATFORMS = [
  { name: 'ChatGPT',    status: 'Operational', color: '#74aa9c' },
  { name: 'Claude',     status: 'Operational', color: '#D97757' },
  { name: 'Gemini',     status: 'Operational', color: '#1C7DFF' },
  { name: 'Perplexity', status: 'Operational', color: '#20B2AA' },
  { name: 'DeepSeek',   status: 'Operational', color: '#4D6BFE' },
  { name: 'Poe',        status: 'Operational', color: '#8B5CF6' },
  { name: 'Mistral',    status: 'Operational', color: '#F97316' },
];

const FAQS = [
  {
    q: 'How does BridgeAI work?',
    a: 'BridgeAI is a browser extension that reads your active AI chat logs when you click "Capture". It organizes the questions you asked and the answers you got, and saves them. You can then copy or send that context into any other AI chat window with a single click, without having to re-type or re-explain your ideas.'
  },
  {
    q: 'Is my data stored locally?',
    a: 'Yes, absolutely. By default, all of your saved chat history is stored securely inside your own web browser. No data is sent to our servers unless you sign in and explicitly choose to back up or sync your chats across your devices.'
  },
  {
    q: 'What platforms are supported?',
    a: 'Currently, BridgeAI supports all major AI chat platforms: ChatGPT, Claude, Gemini, Perplexity, DeepSeek, Poe, and Mistral. It also has a universal reader that works on other websites to capture article text.'
  },
  {
    q: 'Why are permissions required?',
    a: 'The extension needs a few permissions to function: browser storage to save your chats, page access to read your current chat session when you click capture, clipboard access to let you copy text easily, and dashboard access to sync your account details.'
  },
  {
    q: 'Why is extraction failing?',
    a: 'This usually happens when an AI platform (like ChatGPT or Claude) updates its website layout. If capture stops working, make sure your BridgeAI extension is updated to the latest version, refresh the AI website tab, and try again. If it still fails, please send us a report below so we can fix it!'
  }
];

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [bugForm, setBugForm] = useState({ title: '', platform: 'ChatGPT', description: '', email: '' });
  const [featureForm, setFeatureForm] = useState({ title: '', details: '', impact: 'medium', email: '' });
  const [submittedBug, setSubmittedBug] = useState(false);
  const [submittedFeature, setSubmittedFeature] = useState(false);
  const [loadingBug, setLoadingBug] = useState(false);
  const [loadingFeature, setLoadingFeature] = useState(false);

  const userStr = localStorage.getItem('bridge_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || '';

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleBugSubmit = async (e) => {
    e.preventDefault();
    const finalEmail = userEmail || bugForm.email || 'guest';
    const type = 'bug';
    const description = `Platform: ${bugForm.platform}\n\nDescription: ${bugForm.description}`;
    
    try {
      setLoadingBug(true);
      const res = await apiFetch('/api/feedbacks', {
        method: 'POST',
        body: JSON.stringify({
          email: finalEmail,
          type,
          title: bugForm.title,
          description
        })
      });
      if (res.ok) {
        setSubmittedBug(true);
        setBugForm({ title: '', platform: 'ChatGPT', description: '', email: '' });
        setTimeout(() => setSubmittedBug(false), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit bug report');
      }
    } catch (err) {
      alert(err.message || 'Error submitting bug report');
    } finally {
      setLoadingBug(false);
    }
  };

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    const finalEmail = userEmail || featureForm.email || 'guest';
    const type = 'feature_request';
    const description = `Impact: ${featureForm.impact}\n\nDetails: ${featureForm.details}`;
    
    try {
      setLoadingFeature(true);
      const res = await apiFetch('/api/feedbacks', {
        method: 'POST',
        body: JSON.stringify({
          email: finalEmail,
          type,
          title: featureForm.title,
          description
        })
      });
      if (res.ok) {
        setSubmittedFeature(true);
        setFeatureForm({ title: '', details: '', impact: 'medium', email: '' });
        setTimeout(() => setSubmittedFeature(false), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit feature request');
      }
    } catch (err) {
      alert(err.message || 'Error submitting feature request');
    } finally {
      setLoadingFeature(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'transparent', 
      color: 'var(--text)', 
      padding: '120px 20px 100px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <SEOHelmet 
        title="Support & FAQ Center"
        description="Access technical troubleshooting checklists, setup manuals, FAQs, and file bugs or feature requests directly to the BridgeAI team."
        keywords={['bridgeai support', 'troubleshooting', 'FAQ', 'report bug', 'feature request', 'setup instructions']}
      />

      <div className="container" style={{ maxWidth: '1100px', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', background: 'rgba(99, 102, 241, 0.05)', 
            borderRadius: '100px', border: '1px solid rgba(99, 102, 241, 0.1)',
            marginBottom: '24px'
          }}>
            <HelpCircle size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>
              Help &amp; Support
            </span>
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', 
            fontWeight: '900', 
            marginBottom: '24px', 
            letterSpacing: '-0.04em', 
            lineHeight: 1.05,
            color: 'var(--text)'
          }}>
            Support &amp; <span style={{ color: 'var(--primary)' }}>Troubleshooting</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.2rem', lineHeight: '1.7', maxWidth: '700px', margin: '0 auto' }}>
            Got questions? We're here to help. Check platform status, find answers, or send us a message.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid-sidebar-layout" style={{ gap: '40px', alignItems: 'start' }}>
          
          {/* Left Column: FAQs & Interactive Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* FAQ Card */}
            <div className="glass-card" style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border)', 
              borderRadius: '24px', 
              padding: '36px',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HelpCircle color="var(--primary)" size={22} /> Frequently Asked Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {FAQS.map((faq, idx) => (
                  <div key={idx} style={{ 
                    borderBottom: idx === FAQS.length - 1 ? 'none' : '1px solid var(--border)',
                    paddingBottom: idx === FAQS.length - 1 ? '0' : '16px'
                  }}>
                    <button 
                      onClick={() => toggleFaq(idx)}
                      style={{ 
                        width: '100%', background: 'transparent', border: 'none', 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        color: openFaq === idx ? 'var(--primary)' : 'var(--text)', cursor: 'pointer',
                        padding: '12px 0', fontSize: '1.05rem', fontWeight: '700', 
                        textAlign: 'left', transition: 'color 0.2s'
                      }}
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openFaq === idx && (
                      <p style={{ 
                        margin: '8px 0 12px', color: 'var(--muted)', fontSize: '0.95rem', 
                        lineHeight: '1.6', paddingRight: '20px' 
                      }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Status */}
            <div className="glass-card" style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border)', 
              borderRadius: '24px', 
              padding: '36px',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu color="var(--secondary)" size={22} /> AI Platform Status
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
                Check if our integrations with your favorite AI chat tools are working normally:
              </p>
              <div className="grid-auto-fit-small" style={{ gap: '16px' }}>
                {PLATFORMS.map((plat, i) => (
                  <div key={i} style={{ 
                    padding: '18px 16px', background: 'var(--bg-main)', 
                    border: '1px solid var(--border)', borderRadius: '14px',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                  }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${plat.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlatformLogo name={plat.name} />
                    </div>
                    <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: '800', color: 'var(--text)' }}>{plat.name}</span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: plat.color }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: plat.color, boxShadow: `0 0 8px ${plat.color}60` }} />
                      {plat.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Section Tabs (Forms) */}
            <div className="grid-responsive-2" style={{ gap: '24px' }}>
              
              {/* Bug Form */}
              <div className="glass-card" style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border)', 
                borderRadius: '24px', 
                padding: '32px',
                boxShadow: 'var(--shadow)'
              }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} color="#dc2626" /> Report a Bug
                </h4>
                {submittedBug ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#16a34a' }}>
                    <CheckCircle size={32} style={{ marginBottom: '12px' }} />
                    <p style={{ margin: 0, fontWeight: '700' }}>Thank you! Your bug report has been sent.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBugSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!userEmail && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Your Email</label>
                        <input 
                          type="email" 
                          required
                          value={bugForm.email}
                          onChange={e => setBugForm({ ...bugForm, email: e.target.value })}
                          placeholder="you@example.com"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text)', outline: 'none' }}
                        />
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Brief Summary</label>
                      <input 
                        type="text" 
                        required
                        value={bugForm.title}
                        onChange={e => setBugForm({ ...bugForm, title: e.target.value })}
                        placeholder="e.g. Claude context won't load"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text)', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Target Platform</label>
                      <select 
                        value={bugForm.platform}
                        onChange={e => setBugForm({ ...bugForm, platform: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text)', outline: 'none' }}
                      >
                        <option value="ChatGPT" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>ChatGPT</option>
                        <option value="Claude" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Claude</option>
                        <option value="Gemini" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Gemini</option>
                        <option value="Perplexity" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Perplexity</option>
                        <option value="DeepSeek" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>DeepSeek</option>
                        <option value="Poe" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Poe</option>
                        <option value="Mistral" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Mistral</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>What happened?</label>
                      <textarea 
                        required
                        rows="3"
                        value={bugForm.description}
                        onChange={e => setBugForm({ ...bugForm, description: e.target.value })}
                        placeholder="Describe the issue and steps to reproduce it..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text)', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" disabled={loadingBug} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '8px', borderRadius: '10px', opacity: loadingBug ? 0.7 : 1 }}>
                      <Send size={16} /> {loadingBug ? 'Sending...' : 'Send Bug Report'}
                    </button>
                  </form>
                )}
              </div>

              {/* Feature Form */}
              <div className="glass-card" style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border)', 
                borderRadius: '24px', 
                padding: '32px',
                boxShadow: 'var(--shadow)'
              }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} color="var(--primary)" /> Feature Request
                </h4>
                {submittedFeature ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#16a34a' }}>
                    <CheckCircle size={32} style={{ marginBottom: '12px' }} />
                    <p style={{ margin: 0, fontWeight: '700' }}>Thank you! Your suggestion has been saved.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFeatureSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!userEmail && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Your Email</label>
                        <input 
                          type="email" 
                          required
                          value={featureForm.email}
                          onChange={e => setFeatureForm({ ...featureForm, email: e.target.value })}
                          placeholder="you@example.com"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text)', outline: 'none' }}
                        />
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>What is the feature?</label>
                      <input 
                        type="text" 
                        required
                        value={featureForm.title}
                        onChange={e => setFeatureForm({ ...featureForm, title: e.target.value })}
                        placeholder="e.g. Export chats as markdown files"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text)', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Workflow Impact</label>
                      <select 
                        value={featureForm.impact}
                        onChange={e => setFeatureForm({ ...featureForm, impact: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text)', outline: 'none' }}
                      >
                        <option value="low" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Nice to Have (Low Impact)</option>
                        <option value="medium" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Workflow Booster (Medium Impact)</option>
                        <option value="high" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Critical Pipeline (High Impact)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Why would this be useful?</label>
                      <textarea 
                        required
                        rows="3"
                        value={featureForm.details}
                        onChange={e => setFeatureForm({ ...featureForm, details: e.target.value })}
                        placeholder="Describe how this feature would help you save time or improve your workflow..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text)', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" disabled={loadingFeature} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '8px', borderRadius: '10px', opacity: loadingFeature ? 0.7 : 1 }}>
                      <Send size={16} /> {loadingFeature ? 'Saving...' : 'Send Feature Request'}
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Setup & Troubleshooting Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Direct Contact */}
            <div className="glass-card" style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border)', 
              borderRadius: '24px', 
              padding: '36px',
              boxShadow: 'var(--shadow)',
              textAlign: 'center'
            }}>
              <div style={{ background: 'var(--primary-soft)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 20px' }}>
                <Mail size={28} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', marginBottom: '12px' }}>Direct Support Email</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
                For enterprise licenses, custom API requests, or billing queries, reach out directly:
              </p>
              <a 
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=business@entrext.in&su=BridgeAI%20Support%20Request&body=Hi%20BridgeAI%20Team%2C%0A%0AI%20need%20help%20with%20the%20following%3A%0A%0A%5BDescribe%20your%20issue%20or%20request%20here%5D%0A%0AMy%20Account%3A%20%5BYour%20registered%20email%5D%0APlan%3A%20%5BFree%20%2F%20Pro%5D%0A%0AThank%20you%2C`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', 
                  color: 'var(--primary)', fontWeight: '800', textDecoration: 'none', fontSize: '1.05rem' 
                }}
              >
                business@entrext.in
              </a>
            </div>

            {/* Setup Guide */}
            <div className="glass-card" style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border)', 
              borderRadius: '24px', 
              padding: '36px',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings color="var(--primary)" size={20} /> How to Install the Extension
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { t: 'Unzip the File', d: 'Unzip your downloaded bridgeai-extension.zip file into a folder on your computer.' },
                  { t: 'Open Browser Extensions', d: 'Type chrome://extensions in your Chrome address bar and turn on "Developer mode" in the top-right corner.' },
                  { t: 'Load Extension Folder', d: 'Click the "Load unpacked" button in the top-left corner and choose the unzipped extension folder.' },
                  { t: 'Pin to Toolbar', d: 'Click the extension puzzle piece icon in your browser toolbar, find BridgeAI, and pin it for quick access.' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '50%', 
                      background: 'var(--primary-soft)', color: 'var(--primary)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: '800', flexShrink: 0
                    }}>{i + 1}</div>
                    <div>
                      <h5 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: '800', color: 'var(--text)' }}>{step.t}</h5>
                      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting Checklist */}
            <div className="glass-card" style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border)', 
              borderRadius: '24px', 
              padding: '36px',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal color="var(--secondary)" size={20} /> Troubleshooting Checklist
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Reload target AI page tabs after updating the extension.',
                  'Clear extension storage buffer via Settings if loading hangs.',
                  'Ensure Developer Mode remains toggled ON in chrome://extensions.',
                  'Confirm you are logged into the dashboard to sync vaults.',
                  'Verify permissions are enabled in extension details.'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}><Zap size={14} /></div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Home Back Link */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>←</span> Return to home page
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SupportPage;
