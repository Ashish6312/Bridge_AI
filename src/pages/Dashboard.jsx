import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Plus, Search, MessageSquare, Clock, Code, Target, Layers, Activity,
  CheckCircle2, ExternalLink, Zap, Download, GitMerge, BookOpen, Eye, EyeOff, Mail, Wand2, Cpu, Globe, Database, Folder, ArrowRight, RefreshCw, FileText, X
} from 'lucide-react';
import { API_BASE } from '../apiConfig';
import IntelligenceBridge from '../components/IntelligenceBridge';

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

const BridgeCard = ({ ctx, onDelete, onForge, loadData, stats, triggerToast, projects }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [mailSending, setMailSending] = useState(null);
  const [showUniversalModal, setShowUniversalModal] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const handleMoveToProject = async (projectId) => {
    try {
      const res = await fetch(`${API_BASE}/api/bridge/${ctx.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId })
      });
      if (res.ok) {
        triggerToast(`Intelligence moved to ${projectId || 'Universal Vault'}`);
        setShowProjectMenu(false);
        loadData();
      }
    } catch (err) {
      triggerToast('Protocol failure: Could not move intelligence.');
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const prompt = `Give a brief TL;DR summary (3-5 bullet points) of the following text:\n\n${ctx.chat_log || ctx.chatLog}`;
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
      if (filtered.includes('IMPORTANT NOTICE')) {
        const parts = filtered.split('work normally.');
        if (parts.length > 1) filtered = parts[1].trim();
      }

      let summary = filtered;
      try {
        const json = JSON.parse(filtered);
        if (json.choices && json.choices[0]?.message?.content) summary = json.choices[0].message.content;
        else if (json.content) summary = json.content;
      } catch (e) {}

      const res = await fetch(`${API_BASE}/api/bridge/${ctx.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary })
      });
      if (res.ok) {
        triggerToast('Intelligence re-distilled.');
        loadData();
      }
    } catch (err) {
      triggerToast('Protocol Timeout: AI Hub unreachable.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch(`${API_BASE}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: ctx.summary })
      });
      const data = await response.json();
      if (data.success) {
        setOptimizedPrompt(data.optimized);
      } else {
        triggerToast('Optimization engine idle. Check Hub logs.');
      }
    } catch (err) {
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
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)', transition: 'all 0.3s ease' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{(ctx.source || 'Manual')} BRIDGE</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {formatTime(ctx.created_at)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{ctx.title}</h3>
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
            <button onClick={handleRegenerate} disabled={isRegenerating} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px', opacity: 0.6 }} title="Regenerate Intelligence">
               <RefreshCw size={12} className={isRegenerating ? 'pulse' : ''} />
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProjectMenu(!showProjectMenu)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px', opacity: 0.6 }} 
                title="Assign to Project Folder"
              >
                <Folder size={14} />
              </button>
              {showProjectMenu && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0,
                  background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '8px', zIndex: 100, minWidth: '180px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', padding: '8px', letterSpacing: '1px' }}>MOVE TO FOLDER</div>
                  <button 
                    onClick={() => handleMoveToProject(null)}
                    style={{ 
                      display: 'flex', width: '100%', background: 'transparent', border: 'none',
                      color: 'rgba(255,255,255,0.5)', padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                      borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    — Universal Vault —
                  </button>
                  {projects.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => handleMoveToProject(p.id)}
                      style={{ 
                        display: 'flex', width: '100%', background: 'transparent', border: 'none',
                        color: ctx.project_id === p.id ? 'var(--primary)' : 'white', padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                        borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(ctx.id)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', opacity: 0.6, fontSize: '0.85rem', fontWeight: '900' }}>DELETE</button>
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
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowExport(v => !v)}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Export
              </button>
              {showExport && (
                <div style={{
                  position: 'absolute', bottom: '110%', left: 0,
                  background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '8px', zIndex: 100, minWidth: '200px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                }}>
                  {[
                    { fmt: 'markdown', label: '📄 Markdown (.md)', icon: <FileText size={16} /> },
                    { fmt: 'json',     label: '🗂 JSON (.json)', icon: <Database size={16} /> },
                    { fmt: 'prompt',   label: '⚡ Prompt Pack (.txt)', icon: <Zap size={16} /> },
                  ].map(({ fmt, label, icon }) => (
                    <button 
                      key={fmt} 
                      onClick={() => { exportBridge(ctx, fmt); setShowExport(false); }}
                      style={{ 
                        display: 'flex', width: '100%', background: 'transparent', border: 'none',
                        color: 'white', padding: '12px 16px', textAlign: 'left', cursor: 'pointer',
                        borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600',
                        transition: 'background 0.2s', alignItems: 'center', gap: '10px'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            { name: 'DeepSeek',  url: 'https://chat.deepseek.com',     color: '#60a5fa', icon: <Target size={14} /> },
            { name: 'Mistral',   url: 'https://chat.mistral.ai',       color: '#f97316', icon: <Activity size={14} /> },
            { name: 'Poe',       url: 'https://poe.com',               color: '#8b5cf6', icon: <Globe size={14} /> },
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
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
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
  const log = ctx.chat_log || ctx.chatLog || '';
  if (format === 'markdown') {
    content = `# ${ctx.title}\n**Source:** ${ctx.source}  \n**Date:** ${ctx.created_at}\n\n## Summary\n${ctx.summary}\n\n## Full Log\n${log}`;
    filename = `${ctx.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    type = 'text/markdown';
  } else if (format === 'json') {
    content = JSON.stringify({ title: ctx.title, source: ctx.source, summary: ctx.summary, chat_log: log, created_at: ctx.created_at }, null, 2);
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
const ManualBridgeSubmit = ({ projects, triggerToast, setActiveTab, setBridges, loadData }) => {
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
      const response = await fetch(`${API_BASE}/api/rename`, {
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
      const userStr = localStorage.getItem('bridge_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const email = user?.email || 'guest';

      const res = await fetch(`${API_BASE}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', text }], 
          platform: 'Manual', 
          title,
          email,
          mode,
          project_id: projectId
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

/* ─── Skeleton Loading Component ────────────────────────────────── */
const SkeletonCard = () => (
  <div className="glass-card" style={{ padding: '24px', marginBottom: '16px', borderLeft: '4px solid rgba(255,255,255,0.05)', opacity: 0.5 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div style={{ width: '140px', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
      <div style={{ width: '60px', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
    </div>
    <div style={{ width: '80%', height: '24px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', marginBottom: '12px' }} />
    <div style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
  </div>
);

/* ─── Reusable Sidebar Item Component ────────────────────────────── */
const NavItem = ({ active, icon, label, count, status, onClick }) => (
  <motion.button 
    whileHover={{ x: 6, background: 'rgba(255,255,255,0.05)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{ 
      width: '100%',
      background: active ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
      padding: '12px 18px', borderRadius: '16px', 
      color: active ? 'white' : 'rgba(255,255,255,0.4)',
      border: '1px solid', borderColor: active ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
      textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative',
      boxShadow: active ? 'inset 0 0 15px rgba(139, 92, 246, 0.05)' : 'none'
    }}
  >
    {active && (
      <motion.div 
        layoutId="active-nav"
        style={{ 
          position: 'absolute', left: '0', top: '25%', bottom: '25%', width: '4px', 
          background: 'var(--primary)', borderRadius: '0 4px 4px 0', 
          boxShadow: '0 0 15px var(--primary)' 
        }} 
      />
    )}
    <div style={{ color: active ? 'var(--primary)' : 'currentColor', display: 'flex', alignItems: 'center', transition: '0.2s' }}>
      {React.cloneElement(icon, { size: 18, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span style={{ fontSize: '0.9rem', fontWeight: active ? '800' : '600', letterSpacing: '-0.01em', transition: '0.2s' }}>{label}</span>
    {count !== undefined && (
      <div style={{ marginLeft: 'auto', background: active ? 'var(--primary)' : 'rgba(255,255,255,0.05)', padding: '2px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', color: active ? 'white' : 'rgba(255,255,255,0.3)', boxShadow: active ? '0 4px 10px rgba(139, 92, 246, 0.3)' : 'none' }}>
        {count}
      </div>
    )}
    {status && (
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '900', letterSpacing: '0.5px' }}>{status}</span>
      </div>
    )}
  </motion.button>
);

const Dashboard = () => {


  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [localProjects, setLocalProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bridge_local_projects') || '[]');
    } catch (e) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('bridge_local_projects', JSON.stringify(localProjects));
  }, [localProjects]);

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
    const syncWithExtension = () => {
       try {
         const event = new CustomEvent('BRIDGE_AUTH_UPDATE', { 
           detail: { user: JSON.parse(user) } 
         });
         window.dispatchEvent(event);
       } catch (e) {}
    };
    
    loadData();
    syncWithExtension();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithExtension();
        loadData(true);
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

  const isFetchingRef = React.useRef(false);

  const loadData = React.useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      if (!isSilent && bridges.length === 0) setLoading(true);
      
      const userStr = localStorage.getItem('bridge_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const email = user?.email || '';

      if (!email) {
        setLoading(false);
        return;
      }

      const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Protocol Timeout')), timeout))
        ]);
      };

      const [bridgesRes, statusRes] = await Promise.all([
        fetchWithTimeout(`${API_BASE}/api/bridges?email=${email}`, { headers: { 'Cache-Control': 'no-cache' } }),
        fetchWithTimeout(`${API_BASE}/api/user/status?email=${email}`).catch(() => null)
      ]);

      const bridgesData = await bridgesRes.json();
      
      if (bridgesData.success) {
        setHubStatus('online');
        const localBridges = bridgesData.data || [];
        setBridges(localBridges);
        
        const uniqueProjectIds = [...new Set(localBridges.map(b => b.project_id).filter(Boolean))];
        const serverProjects = uniqueProjectIds.map(id => ({ id, name: id }));
        
        // Merge with local projects, avoiding duplicates
        const allProjects = [...serverProjects];
        localProjects.forEach(lp => {
          if (!allProjects.find(ap => ap.id === lp.id || ap.name === lp.name)) {
            allProjects.push(lp);
          }
        });
        setProjects(allProjects);
        
        const rawTokens = localBridges.reduce((acc, b) => {
          const match = String(b.tokens || '').match(/\d+/);
          return acc + (match ? parseInt(match[0]) : 0);
        }, 0);
        
        setStats(prev => ({ 
          ...prev, 
          totalBridges: localBridges.length, 
          totalTokens: rawTokens * 2.5 
        }));
      } else {
        setHubStatus('offline');
      }

      setLoading(false);
      if (statusRes) {
        const statusData = await statusRes.json().catch(() => null);
        if (statusData && statusData.success) {
          setStats(prev => ({ 
            ...prev, 
            plan: statusData.plan, 
            usageCount: statusData.usage 
          }));
        }
      }
    } catch (err) {
      setHubStatus('offline');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [bridges.length]);

  const refreshVault = () => {
    loadData();
    try { window.dispatchEvent(new CustomEvent('RELOAD_EXTENSION')); } catch (e) {}
  };

  useEffect(() => {
    const userStr = localStorage.getItem('bridge_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const email = user?.email;

    if (!email) return;

    // Realtime Sync Protocol via SSE
    const eventSource = new EventSource(`${API_BASE}/api/realtime?email=${email}`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[REALTIME] Hub update received:', data);
        loadData(true);
      } catch (e) {
        console.error('[REALTIME] Protocol parse error:', e);
      }
    };

    eventSource.onerror = () => {
      console.warn('[REALTIME] Protocol link severed. Attempting handshake...');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [loadData]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'bridge_user' || e.key === 'bridge_vault_updated') loadData(true);
    };
    const handleVaultUpdate = () => loadData(true);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('bridge-vault-update', handleVaultUpdate);
    loadData(false);
    const pulseInterval = setInterval(() => loadData(true), 30000); // Polling reduced as backup
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('bridge-vault-update', handleVaultUpdate);
      clearInterval(pulseInterval);
    };
  }, [loadData]);

  const handleCreateProject = (name) => {
    if (!name) return;
    const newProject = { id: name, name, created_at: new Date().toISOString() };
    setLocalProjects(prev => [...prev, newProject]);
    setProjects(prev => {
      if (prev.find(p => p.name === name)) return prev;
      return [...prev, newProject];
    });
    triggerToast(`Vault "${name}" successfully initialized.`);
  };

  const filteredBridges = bridges.filter(b => {
    const title   = (b.title   || '').toLowerCase();
    const summary = (b.summary || '').toLowerCase();
    const source  = (b.source  || '').toLowerCase();
    const term    = searchTerm.toLowerCase();
    const matchesSearch  = !term || title.includes(term) || summary.includes(term) || source.includes(term);
    
    // Improved project filtering logic
    const matchesProject = activeProject 
      ? (String(b.project_id || '') === String(activeProject))
      : true;

    return matchesSearch && matchesProject;
  });

  const recentBridges  = filteredBridges.filter(b =>  isRecent(b.created_at));
  const olderBridges   = filteredBridges.filter(b => !isRecent(b.created_at));
  const historyBridges = olderBridges;

  const handleDelete = async () => {
    const id = confirmModal.id;
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/bridge/${id}`, { method: 'DELETE' });
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
        
        {/* Elite Dashboard Sidebar */}
        <motion.aside 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="dashboard-sidebar" 
          style={{ 
            width: '320px', flexShrink: 0, position: 'sticky', top: '100px', 
            maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '4px' 
          }}
        >
          <div className="glass-card" style={{ padding: '0', marginBottom: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(24px)' }}>
            
            {/* Hub Identity & Status */}
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Cpu size={18} color="white" />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px', color: 'white' }}>SOVEREIGN HUB</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: hubStatus === 'online' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)', padding: '4px 12px', borderRadius: '100px', border: hubStatus === 'online' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)' }}>
                  <div className={hubStatus === 'online' ? 'pulse' : ''} style={{ width: '6px', height: '6px', borderRadius: '50%', background: hubStatus === 'online' ? '#22c55e' : '#f43f5e' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: '900', color: hubStatus === 'online' ? '#22c55e' : '#f43f5e' }}>{hubStatus.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--gradient-1)', padding: '2px' }}>
                    <div style={{ width: '100%', height: '100%', background: '#020617', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.4rem' }}>
                      {JSON.parse(localStorage.getItem('bridge_user') || '{}').name?.charAt(0) || 'A'}
                    </div>
                  </div>
                  {String(stats.plan).toLowerCase() === 'infinite' && (
                    <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', background: '#f59e0b', borderRadius: '50%', border: '3px solid #020617', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)' }}>
                      <Zap size={12} color="white" fill="white" />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '16px', height: '16px', borderRadius: '50%', background: '#10b981', border: '3px solid #020617', boxShadow: '0 0 10px #10b981' }} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '1rem', color: 'white', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {JSON.parse(localStorage.getItem('bridge_user') || '{}').name || 'Anonymous Analyst'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{JSON.parse(localStorage.getItem('bridge_user') || '{}').email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Engine */}
            <div style={{ padding: '24px' }}>
              
              {/* Group: Vault Ops */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: '900', letterSpacing: '2px', marginBottom: '16px', paddingLeft: '8px' }}>VAULT ENGINE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <NavItem 
                    active={activeTab === 'saved' && !activeProject} 
                    icon={<Layers size={18} />} 
                    label="All Intelligence" 
                    count={bridges.length} 
                    onClick={() => { setActiveTab('saved'); setActiveProject(null); }} 
                  />
                  <NavItem 
                    active={activeTab === 'history'} 
                    icon={<Clock size={18} />} 
                    label="History Archive" 
                    onClick={() => setActiveTab('history')} 
                  />
                  <NavItem 
                    active={activeTab === 'extension'} 
                    icon={<Zap size={18} />} 
                    label="Analyst Module" 
                    status="LIVE"
                    onClick={() => setActiveTab('extension')} 
                  />
                </div>
              </div>

              {/* Group: Project Folders */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingLeft: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: '900', letterSpacing: '2px' }}>PROJECTS</div>
                  <button onClick={() => setPromptModal({ isOpen: true })} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}>
                    <Plus size={18} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                  {projects.length === 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No project folders initialized</p>
                    </div>
                  )}
                  {projects.map(p => (
                    <NavItem 
                      key={p.id}
                      active={activeProject === p.id} 
                      icon={<div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeProject === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }} />} 
                      label={p.name} 
                      count={bridges.filter(b => String(b.project_id) === String(p.id)).length}
                      onClick={() => { setActiveTab('saved'); setActiveProject(p.id); }} 
                    />
                  ))}
                </div>
              </div>

              {/* Group: Capacity Protocol */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingLeft: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: '900', letterSpacing: '2px' }}>CAPACITY</div>
                  <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--primary)' }}>{(stats.plan || 'FREE').toUpperCase()}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                  {String(stats.plan).toLowerCase() === 'infinite' ? (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#f59e0b', letterSpacing: '1px', marginBottom: '4px' }}>SOVEREIGN STATUS</div>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: 'white' }}>UNLIMITED RELAY</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
                        <span>Extraction Usage</span>
                        <span>{Math.round((stats.usageCount / (String(stats.plan).toLowerCase() === 'pro' ? 100 : 3)) * 100)}%</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${Math.min(100, (stats.usageCount / (String(stats.plan).toLowerCase() === 'pro' ? 100 : 3)) * 100)}%` }}
                          transition={{ duration: 1 }}
                          style={{ height: '100%', background: 'var(--gradient-1)', boxShadow: '0 0 15px var(--primary)' }} 
                        />
                      </div>
                    </>
                  )}
                  {String(stats.plan).toLowerCase() !== 'infinite' && (
                    <Link to="/services" style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textDecoration: 'none', background: 'rgba(139, 92, 246, 0.1)', padding: '8px', borderRadius: '10px' }}>
                      UPGRADE HUB
                    </Link>
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar Footer */}
            <div style={{ padding: '20px 24px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={14} color="#10b981" />
                  <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>SECURE SYNC v2.4.0</span>
               </div>
               <button onClick={refreshVault} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                  <RefreshCw size={14} />
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
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
              
              <div style={{ position: 'relative', overflow: 'hidden', padding: '40px', borderRadius: '40px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
                <IntelligenceBridge />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <div style={{ 
                    padding: '6px 12px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: '900', 
                    background: hubStatus === 'online' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                    color: hubStatus === 'online' ? '#22c55e' : '#f43f5e',
                    border: `1px solid ${hubStatus === 'online' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(244, 63, 94, 0.15)'}`,
                    display: 'inline-flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px',
                    marginBottom: '24px'
                  }}>
                    <div className={hubStatus === 'online' ? 'pulse' : ''} style={{ width: '6px', height: '6px', borderRadius: '50%', background: hubStatus === 'online' ? '#22c55e' : '#f43f5e' }} />
                    Hub {hubStatus}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, maxWidth: '650px' }}>
                      <h1 className="premium-gradient-text" style={{ fontSize: '3.8rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '16px', lineHeight: '1.05' }}>
                        {(() => {
                          const hour = new Date().getHours();
                          const user = JSON.parse(localStorage.getItem('bridge_user') || '{}');
                          const name = user.name?.split(' ')[0] || 'Analyst';
                          if (hour < 12) return `Good Morning, ${name}`;
                          if (hour < 18) return `Good Afternoon, ${name}`;
                          return `Good Evening, ${name}`;
                        })()}
                      </h1>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: '500', lineHeight: '1.5' }}>
                        Your Sovereign Hub is currently presiding over <strong>{filteredBridges.length}</strong> active intelligence bridges in the {activeProject ? `"${projects.find(p => p.id === activeProject)?.name}"` : 'Universal'} sector.
                      </p>
                    </div>
                    
                    <div style={{ position: 'relative', width: '340px' }}>
                      <Search size={20} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 2 }} />
                      <input 
                        type="text" 
                        placeholder="Search intelligence..." 
                        className="input-premium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '20px 24px 20px 60px', 
                          fontSize: '1rem', 
                          background: 'rgba(15, 23, 42, 0.6)', 
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '20px', 
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {[
                  { label: 'Total Bridges', val: stats.totalBridges || 0, icon: <Layers size={22} />, color: '#8b5cf6' },
                  { 
                    label: 'Distillation Ratio', 
                    val: (() => {
                      const totalSource = bridges.reduce((acc, b) => acc + (b.source_text?.length || 0), 0);
                      const totalSum = bridges.reduce((acc, b) => acc + (b.summary?.length || 0), 0);
                      if (!totalSource) return '99.4%';
                      return ((totalSum / totalSource) * 100).toFixed(1) + '%';
                    })(), 
                    icon: <Zap size={22} />, 
                    color: '#f59e0b' 
                  },
                  { label: 'Context Tokens', val: Math.round(stats.totalTokens || 0).toLocaleString(), icon: <Database size={22} />, color: '#06b6d4' },
                  { 
                    label: 'Intelligence Density', 
                    val: (() => {
                      if (bridges.length === 0) return '0.00';
                      const sumLen = bridges.reduce((acc, b) => acc + (b.summary?.length || 0), 0);
                      return (sumLen / (bridges.length * 1000)).toFixed(2);
                    })(), 
                    icon: <Activity size={22} />, 
                    color: '#10b981' 
                  }
                ].map((s, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -5, boxShadow: `0 20px 40px ${s.color}15` }}
                    transition={{ delay: 0.1 + (i * 0.1) }}
                    className="glass-card"
                    style={{ 
                      padding: '24px', position: 'relative', overflow: 'hidden',
                      background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'default'
                    }}
                  >
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40px', opacity: 0.1 }}>
                      <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <motion.path
                          d="M0 20 Q 25 10, 50 20 T 100 20 V 40 H 0 Z"
                          fill={s.color}
                          animate={{ 
                            opacity: [0.1, 0.2, 0.1],
                            y: [0, -2, 0]
                          }}
                          transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
                        />
                      </svg>
                    </div>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, transform: 'rotate(-15deg)' }}>
                      {React.cloneElement(s.icon, { size: 80, color: s.color })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '12px', background: `${s.color}15`, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color,
                        border: `1px solid ${s.color}33`
                      }}>
                        {s.icon}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>{s.val}</div>
                  </motion.div>
                ))}
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
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
                      stats={stats}
                      triggerToast={triggerToast}
                      projects={projects}
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
                      stats={stats}
                      triggerToast={triggerToast}
                      projects={projects}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '80px 24px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.3)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '80px', height: '80px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <Target size={40} style={{ color: 'var(--primary)', opacity: 0.8 }} />
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: 'white', letterSpacing: '-0.02em' }}>
                    {loading ? 'Consulting the Hub...' : activeProject ? `Vault "${projects.find(p => p.id === activeProject)?.name}" is Empty` : 'Sovereign Vault is Empty'}
                  </h3>
                  <p style={{ marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px auto', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    {searchTerm 
                      ? "No intelligence matches your current search criteria. Refine your query to locate specific context bridges."
                      : activeProject 
                      ? "This specific vault folder has no intelligence. Go to 'All Intelligence' to assign items here."
                      : "Welcome, Bridge Analyst. Your private vault is currently empty. Extract intelligence from Gemini, Claude, or ChatGPT to begin building your professional knowledge base."
                    }
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    {!searchTerm && !activeProject && (
                       <button onClick={() => setActiveTab('manual')} className="btn-primary" style={{ padding: '14px 28px' }}><Plus size={18} /> New Bridge</button>
                    )}
                    {activeProject && (
                       <button onClick={() => setActiveProject(null)} className="btn-primary" style={{ padding: '14px 28px' }}><MessageSquare size={18} /> Show All Intelligence</button>
                    )}
                    <button onClick={refreshVault} className="btn-secondary" style={{ padding: '14px 28px' }}><RefreshCw size={18} /> Refresh Vault</button>
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
                style={{ marginBottom: '40px' }}
              >
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '12px' }}>Operational Hub</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px' }}>
                  BridgeAI works everywhere you do. Install the analyst module to orchestrate your cross-LLM intelligence relays.
                </p>
              </motion.div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '40px' }}>
                {/* Left Side: Status & Capabilities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.1, pointerEvents: 'none' }}></div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '16px', borderRadius: '20px', width: 'fit-content', marginBottom: '20px' }}>
                      <Zap size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px', color: 'white' }}>Relay Status: ACTIVE</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px', fontSize: '0.95rem' }}>
                      Your environment is ready. Intelligence extraction can be initiated from any compatible browser tab once the module is loaded.
                    </p>
                    
                    <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1.5px', marginBottom: '16px' }}>CORE CAPABILITIES</div>
                      <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={16} color="#10b981" /> Universal Chat Extraction</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={16} color="#10b981" /> Multi-Platform Context Sync</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={16} color="#10b981" /> Side-Panel Analyst View</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={16} color="#10b981" /> Secure Sovereign Relay</li>
                      </ul>
                    </div>
                  </div>

                  <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                    <h4 style={{ color: '#f43f5e', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} /> DEVELOPMENT BUILD
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(244, 63, 94, 0.8)', lineHeight: '1.5' }}>
                      This is a standalone developer build. Automatic updates are currently handled via manual re-installation. Chrome Web Store release is pending.
                    </p>
                  </div>
                </div>

                {/* Right Side: Installation Steps */}
                <div className="glass-card" style={{ padding: '40px', borderStyle: 'dashed', borderColor: 'var(--primary)', borderWidth: '2px' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    🚀 Quick Installation Guide
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Step 1 */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'white', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)' }}>1</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Download Extension Package</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Get the latest BridgeAI analyst module packaged as a .zip file.</p>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                          onClick={() => window.open('/bridgeai-extension.zip', '_blank')}
                        >
                          <Download size={18} /> Download BridgeAI (.zip)
                        </button>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'white' }}>2</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Open Extensions Dashboard</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          Navigate to <code style={{ color: 'var(--primary)', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>chrome://extensions</code> and enable <strong>Developer Mode</strong> in the top-right corner.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'white' }}>3</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Load Unpacked Module</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          Extract the downloaded ZIP, click <strong>"Load Unpacked"</strong>, and select the <code style={{ color: 'white' }}>BridgeAI</code> folder.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'white' }}>4</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Pin for Immediate Access</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          Click the puzzle icon (🧩) in your toolbar and pin <strong>BridgeAI</strong> for one-click extraction.
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ background: 'var(--primary)', width: '12px', height: '12px', borderRadius: '50%', boxShadow: '0 0 15px var(--primary)' }}></div>
                      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white' }}>
                        Ready to bridge. Open ChatGPT, Gemini, or Claude to begin.
                      </p>
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
                  {historyBridges.map(ctx => (
                    <BridgeCard 
                      key={ctx.id} 
                      ctx={{ ...ctx, onCopy: (msg) => triggerToast(msg || 'Historical context bridged to clipboard!') }} 
                      onDelete={handleDelete} 
                      onForge={handleForge} 
                      loadData={loadData} 
                      stats={stats} 
                      triggerToast={triggerToast} 
                      projects={projects}
                    />
                  ))}
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
                    { val: 'quick', label: 'Quick', icon: <Zap size={14} />, desc: 'TL;DR', color: '#22c55e', tier: 'free' },
                    { val: 'developer', label: 'Dev', icon: <Code size={14} />, desc: 'Code + Tasks', color: '#8b5cf6', tier: 'pro' },
                    { val: 'research', label: 'Research', icon: <BookOpen size={14} />, desc: 'Concepts', color: '#06b6d4', tier: 'pro' },
                    { val: 'study', label: 'Study', icon: <Target size={14} />, desc: 'Notes', color: '#f59e0b', tier: 'pro' },
                    { val: 'project', label: 'Project', icon: <Layers size={14} />, desc: 'Status', color: '#f43f5e', tier: 'pro' },
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
                          <div style={{ fontSize: '1.2rem', color: m.color, marginBottom: '4px' }}>{m.icon}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'white' }}>{m.label}</div>
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

                  <ManualBridgeSubmit projects={projects} triggerToast={triggerToast} setActiveTab={setActiveTab} setBridges={setBridges} loadData={loadData} />
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modern SaaS Toast Notification */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
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
