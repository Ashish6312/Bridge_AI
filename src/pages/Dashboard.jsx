import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Plus, Search, MessageSquare, Clock, Code, Target, Layers,
  CheckCircle2, ExternalLink, Zap, Download, GitMerge, BookOpen, Eye, EyeOff, Mail, Wand2, Cpu, Globe, Database, Folder, ArrowRight, RefreshCw
} from 'lucide-react';
import { API_BASE } from '../apiConfig';

const isRecent = (dateString) => {
  if (!dateString) return false;
  const diffTime = Date.now() - new Date(dateString).getTime();
  return diffTime < (24 * 60 * 60 * 1000); 
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateString));
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
    }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ 
          background: 'rgba(15, 23, 42, 0.95)', padding: '32px', borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.08)', width: '90%', maxWidth: '440px',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '12px' }}>{title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '32px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '16px' }}>Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn-primary" style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#f43f5e' }}>Confirm Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

const PromptModal = ({ isOpen, onClose, onSubmit, title, label, placeholder }) => {
  const [value, setValue] = useState('');
  if (!isOpen) return null;
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
    }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ 
          background: 'rgba(15, 23, 42, 0.95)', padding: '32px', borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.08)', width: '90%', maxWidth: '440px',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '12px' }}>{title}</h2>
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1px', marginBottom: '10px' }}>{label.toUpperCase()}</label>
          <input 
            autoFocus
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') { onSubmit(value); onClose(); } }}
            placeholder={placeholder}
            className="input-premium"
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '16px' }}>Cancel</button>
          <button onClick={() => { onSubmit(value); onClose(); }} className="btn-primary" style={{ flex: 1, padding: '14px', borderRadius: '16px' }}>Initialize</button>
        </div>
      </motion.div>
    </div>
  );
};

const ForgeModal = ({ isOpen, onClose, context, onDispatch }) => {
  const [url, setUrl] = useState('https://');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleValidateAndDispatch = () => {
    if (!url || url === 'https://' || url.trim().length < 12) {
      setError('❌ Authoritative URL required for Hub dispatch.');
      return;
    }
    setError('');
    onDispatch(url, context);
    onClose();
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        style={{ 
          background: 'rgba(30, 41, 59, 0.7)', padding: '32px', borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)', width: '90%', maxWidth: '500px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe className="text-primary" /> Forge Universal Bridge
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>
          Bridge your intelligence to any destination. Enter the URL of your target AI platform.
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>TARGET AI HUD URL</label>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            style={{ 
              width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: error ? '1px solid #fb7185' : '1px solid var(--glass-border)',
              borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none'
            }}
            placeholder="https://poe.com"
          />
          {error && <div style={{ color: '#fb7185', fontSize: '0.75rem', marginTop: '8px', fontWeight: 'bold' }}>{error}</div>}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose}
            className="btn-secondary" style={{ flex: 1, padding: '12px' }}
          >Cancel</button>
          <button 
            onClick={handleValidateAndDispatch}
            className="btn-primary" style={{ flex: 2, padding: '12px' }}
          >Forge Bridge & Dispatch</button>
        </div>
      </motion.div>
    </div>
  );
};

const BridgeCard = ({ ctx, onDelete, onForge, loadData }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [mailSending, setMailSending] = useState(null);
  const [showUniversalModal, setShowUniversalModal] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch(`${API_BASE}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: ctx.summary })
      });
      const data = await response.json();
      console.log('Hub Optimization Response:', data);
      if (data.success) {
        setOptimizedPrompt(data.optimized);
      } else {
        triggerToast('Optimization engine idle. Check Hub logs.');
      }
    } catch (err) {
      console.error('Optimization Failed:', err);
      triggerToast('Hub Intelligence unreachable.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text, msg) => {
    navigator.clipboard.writeText(text);
    if (ctx.onCopy) ctx.onCopy(msg);
  };

  const handleSendToMail = async (bridgeId) => {
    setMailSending(bridgeId);
    try {
      const user = JSON.parse(localStorage.getItem('bridge_user') || '{}');
      const response = await fetch(`${API_BASE}/api/dispatch/mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bridgeId, email: user.email })
      });
      const data = await response.json();
      if (data.success) {
        triggerToast(`Intelligence Dispatched via ${data.protocol} protocol.`);
      }
    } catch (err) {
      triggerToast('Dispatch relay failure.');
    } finally {
      setMailSending(null);
    }
  };

  const handleSmartRename = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch(`${API_BASE}/api/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: ctx.summary })
      });
      const data = await response.json();
      if (data.success) {
        const res = await fetch(`${API_BASE}/api/bridge/${ctx.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: data.title })
        });
        if (res.ok) {
          triggerToast('Vault item renamed.');
          loadData();
        }
      }
    } catch (err) {
      console.error('Rename Failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '1px' }}>{ctx.source.toUpperCase()} BRIDGE</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {formatTime(ctx.created_at)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>{ctx.title}</h3>
            <button onClick={handleSmartRename} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px', opacity: 0.6 }} title="Smart Rename">
              <Wand2 size={14} />
            </button>
            <button 
              onClick={() => handleSendToMail(ctx.id)}
              disabled={mailSending === ctx.id}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px', opacity: 0.6 }}
              title="Dispatch to Mail"
            >
              {mailSending === ctx.id ? '...' : <Mail size={14} />}
            </button>
          </div>
        </div>
        <button onClick={() => onDelete(ctx.id)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', opacity: 0.6, fontSize: '0.85rem', fontWeight: '700' }}>Delete</button>
      </div>

      <div style={{ 
        background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', 
        fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', 
        marginBottom: '20px', border: '1px solid rgba(255,255,255,0.03)'
      }}>
        <div style={{ fontWeight: '600', color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="var(--primary)" /> Smart Summary
          </div>
          {ctx.summary && ctx.summary.length > 200 && (
            <button 
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
            >
              {isSummaryExpanded ? 'Show Short' : 'Show Full'}
            </button>
          )}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {ctx.summary && ctx.summary.length > 200 && !isSummaryExpanded 
            ? `${ctx.summary.substring(0, 200)}...` 
            : ctx.summary}
        </div>
      </div>

      {optimizedPrompt && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: '24px' }}>
          <div style={{ 
            background: 'rgba(139, 92, 246, 0.05)', padding: '20px', borderRadius: '16px', 
            border: '1px solid rgba(139, 92, 246, 0.3)', position: 'relative',
            boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>
                <Wand2 size={14} style={{ marginRight: '6px' }} /> OPTIMIZED INTELLIGENCE CORE
              </span>
              <button 
                onClick={() => copyToClipboard(optimizedPrompt, 'Optimized prompt copied!')}
                style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >Copy Core</button>
            </div>
            <pre style={{ 
              fontSize: '0.9rem', color: '#e2e8f0', margin: 0, whiteSpace: 'pre-wrap', 
              fontFamily: '"Inter", sans-serif', lineHeight: '1.6', letterSpacing: '0.3px'
            }}>{optimizedPrompt}</pre>
          </div>
        </motion.div>
      )}

      {showRaw && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '24px' }}>
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '16px', 
            border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#64748b', letterSpacing: '2px' }}>PROPRIETARY RAW CHAT LOG</span>
              <button 
                onClick={() => copyToClipboard(ctx.chat_log, 'Full chat log copied!')}
                style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
              >Copy Log</button>
            </div>
            <pre style={{ 
              fontSize: '0.85rem', color: '#94a3b8', margin: 0, 
              whiteSpace: 'pre-wrap', fontFamily: '"Fira Code", monospace', maxHeight: '300px', overflowY: 'auto' 
            }}>{ctx.chat_log}</pre>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="btn-secondary" 
            style={{ fontSize: '0.875rem', padding: '8px 16px' }}
          >
            {isOptimizing ? '🪄 Optimizing...' : '🪄 Optimize Prompt'}
          </button>
            <button
              onClick={() => {
                if (stats.plan === 'infinite') {
                  setShowExport(v => !v);
                } else {
                  triggerToast('Upgrade to Infinite Hub to unlock Vault Export protocol.');
                }
              }}
              className="btn-secondary"
              style={{ fontSize: '0.875rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', opacity: stats.plan === 'infinite' ? 1 : 0.5 }}
            >
              <Download size={14} /> Export
            </button>
            {showExport && stats.plan === 'infinite' && (
              <div style={{
                position: 'absolute', bottom: '110%', left: 0,
                background: '#1e293b', border: '1px solid var(--glass-border)',
                borderRadius: '10px', padding: '6px', zIndex: 50, minWidth: '160px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}>
                {[
                  { fmt: 'markdown', label: '📄 Markdown (.md)' },
                  { fmt: 'json',     label: '🗂 JSON (.json)' },
                  { fmt: 'prompt',   label: '⚡ Prompt Pack (.txt)' },
                ].map(({ fmt, label }) => (
                  <button key={fmt} onClick={() => { exportBridge(ctx, fmt); setShowExport(false); }}
                    style={{ display: 'block', width: '100%', background: 'transparent', border: 'none',
                      color: 'var(--text-muted)', padding: '8px 12px', textAlign: 'left', cursor: 'pointer',
                      borderRadius: '6px', fontSize: '0.85rem' }}
                    onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.target.style.background='transparent'}
                  >{label}</button>
                ))}
              </div>
            )}
          <button 
            onClick={() => setShowRaw(!showRaw)}
            className="btn-secondary" 
            style={{ fontSize: '0.875rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {showRaw ? <EyeOff size={14} /> : <Eye size={14} />} 
            {showRaw ? 'Hide Log' : 'View Log'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
          {[
            { name: 'Gemini',    url: 'https://gemini.google.com/app',  color: '#4285F4', icon: <Zap size={14} /> },
            { name: 'Claude',    url: 'https://claude.ai/chats',        color: '#D97757', icon: <Cpu size={14} /> },
            { name: 'ChatGPT',   url: 'https://chatgpt.com',           color: '#10A37F', icon: <Code size={14} /> },
            { name: 'Perplexity', url: 'https://perplexity.ai',        color: '#20B2AA', icon: <Search size={14} /> },
          ].map(plat => (
            <button 
              key={plat.name}
              onClick={() => {
                const finalContext = ctx.chat_log;
                window.dispatchEvent(new CustomEvent('BRIDGE_SEND_TO_STORAGE', { detail: { context: finalContext } }));
                copyToClipboard(finalContext, 'Full Intelligence Log ready!');
                window.open(plat.url, '_blank');
              }}
              className="btn-primary" 
              style={{ 
                padding: '10px', fontSize: '0.75rem', fontWeight: 'bold',
                background: plat.color, border: 'none', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'transform 0.2s, filter 0.2s',
                boxShadow: `0 4px 12px ${plat.color}33`
              }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.filter = 'none'; }}
            >
              {plat.icon} {plat.name}
            </button>
          ))}
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => onForge(ctx, optimizedPrompt || ctx.summary)}
              className="btn-secondary" 
              style={{ 
                flex: 1, padding: '10px', fontSize: '0.75rem', fontWeight: 'bold',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                border: '1px dashed var(--glass-border)'
              }}
            >
              <Globe size={14} /> Forge Universal Bridge
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Reusable Export Helper ─────────────────────────────────────── */
const exportBridge = (ctx, format) => {
  let content, filename, type;
  if (format === 'markdown') {
    content = `# ${ctx.title}\n**Source:** ${ctx.source}  \n**Date:** ${ctx.created_at}\n\n## Summary\n${ctx.summary}\n\n## Full Log\n${ctx.chatLog || ''}`;
    filename = `${ctx.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    type = 'text/markdown';
  } else if (format === 'json') {
    content = JSON.stringify({ title: ctx.title, source: ctx.source, summary: ctx.summary, chatLog: ctx.chatLog, created_at: ctx.created_at }, null, 2);
    filename = `${ctx.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    type = 'application/json';
  } else {
    content = `Act as an expert assistant. Continue working based on the following context:\n\n${ctx.summary}\n\nPlease confirm you understand and ask for the next task.`;
    filename = `${ctx.title.replace(/\s+/g, '-').toLowerCase()}-prompt.txt`;
    type = 'text/plain';
  }
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

/* ─── Manual Bridge Submit Button ────────────────────────────────── */
const ManualBridgeSubmit = ({ projects, triggerToast, setActiveTab, setBridges }) => {
  const [loading, setLoading] = useState(false);

  const PROMPTS = {
    quick:     'Give a brief TL;DR summary (3-5 bullet points) of the following text:\n\n',
    developer: 'Summarize the following as Developer Context:\n1. Goal / Feature\n2. Tech Stack\n3. Current Bugs / Issues\n4. Next Steps\n\nText:\n',
    research:  'Summarize the following into Research Notes:\n1. Core Concepts\n2. Key Insights\n3. Open Questions\n4. Sources / References mentioned\n\nText:\n',
    study:     'Summarize the following into Study Notes:\n1. Topic\n2. Key Concepts\n3. Important Points\n4. Questions to Review\n\nText:\n',
    project:   'Summarize the following into a Project Overview:\n1. Project Status\n2. Completed Tasks\n3. Current Blockers\n4. Immediate Next Steps\n\nText:\n',
  };

  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const handleSmartGenerateTitle = async () => {
    const context = document.getElementById('manual-text')?.value;
    if (!context || context.length < 20) return;
    setIsGeneratingTitle(true);
    try {
      const response = await fetch('http://localhost:5001/api/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: context.substring(0, 500) })
      });
      const data = await response.json();
      if (data.success) {
        const titleInput = document.getElementById('manual-title');
        if (titleInput) titleInput.value = data.title;
      }
    } catch (err) {
      console.error('Title generation failed:', err);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleSubmit = async () => {
    const title = document.getElementById('manual-title')?.value || 'Manual Bridge';
    const text  = document.getElementById('manual-text')?.value;
    const projectId = document.getElementById('manual-project')?.value;
    const modeEl = document.querySelector('input[name="manual-mode"]:checked');
    const mode = modeEl ? modeEl.value : 'quick';

    if (!text) return triggerToast('Please paste some context first!');
    setLoading(true);

    try {
      const prompt = PROMPTS[mode] + text.substring(0, 6000);
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an expert AI context summarizer. Be concise, structured, and accurate. Output only the summary.' },
            { role: 'user', content: prompt }
          ],
          model: 'openai',
          seed: Math.floor(Math.random() * 1000000)
        })
      });

      const raw = await response.text();
      let filtered = raw;
      // Filter out Pollinations technical notices
      if (filtered.includes('IMPORTANT NOTICE')) {
        const parts = filtered.split('work normally.');
        if (parts.length > 1) filtered = parts[1].trim();
      }

      let summary = filtered;
      try {
        const json = JSON.parse(filtered);
        if (json.choices && json.choices[0]?.message?.content) {
          summary = json.choices[0].message.content;
        } else if (json.content) {
          summary = json.content;
        }
      } catch (e) {
        // use raw
      }

      const userStr = localStorage.getItem('bridge_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const email = user?.email || 'guest';

      const res = await fetch('http://localhost:5001/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', text }], 
          platform: 'Manual', 
          title,
          email 
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerToast('✅ Intelligence extracted & saved to Hub!');
        setActiveTab('saved');
        loadData();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      triggerToast('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="btn-primary"
      style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      {loading ? '🪄 Extracting…' : <><Zap size={16} /> Extract Intelligence</>}
    </button>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '';
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'saved';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSuccess, setShowSuccess] = useState(searchParams.get('status') === 'success');
  const [searchTerm, setSearchTerm] = useState('');
  const [bridges, setBridges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ totalBridges: 0, totalTokens: 0, plan: 'free', usageCount: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [promptModal, setPromptModal] = useState({ isOpen: false });

  useEffect(() => {
    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / height) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [hubStatus, setHubStatus] = useState('connecting'); // 'online' | 'offline'
  const retryCountRef = React.useRef(0);
  const retryTimerRef = React.useRef(null);

  const [forgeState, setForgeState] = useState({ isOpen: false, context: null });

  // ─── AUTH GUARD ───────────────────────────────────────────
  useEffect(() => {
    if (searchParams.get('upgrade_success')) {
      triggerToast('Sovereign Elevation: Your account has been promoted successfully!');
      setSearchParams({});
    }
  }, [searchParams]);

  useEffect(() => {
    const user = localStorage.getItem('bridge_user');
    if (!user) {
      navigate('/login');
      return;
    }

    // STANDALONE EXTENSION SYNC: 
    // Push identity to the extension if it's installed (Apollo-style auto-linking)
    const syncWithExtension = () => {
       const EXTENSION_ID = 'alhgpfoeiimagjlnfekdhkjlkiomcapa'; // Placeholder or target ID from manifest
       if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
          try {
             chrome.runtime.sendMessage(EXTENSION_ID, { 
                action: 'STORE_AUTH', 
                token: 'SESSION_ACTIVE', 
                user: JSON.parse(user) 
             }, (response) => {
                if (response?.success) console.log('Sovereign Relay: Standalone Analyst Linked.');
             });
          } catch (e) {
             // Extension not installed or ID mismatch - skip silently
          }
       }
    };
    
    // Attempt sync immediately and on visibility (covers tab switching)
    syncWithExtension();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithExtension();
        loadData(); // Real-time update when switching back to dashboard
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [navigate]);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleForge = (ctx, bestContext) => {
    setForgeState({ isOpen: true, context: ctx, bestContext: bestContext || ctx.summary });
  };

  const handleDispatch = (url, contextString) => {
    window.dispatchEvent(new CustomEvent('BRIDGE_SEND_TO_STORAGE', { detail: { context: contextString } }));
    triggerToast(`Intelligence forged for ${url.split('/')[2] || 'Custom Hub'}`);
    window.open(url, '_blank');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('bridge_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const email = user?.email || '';

      const res = await fetch(`${API_BASE}/api/bridges?email=${email}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      
      if (data.success) {
        setHubStatus('online');
        const localBridges = data.data;
        setBridges(localBridges);
        
        const uniqueProjects = [...new Set(localBridges.map(b => b.project_id).filter(Boolean))];
        setProjects(uniqueProjects.map(id => ({ id, name: id })));
        
        const rawTokens = localBridges.reduce((acc, b) => {
          const match = b.tokens?.match(/\d+/);
          return acc + (match ? parseInt(match[0]) : 0);
        }, 0);
        
        setStats({ 
          totalBridges: localBridges.length, 
          totalTokens: rawTokens * 2.5 
        });
      } else {
        setHubStatus('offline');
      }
      const statusRes = await fetch(`${API_BASE}/api/user/status?email=${email}`);
      const statusData = await statusRes.json();
      if (statusData.success) {
        setStats(prev => ({ 
          ...prev, 
          plan: statusData.plan, 
          usageCount: statusData.usage 
        }));
      }

    } catch (err) {
      console.error('Core Hub Fetch Failed:', err);
      setHubStatus('offline');
      setBridges([]);
      // Auto-retry up to 5 times every 1.5s
      if (retryCountRef.current < 5) {
        retryCountRef.current += 1;
        retryTimerRef.current = setTimeout(() => loadData(), 1500);
      }
    }
    setLoading(false);
  };

  const refreshVault = () => {
    loadData();
    triggerToast(`Vault Synced & Refreshed.`);
  };

  useEffect(() => {
    // Watch for both native storage events (from other tabs) and custom events
    const handleStorage = (e) => {
      if (e.key === 'bridge_user') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('bridge-vault-update', loadData);
    
    // Safety check on mount
    loadData();

    // ─── Real-Time Pulse ──────────────────────────────────
    // Keep the Hub synchronized with the backend every 15s
    const pulseInterval = setInterval(() => {
      loadData();
    }, 15000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('bridge-vault-update', loadData);
      clearInterval(pulseInterval);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const handleCreateProject = (name) => {
    if (!name) return;
    const newProject = { id: 'proj_' + Date.now(), name, created_at: new Date().toISOString() };
    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem('bridge_projects', JSON.stringify(updated));
    triggerToast(`Vault "${name}" successfully initialized.`);
  };

  const filteredBridges = bridges.filter(b => {
    const title   = (b.title   || '').toLowerCase();
    const summary = (b.summary || '').toLowerCase();
    const source  = (b.source  || '').toLowerCase();
    const term    = searchTerm.toLowerCase();
    const matchesSearch  = !term || title.includes(term) || summary.includes(term) || source.includes(term);
    const matchesProject = activeProject ? b.projectId === activeProject : true;
    return matchesSearch && matchesProject;
  });

  // Show ALL bridges in "All Vaults" tab; only split for History tab
  const recentBridges  = filteredBridges.filter(b =>  isRecent(b.created_at));
  const olderBridges   = filteredBridges.filter(b => !isRecent(b.created_at));
  const historyBridges = olderBridges;

  const handleDelete = async () => {
    const id = confirmModal.id;
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/bridge/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Bridge successfully expunged from Vault.');
        loadData();
      }
    } catch (err) {
      triggerToast('Protocol failure: Could not delete bridge.');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0', background: 'transparent' }}>
      <div className="dashboard-layout" style={{ display: 'flex', gap: '32px' }}>
        
        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="dashboard-sidebar" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '90px', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}
        >
          {activeTab === 'saved' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '2px', height: '100%', background: 'rgba(255,255,255,0.05)', zIndex: 10 }}>
              <motion.div style={{ width: '100%', height: `${scrollProgress}%`, background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
            </div>
          )}
          <div className="glass-card" style={{ padding: '0', marginBottom: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', position: 'relative' }}>
            <div style={{ padding: '24px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1.5px', color: 'var(--text-muted)' }}>
                  SOVEREIGN HUB
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: hubStatus === 'online' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)', padding: '4px 10px', borderRadius: '100px', border: hubStatus === 'online' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)' }}>
                  <div style={{ 
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: hubStatus === 'online' ? '#22c55e' : '#f43f5e',
                    boxShadow: hubStatus === 'online' ? '0 0 10px #22c55e' : '0 0 10px #f43f5e',
                    animation: 'pulse 2s infinite'
                  }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: '800', color: hubStatus === 'online' ? '#22c55e' : '#f43f5e', letterSpacing: '0.5px' }}>
                    {hubStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--gradient-1)', padding: '2px' }}>
                  <div style={{ width: '100%', height: '100%', background: '#020617', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900' }}>
                    {JSON.parse(localStorage.getItem('bridge_user') || '{}').name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {JSON.parse(localStorage.getItem('bridge_user') || '{}').email || 'Connecting...'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>ACTIVE IDENTITY</div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                  <Zap size={14} /> <strong style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>TELEMETRY</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white' }}>{stats.totalBridges || 0}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>BRIDGES</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white' }}>{(stats.totalTokens || 0).toLocaleString()}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOKENS</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800' }}>SOVEREIGN QUOTA</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ 
                      fontSize: '0.65rem', padding: '4px 10px', borderRadius: '6px', 
                      background: stats.plan === 'infinite' ? 'var(--gradient-1)' : 'rgba(255,255,255,0.05)',
                      color: 'white', fontWeight: '900', border: '1px solid rgba(255,255,255,0.1)'
                    }}>{(stats.plan || 'FREE').toUpperCase()}</span>
                    <div style={{ fontSize: '0.55rem', color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
                       <CheckCircle2 size={10} /> DB SYNCED
                    </div>
                  </div>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', margin: '12px 0' }}>
                   <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${Math.min(100, (stats.usageCount / (stats.plan === 'pro' ? 100 : 3)) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ height: '100%', background: 'var(--gradient-1)', borderRadius: '100px', boxShadow: '0 0 10px var(--primary)' }} 
                   />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600' }}>
                  <span style={{ color: 'white' }}>{stats.usageCount || 0} extracted</span>
                  <span style={{ color: 'var(--text-muted)' }}>{stats.plan === 'infinite' ? 'Unlimited' : (stats.plan === 'pro' ? '100 limit' : '3 limit')}</span>
                </div>
                {(stats.plan !== 'infinite') && (
                  <Link to="/services" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', color: 'var(--primary)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '800', background: 'rgba(139, 92, 246, 0.1)', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}>
                    Upgrade Capacity <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button 
              onClick={() => setActiveTab('manual')}
              className="btn-primary" 
              style={{ width: '100%', marginBottom: '12px', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', fontWeight: '800' }}
            >
              <Plus size={20} /> New Bridge
            </button>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <button 
                  onClick={() => {
                    if (stats.plan === 'pro' || stats.plan === 'infinite') {
                      setPromptModal({ isOpen: true });
                    } else {
                      triggerToast('Upgrade to Pro to initialize Project Memory Folders.');
                    }
                  }}
                  className="btn-secondary" 
                  style={{ flex: 1, justifyContent: 'center', padding: '14px', fontSize: '0.85rem', fontWeight: '800', borderRadius: '16px', opacity: (stats.plan === 'pro' || stats.plan === 'infinite') ? 1 : 0.5 }}
                >
                  <Layers size={18} /> New Project
                </button>
                <button 
                  onClick={refreshVault}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', padding: '14px', fontSize: '0.85rem', fontWeight: '800', borderRadius: '16px' }}
                >
                  <RefreshCw size={18} /> Refresh
                </button>
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0 -20px 20px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button 
                onClick={() => { setActiveTab('saved'); setActiveProject(null); }}
                style={{ 
                  background: (activeTab === 'saved' && !activeProject) ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  padding: '14px 16px', borderRadius: '12px', 
                  color: (activeTab === 'saved' && !activeProject) ? 'white' : 'var(--text-muted)',
                  border: '1px solid', borderColor: (activeTab === 'saved' && !activeProject) ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                  textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'all 0.2s', fontWeight: (activeTab === 'saved' && !activeProject) ? '700' : '600'
                }}
              >
                <MessageSquare size={18} color={(activeTab === 'saved' && !activeProject) ? 'var(--primary)' : 'currentColor'} /> All Vaults
              </button>
              
              {projects.length > 0 && (
                <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '16px', fontWeight: '800', letterSpacing: '1px' }}>PROJECTS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {projects.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => { setActiveTab('saved'); setActiveProject(p.id); }}
                          style={{ 
                            width: '100%',
                            background: activeProject === p.id ? 'rgba(255,255,255,0.04)' : 'transparent',
                            padding: '12px 16px', borderRadius: '12px', 
                            color: activeProject === p.id ? 'white' : 'var(--text-muted)',
                            border: '1px solid', borderColor: activeProject === p.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                            textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                            transition: 'all 0.2s', fontWeight: activeProject === p.id ? '700' : '500'
                          }}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeProject === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)', boxShadow: activeProject === p.id ? '0 0 10px var(--primary)' : 'none' }}></div>
                          {p.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '12px -20px' }} />

              <button 
                onClick={() => setActiveTab('extension')}
                style={{ 
                  background: activeTab === 'extension' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  padding: '14px 16px', borderRadius: '12px', color: activeTab === 'extension' ? 'white' : 'var(--text-muted)',
                  border: '1px solid', borderColor: activeTab === 'extension' ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                  textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'all 0.2s', width: '100%', fontWeight: activeTab === 'extension' ? '700' : '600'
                }}
              >
                <Zap size={18} color={activeTab === 'extension' ? '#10b981' : 'currentColor'} /> Extension
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '900', letterSpacing: '0.5px' }}>LIVE</span>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                style={{ 
                  background: activeTab === 'history' ? 'rgba(255,255,255,0.05)' : 'transparent',
                  padding: '14px 16px', borderRadius: '12px', color: activeTab === 'history' ? 'white' : 'var(--text-muted)',
                  border: '1px solid', borderColor: activeTab === 'history' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'all 0.2s', fontWeight: activeTab === 'history' ? '700' : '600'
                }}
              >
                <Clock size={18} /> History
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
          {activeTab === 'saved' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
                    padding: '16px 24px', borderRadius: '16px', marginBottom: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#4ade80'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={20} />
                    <span>Conversation successfully bridged and saved to Vault!</span>
                  </div>
                  <button onClick={() => setShowSuccess(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}>✕</button>
                </motion.div>
              )}
              
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h1 className="premium-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                      {activeProject ? projects.find(p => p.id === activeProject)?.name : `Hello, ${JSON.parse(localStorage.getItem('bridge_user') || '{}').name || 'Bridge User'}`}
                    </h1>
                    <div style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '800', 
                      background: hubStatus === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                      color: hubStatus === 'online' ? '#10b981' : '#fb7185',
                      border: `1px solid ${hubStatus === 'online' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                      display: 'flex', alignItems: 'center', gap: '6px', marginTop: '-4px'
                    }}>
                      <div className={hubStatus === 'online' ? 'pulse' : ''} style={{ width: '6px', height: '6px', borderRadius: '50%', background: hubStatus === 'online' ? '#10b981' : '#fb7185' }} />
                      HUB {hubStatus.toUpperCase()}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>{filteredBridges.length} contexts organized and ready to bridge.</p>
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search context..." 
                    className="input-premium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      paddingLeft: '44px', 
                      width: '300px'
                    }}
                  />
                </div>
              </div>

              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {[
                  { label: 'Total Bridges', val: stats.totalBridges || 0, icon: <Layers size={18} /> },
                  { label: 'Intelligence Ratio', val: '99.4%', icon: <Zap size={18} /> },
                  { label: 'Context Tokens', val: (stats.totalTokens || 0).toLocaleString(), icon: <Database size={18} /> },
                  { label: 'Active Vaults', val: projects.length, icon: <Folder size={18} /> }
                ].map((s, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="glass-card" 
                    style={{ padding: '24px', textAlign: 'center' }}
                  >
                    <div style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>{s.val}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading vault…</p>
              ) : filteredBridges.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentBridges.length > 0 && (
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '1.5px', color: 'var(--text-muted)', paddingLeft: '4px' }}>
                      TODAY
                    </div>
                  )}
                  {recentBridges.map(ctx => (
                    <BridgeCard 
                      key={ctx.id} 
                      ctx={{ ...ctx, onCopy: (msg) => triggerToast(msg || 'Copied!') }} 
                      onDelete={(id) => setConfirmModal({ isOpen: true, id })} 
                      onForge={handleForge} 
                      loadData={loadData} 
                    />
                  ))}
                  {olderBridges.length > 0 && (
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '1.5px', color: 'var(--text-muted)', paddingLeft: '4px', marginTop: '8px' }}>
                      EARLIER
                    </div>
                  )}
                  {olderBridges.map(ctx => (
                    <BridgeCard 
                      key={ctx.id} 
                      ctx={{ ...ctx, onCopy: (msg) => triggerToast(msg || 'Copied!') }} 
                      onDelete={(id) => setConfirmModal({ isOpen: true, id })} 
                      onForge={handleForge} 
                      loadData={loadData} 
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Target size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'white' }}>
                    {loading ? 'Consulting the Hub...' : 'Sovereign Vault is Empty'}
                  </h3>
                  <p style={{ marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                    {searchTerm 
                      ? "No intelligence matches your current search criteria."
                      : "Welcome, Bridge Analyst. Your private vault is currently empty. Extract intelligence from Gemini, Claude, or ChatGPT to begin building your knowledge base."
                    }
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => setActiveTab('manual')} className="btn-primary" style={{ padding: '10px 22px' }}>
                      <Plus size={16} /> New Bridge
                    </button>
                    <button onClick={refreshVault} className="btn-secondary" style={{ padding: '10px 22px' }}>
                      🔄 Refresh Vault
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'extension' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '32px' }}
              >
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Operational Hub</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Orchestrate your cross-LLM intelligence relays.</p>
              </motion.div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '28px' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '16px', borderRadius: '50%', width: 'fit-content', marginBottom: '16px' }}>
                    <Zap size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Relay Status: ACTIVE</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                    Your extension is successfully linked with the Hub. Intelligence extraction can now be initiated from any compatible browser tab.
                  </p>
                  
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', marginBottom: '8px' }}>CAPABILITIES</div>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={14} color="#10b981" /> Universal Chat Extraction</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={14} color="#10b981" /> Multi-Platform Context Sync</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={14} color="#10b981" /> Side-Panel Analyst View</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={14} color="#10b981" /> Secure Sovereign Relay</li>
                    </ul>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '28px', borderStyle: 'dashed', borderColor: 'var(--primary)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Eye size={20} color="var(--primary)" /> Pin Extension for Immediate Access
                  </h3>
                  
                  <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '24px', overflow: 'hidden' }}>
                    <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--primary)' }}>
                        <h4 style={{ color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Download size={18} /> Standalone Sovereign Pack (.zip)
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Download the packaged analyst module. This version runs completely independent of this dashboard.
                        </p>
                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', padding: '10px' }}
                            onClick={() => window.open('/bridgeai-extension.zip', '_blank')}
                        >
                            Download Analyst Package
                        </button>
                    </div>

                    {/* Visual representation of pinning steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                        <div>
                          <p style={{ fontWeight: '600' }}>Click the Puzzle Piece Icon</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Located in the top right of your browser toolbar.</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '600' }}>Find BridgeAI and click Pin (<span style={{ fontSize: '1.2rem' }}>📌</span>)</p>
                          <div style={{ 
                            marginTop: '12px', background: '#1e293b', padding: '12px 16px', borderRadius: '10px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '4px' }} />
                              <span style={{ fontSize: '0.85rem' }}>BridgeAI - Cross-LLM...</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', color: 'var(--primary)' }}>
                              <span title="Pin to toolbar" style={{ cursor: 'pointer', fontSize: '1.1rem' }}>📌</span>
                              <span style={{ opacity: 0.3 }}>⋮</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                        <div>
                          <p style={{ fontWeight: '600' }}>Launch Side-Panel Analyst</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click the logo to open your workspace sidebar.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="premium-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>History Log</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Review your past bridge transfers across all platforms.</p>
              
              {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Fetching deep history from cloud...</p>
              ) : historyBridges.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {historyBridges.map(ctx => <BridgeCard key={ctx.id} ctx={{ ...ctx, onCopy: (msg) => triggerToast(msg || 'Historical context bridged to clipboard!') }} onDelete={handleDelete} onForge={handleForge} loadData={loadData} />)}
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Clock size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'white' }}>No History Available</h3>
                  <p>Bridges older than 24 hours will automatically move into this archive.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'manual' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="premium-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>New Bridge</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Paste context, assign a project, and let BridgeAI extract its intelligence.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Bridge Name</label>
                  <input 
                    id="manual-title"
                    type="text" 
                    placeholder="e.g. My MERN App, Deep Learning Notes..." 
                    className="input-premium"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Assign to Project</label>
                  <select id="manual-project" className="input-premium" style={{ width: '100%', background: 'var(--bg)' }}>
                    <option value="">— No Project —</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Intelligence Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {[
                    { val: 'quick', label: '⚡ Quick', desc: 'TL;DR', color: '#22c55e', tier: 'free' },
                    { val: 'developer', label: '👨‍💻 Dev', desc: 'Code + Tasks', color: '#8b5cf6', tier: 'pro' },
                    { val: 'research', label: '🔬 Research', desc: 'Concepts', color: '#06b6d4', tier: 'pro' },
                    { val: 'study', label: '📚 Study', desc: 'Notes', color: '#f59e0b', tier: 'pro' },
                    { val: 'project', label: '🚀 Project', desc: 'Status', color: '#f43f5e', tier: 'pro' },
                  ].map(m => {
                    const isLocked = m.tier === 'pro' && stats.plan === 'free';
                    return (
                      <label key={m.val} htmlFor={`mode-${m.val}`} style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}>
                        <input 
                          type="radio" id={`mode-${m.val}`} name="manual-mode" value={m.val} 
                          defaultChecked={m.val === 'quick'} style={{ display: 'none' }} 
                          disabled={isLocked}
                        />
                        <div style={{ 
                          padding: '12px 8px', borderRadius: '12px', textAlign: 'center',
                          border: `1px solid rgba(255,255,255,0.1)`, background: 'rgba(255,255,255,0.03)',
                          transition: 'all 0.2s', opacity: isLocked ? 0.3 : 1,
                          position: 'relative'
                        }}
                        onClick={(e) => {
                          if (isLocked) {
                            triggerToast('Upgrade to Pro to unlock 5 Intelligence Modes.');
                            return;
                          }
                          document.querySelectorAll('.mode-card').forEach(c => c.style.border = '1px solid rgba(255,255,255,0.1)');
                          e.currentTarget.style.border = `1px solid ${m.color}`;
                        }}
                        className="mode-card"
                        >
                          {isLocked && <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#f43f5e', borderRadius: '50%', padding: '2px' }}><X size={8} color="white" /></div>}
                          <div style={{ fontSize: '1.2rem' }}>{m.label.split(' ')[0]}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'white', marginTop: '4px' }}>{m.label.split(' ').slice(1).join(' ')}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{m.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Raw Context (paste chat logs, code, notes…)</label>
                  <textarea 
                    id="manual-text"
                    placeholder="Paste your conversation, code, or notes here. BridgeAI will extract structured intelligence from it."
                    className="input-premium"
                    onChange={(e) => {
                      // Handled by the ManualBridgeSubmit trigger or just local state
                    }}
                    style={{ 
                      width: '100%', height: '220px',
                      fontFamily: 'monospace', fontSize: '0.875rem', resize: 'vertical'
                    }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => {
                        if (stats.plan === 'infinite') {
                          if (bridges.length < 2) return triggerToast('Need at least 2 bridges to merge!');
                          const last3 = bridges.slice(0, 3);
                          const merged = last3.map(b => `## ${b.title}\n${b.summary}`).join('\n\n---\n\n');
                          const textInput = document.getElementById('manual-text');
                          const titleInput = document.getElementById('manual-title');
                          if (textInput) textInput.value = merged;
                          if (titleInput) titleInput.value = 'Merged Intelligence Hub';
                          triggerToast('Last 3 active bridges merged into editor!');
                        } else {
                          triggerToast('Upgrade to Infinite Hub to unlock Multi-Chat Logic Merge.');
                        }
                      }}
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', opacity: stats.plan === 'infinite' ? 1 : 0.5 }}
                    >
                      <GitMerge size={14} /> Merge Last 3
                    </button>
                  </div>

                  <ManualBridgeSubmit projects={projects} triggerToast={triggerToast} setActiveTab={setActiveTab} setBridges={setBridges} />
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modern SaaS Toast Notification */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            padding: '16px 24px',
            borderRadius: '20px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            zIndex: 9999
          }}
        >
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '6px', borderRadius: '50%', color: '#a78bfa' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Success</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{toast}</p>
          </div>
        </motion.div>
      )}

      {/* Modern Confirmation Modal */}
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Expunge Intelligence?"
        message="Are you sure you want to permanently remove this context bridge from your Sovereign Vault? This action cannot be reversed."
      />

      {/* Modern Prompt Modal */}
      <PromptModal 
        isOpen={promptModal.isOpen}
        onClose={() => setPromptModal({ isOpen: false })}
        onSubmit={handleCreateProject}
        title="Initialize New Project"
        label="Project Identity"
        placeholder="e.g. Project 'Sovereign-X'..."
      />

      {/* Universal Forge Modal */}
      <ForgeModal 
        isOpen={forgeState.isOpen} 
        onClose={() => setForgeState({ ...forgeState, isOpen: false })}
        context={forgeState.context}
        onDispatch={(url) => handleDispatch(url, forgeState.bestContext)}
      />

    </div>
  );
};

export default Dashboard;
