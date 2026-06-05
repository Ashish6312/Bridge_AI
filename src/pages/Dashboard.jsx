import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Plus, Search, MessageSquare, Clock, Code, Target, Layers, Activity,
  CheckCircle2, ExternalLink, Zap, Download, GitMerge, BookOpen, Eye, EyeOff, Mail, Wand2, Cpu, Globe, Database, Folder, ArrowRight, RefreshCw, FileText, X, Trash2, Lock, Settings, Edit2,
  PanelLeftClose, PanelLeft
} from 'lucide-react';
import { API_BASE } from '../apiConfig';
import IntelligenceBridge from '../components/IntelligenceBridge';
import { Capacitor } from '@capacitor/core';


const isRecent = (dateString) => {
  if (!dateString) return false;
  const diffTime = Date.now() - new Date(dateString).getTime();
  return diffTime < (24 * 60 * 60 * 1000); 
};

const isOlderThan7Days = (dateString) => {
  if (!dateString) return false;
  const diffTime = Date.now() - new Date(dateString).getTime();
  return diffTime > (7 * 24 * 60 * 60 * 1000);
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
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
    }}>
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ 
          background: 'rgba(13, 13, 13, 0.95)', padding: '28px', borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)', width: '90%', maxWidth: '420px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>{title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose} 
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: '600', cursor: 'pointer' }}
          >Cancel</button>
          <button 
            onClick={() => { onConfirm(); onClose(); }} 
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#e11d48', color: 'white', fontWeight: '600', cursor: 'pointer' }}
          >Confirm Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

const PromptModal = ({ isOpen, onClose, onSubmit, title, label, placeholder }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
    }}>
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ 
          background: 'rgba(13, 13, 13, 0.95)', padding: '28px', borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)', width: '90%', maxWidth: '420px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>{title}</h2>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '8px' }}>{label.toUpperCase()}</label>
          <input 
            autoFocus
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') { onSubmit(value); onClose(); } }}
            placeholder={placeholder}
            style={{ 
              width: '100%', padding: '12px 14px', fontSize: '0.9rem', 
              background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', 
              borderRadius: '8px', color: '#FFFFFF', outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose} 
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: '600', cursor: 'pointer' }}
          >Cancel</button>
          <button 
            onClick={() => { onSubmit(value); onClose(); }} 
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}
          >Initialize</button>
        </div>
      </motion.div>
    </div>
  );
};

const ForgeModal = ({ isOpen, onClose, context, onDispatch }) => {
  const [url, setUrl] = useState('https://');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

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
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
    }}>
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        style={{ 
          background: 'rgba(13, 13, 13, 0.95)', padding: '28px', borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)', width: '90%', maxWidth: '460px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} className="text-primary" /> Forge Universal Bridge
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.4' }}>
          Bridge your intelligence to any destination. Enter the URL of your target AI platform.
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '8px' }}>TARGET AI HUD URL</label>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            style={{ 
              width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.2)', border: error ? '1px solid #fb7185' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none'
            }}
            placeholder="https://poe.com"
          />
          {error && <div style={{ color: '#fb7185', fontSize: '0.75rem', marginTop: '6px', fontWeight: 'bold' }}>{error}</div>}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: '600', cursor: 'pointer' }}
          >Cancel</button>
          <button 
            onClick={handleValidateAndDispatch}
            style={{ flex: 2, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}
          >Forge Bridge &amp; Dispatch</button>
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
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(ctx.title);
  const [editSummary, setEditSummary] = useState(ctx.summary);
  const [editChatLog, setEditChatLog] = useState(ctx.chat_log || ctx.chatLog || '');

  const exportRef = useRef(null);
  const projectMenuRef = useRef(null);

  useEffect(() => {
    setEditTitle(ctx.title || '');
    setEditSummary(ctx.summary || '');
    setEditChatLog(ctx.chat_log || ctx.chatLog || '');
  }, [ctx]);

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bridge/${ctx.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, summary: editSummary, chat_log: editChatLog })
      });
      if (res.ok) {
        triggerToast('Vault item successfully updated.');
        setIsEditing(false);
        loadData();
      } else {
        triggerToast('Failed to save changes.');
      }
    } catch (err) {
      triggerToast('Network error: Update failed.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExport(false);
      }
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target)) {
        setShowProjectMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      const response = await fetch(`${API_BASE}/api/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_log: ctx.chat_log || ctx.chatLog || ctx.summary })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      let summary = data.summary;

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

  const handleEditRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch(`${API_BASE}/api/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_log: editChatLog || editSummary || ctx.chat_log || ctx.chatLog || '' })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      setEditSummary(data.summary);
      triggerToast('Intelligence draft re-distilled.');
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

  if (isEditing) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          padding: '24px', 
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderLeft: '4px solid var(--primary)', 
          background: 'rgba(18, 18, 18, 0.95)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <h4 style={{ margin: '0 0 16px 0', color: 'white', fontSize: '1rem', fontWeight: 800 }}>Edit Intelligence Card</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.5px' }}>CARD TITLE</label>
            <input 
              type="text" 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)} 
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', padding: '10px 14px', borderRadius: '8px', width: '100%', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.5px' }}>SMART SUMMARY</label>
            <textarea 
              value={editSummary} 
              onChange={e => setEditSummary(e.target.value)} 
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', padding: '10px 14px', borderRadius: '8px', width: '100%', height: '120px', fontSize: '0.85rem', outline: 'none', resize: 'vertical', lineHeight: '1.5' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.5px' }}>RAW CHAT LOG</label>
            <textarea 
              value={editChatLog} 
              onChange={e => setEditChatLog(e.target.value)} 
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '10px 14px', borderRadius: '8px', width: '100%', height: '160px', fontSize: '0.8rem', outline: 'none', resize: 'vertical', fontFamily: 'monospace', lineHeight: '1.4' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleSaveEdit} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Save Changes</button>
          
          <button 
            onClick={handleEditRegenerate} 
            disabled={isRegenerating}
            style={{ 
              background: 'rgba(222, 106, 57, 0.1)', 
              border: '1px solid rgba(222, 106, 57, 0.3)', 
              color: 'var(--primary)', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              fontSize: '0.8rem', 
              cursor: 'pointer', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(222, 106, 57, 0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(222, 106, 57, 0.1)'; }}
          >
            <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
            {isRegenerating ? 'Re-distilling...' : 'Re-distill Summary'}
          </button>

          <button 
            onClick={() => { 
              setIsEditing(false); 
              setEditTitle(ctx.title || ''); 
              setEditSummary(ctx.summary || ''); 
              setEditChatLog(ctx.chat_log || ctx.chatLog || ''); 
            }} 
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, borderColor: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)' }}
      style={{ 
        padding: '24px', 
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)', 
        borderLeft: '4px solid var(--primary)', 
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', 
        background: 'rgba(13, 13, 13, 0.7)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(222, 106, 57, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              {(ctx.source || 'Manual')}
            </span>
            <div 
              onMouseEnter={() => setShowSecurityTooltip(true)}
              onMouseLeave={() => setShowSecurityTooltip(false)}
              style={{ position: 'relative', cursor: 'help' }}
            >
              <span style={{ 
                fontSize: '0.65rem', fontWeight: '800', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', 
                background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}>
                <span>🔒 SECURE</span>
              </span>
              {showSecurityTooltip && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                  background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(16, 185, 129, 0.3)', color: '#E2E8F0',
                  borderRadius: '12px', padding: '14px', zIndex: 1000, width: '260px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)', fontSize: '0.78rem', lineHeight: '1.4'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '6px' }}>
                    Sovereign Privacy Shield
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px', listStyleType: 'disc' }}>
                    <li><strong>Zero Password Logging:</strong> We never capture passwords.</li>
                    <li><strong>Local Storage:</strong> Encrypted locally in your browser context.</li>
                    <li><strong>On-Demand Sync:</strong> Synchronization triggers only upon your explicit action.</li>
                    <li><strong>TLS 1.3 Transmission:</strong> Fully encrypted channel.</li>
                  </ul>
                </div>
              )}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>{formatTime(ctx.created_at)}</span>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '-0.01em', wordBreak: 'break-word' }}>{ctx.title}</h3>
        </div>

        {/* Unified sleek Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button 
            onClick={() => setIsEditing(true)} 
            style={{ 
              width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' 
            }} 
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            title="Edit Log"
          >
            <Edit2 size={13} />
          </button>

          <div ref={projectMenuRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowProjectMenu(!showProjectMenu)} 
              style={{ 
                width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' 
              }} 
              onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              title="Assign to Folder"
            >
              <Folder size={13} />
            </button>
            {showProjectMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0,
                background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '6px', zIndex: 100, minWidth: '180px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', padding: '6px 8px', letterSpacing: '0.5px' }}>MOVE TO PROJECT</div>
                <button 
                  onClick={() => handleMoveToProject(null)}
                  style={{ 
                    display: 'flex', width: '100%', background: 'transparent', border: 'none',
                    color: 'rgba(255,255,255,0.5)', padding: '8px 10px', textAlign: 'left', cursor: 'pointer',
                    borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500'
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
                      color: ctx.project_id === p.id ? 'var(--primary)' : 'white', padding: '8px 10px', textAlign: 'left', cursor: 'pointer',
                      borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500'
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

          <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 4px' }} />

          <button 
            onClick={() => onDelete(ctx.id)} 
            style={{ 
              width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(244,63,94,0.03)', 
              border: '1px solid rgba(244,63,94,0.1)', color: 'rgba(244,63,94,0.7)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' 
            }} 
            onMouseEnter={e => { e.currentTarget.style.color = '#ff4b6b'; e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.borderColor = '#ff4b6b'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(244,63,94,0.7)'; e.currentTarget.style.background = 'rgba(244,63,94,0.03)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.1)'; }}
            title="Delete Bridge"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Smart Summary Box */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.01)', padding: '16px', borderRadius: '12px', 
        fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.65', 
        marginBottom: '16px', border: '1px solid rgba(255, 255, 255, 0.04)'
      }}>
        <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', letterSpacing: '0.5px', color: 'rgba(255, 255, 255, 0.9)' }}>
            <Zap size={13} color="var(--primary)" /> Smart Summary
          </div>
          {ctx.summary && ctx.summary.length > 200 && (
            <button 
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
            >
              {isSummaryExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <div style={{ whiteSpace: 'pre-wrap', color: 'rgba(255, 255, 255, 0.6)' }}>
          {ctx.summary && ctx.summary.length > 200 && !isSummaryExpanded 
            ? `${ctx.summary.substring(0, 200)}...` 
            : ctx.summary}
        </div>
      </div>

      {optimizedPrompt && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: '16px' }}>
          <div style={{ 
            background: 'rgba(139, 92, 246, 0.03)', padding: '16px', borderRadius: '12px', 
            border: '1px solid rgba(139, 92, 246, 0.15)', position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#a78bfa', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wand2 size={12} /> OPTIMIZED INTELLIGENCE CORE
              </span>
              <button 
                onClick={() => copyToClipboard(optimizedPrompt, 'Optimized prompt copied!')}
                style={{ fontSize: '0.7rem', background: '#7C3AED', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
              >Copy Core</button>
            </div>
            <pre style={{ 
              fontSize: '0.85rem', color: '#e2e8f0', margin: 0, whiteSpace: 'pre-wrap', 
              fontFamily: 'inherit', lineHeight: '1.5'
            }}>{optimizedPrompt}</pre>
          </div>
        </motion.div>
      )}

      {showRaw && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '16px' }}>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '12px', 
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>RAW CHAT CONTEXT</span>
              <button 
                onClick={() => copyToClipboard(ctx.chat_log, 'Full chat log copied!')}
                style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', color: 'white', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}
              >Copy Log</button>
            </div>
            <pre style={{ 
              fontSize: '0.8rem', color: '#94a3b8', margin: 0, 
              whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: '240px', overflowY: 'auto' 
            }}>{ctx.chat_log}</pre>
          </div>
        </motion.div>
      )}

      {/* Sync bar (Low opacity platform buttons, highlight on hover) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', paddingRight: '76px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginRight: '4px' }}>Sync:</span>
        {[
          { name: 'Gemini',    url: 'https://gemini.google.com/app',  color: '#4285F4', icon: <Zap size={12} /> },
          { name: 'Claude',    url: 'https://claude.ai/chats',        color: '#D97757', icon: <Cpu size={12} /> },
          { name: 'ChatGPT',   url: 'https://chatgpt.com',           color: '#10A37F', icon: <Code size={12} /> },
          { name: 'Perplexity', url: 'https://perplexity.ai',        color: '#20B2AA', icon: <Search size={12} /> },
          { name: 'DeepSeek',  url: 'https://chat.deepseek.com',     color: '#60a5fa', icon: <Target size={12} /> },
          { name: 'Mistral',   url: 'https://chat.mistral.ai',       color: '#f97316', icon: <Activity size={12} /> },
          { name: 'Poe',       url: 'https://poe.com',               color: '#8b5cf6', icon: <Globe size={12} /> },
        ].map(plat => (
          <button 
            key={plat.name}
            onClick={() => {
              const finalContext = ctx.chat_log || ctx.chatLog || ctx.summary || '';
              window.dispatchEvent(new CustomEvent('BRIDGE_SEND_TO_STORAGE', { detail: { context: finalContext } }));
              copyToClipboard(finalContext, `${plat.name} Context Prepared!`);
              window.open(plat.url, '_blank');
            }}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '500',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '100px',
              color: 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1) translateY(0)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = `${plat.color}18`;
              e.currentTarget.style.borderColor = plat.color;
              e.currentTarget.style.boxShadow = `0 4px 15px ${plat.color}25, 0 0 8px ${plat.color}15`;
              e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
            }}
          >
            {React.cloneElement(plat.icon, { size: 12, color: 'currentColor' })}
            {plat.name}
          </button>
        ))}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div ref={exportRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowExport(v => !v)}
              style={{ 
                fontSize: '0.75rem', padding: '6px 14px', borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
                color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: '0.2s',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              <Settings size={12} /> Actions <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>▼</span>
            </button>
            {showExport && (
              <div style={{
                position: 'absolute', bottom: '110%', left: 0,
                background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '6px', zIndex: 100, minWidth: '190px',
                boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <button 
                  onClick={() => { handleOptimize(); setShowExport(false); }}
                  disabled={isOptimizing}
                  style={{ 
                    display: 'flex', width: '100%', background: 'transparent', border: 'none',
                    color: 'white', padding: '8px 10px', textAlign: 'left', cursor: 'pointer',
                    borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500',
                    transition: 'background 0.2s', alignItems: 'center', gap: '8px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <Wand2 size={14} className={isOptimizing ? 'animate-spin' : ''} />
                  {isOptimizing ? 'Optimizing...' : 'Optimize Prompt'}
                </button>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

                <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', padding: '2px 10px 4px 10px', letterSpacing: '0.5px' }}>EXPORT OPTIONS</div>

                {[
                  { fmt: 'markdown', label: 'Export as Markdown (.md)', icon: <FileText size={14} /> },
                  { fmt: 'json',     label: 'Export as JSON (.json)', icon: <Database size={14} /> },
                  { fmt: 'prompt',   label: 'Export as Prompt Pack (.txt)', icon: <Zap size={14} /> },
                ].map(({ fmt, label, icon }) => (
                  <button 
                    key={fmt} 
                    onClick={() => { exportBridge(ctx, fmt); setShowExport(false); }}
                    style={{ 
                      display: 'flex', width: '100%', background: 'transparent', border: 'none',
                      color: 'white', padding: '8px 10px', textAlign: 'left', cursor: 'pointer',
                      borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500',
                      transition: 'background 0.2s', alignItems: 'center', gap: '8px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
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
            style={{ 
              fontSize: '0.75rem', padding: '6px 14px', borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: '0.2s',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            {showRaw ? <EyeOff size={12} /> : <Eye size={12} />} 
            {showRaw ? 'Hide Log' : 'View Log'}
          </button>
        </div>

        <button 
          onClick={() => onForge(ctx, optimizedPrompt || ctx.summary)}
          style={{ 
            padding: '8px 18px', fontSize: '0.75rem', fontWeight: '600',
            borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
            border: 'none', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #ff8038 100%)',
            color: '#ffffff', 
            cursor: 'pointer', 
            boxShadow: '0 0 12px rgba(222, 106, 57, 0.35)',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(222, 106, 57, 0.6)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(222, 106, 57, 0.35)';
          }}
        >
          <Globe size={12} /> Forge Universal Bridge
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Reusable Export Helper ─────────────────────────────────────── */
const exportBridge = (ctx, format) => {
  let content, filename, type;
  const log = ctx.chat_log || ctx.chatLog || '';
  const safeTitle = (ctx.title || 'bridge-export').replace(/[\s\W]+/g, '-').toLowerCase();

  if (format === 'markdown') {
    content = `# ${ctx.title || 'Export'}\n**Source:** ${ctx.source || 'Unknown'}  \n**Date:** ${ctx.created_at || new Date().toISOString()}\n\n## Summary\n${ctx.summary || ''}\n\n## Full Log\n${log}`;
    filename = `${safeTitle}.md`;
    type = 'text/markdown';
  } else if (format === 'json') {
    // Include all data properly as requested
    content = JSON.stringify({ ...ctx, chat_log: log }, null, 2);
    filename = `${safeTitle}.json`;
    type = 'application/json';
  } else {
    content = `Act as an expert assistant. Continue working based on the following context:\n\n${ctx.summary || ''}\n\nPlease confirm you understand and ask for the next task.`;
    filename = `${safeTitle}-prompt.txt`;
    type = 'text/plain';
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  
  // Appending to body is required for downloads to work properly in some extension environments
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
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
    whileHover={{ x: 4, background: 'rgba(255, 255, 255, 0.03)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{ 
      width: '100%',
      background: active ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
      padding: '10px 14px', 
      borderRadius: '10px', 
      color: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)',
      border: '1px solid', 
      borderColor: active ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
      textAlign: 'left', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      transition: 'all 0.2s ease', 
      position: 'relative'
    }}
  >
    {active && (
      <div 
        style={{ 
          position: 'absolute', left: '0', top: '25%', bottom: '25%', width: '3px', 
          background: 'var(--primary)', borderRadius: '0 2px 2px 0'
        }} 
      />
    )}
    <div style={{ color: active ? 'var(--primary)' : 'currentColor', display: 'flex', alignItems: 'center', transition: '0.2s' }}>
      {React.cloneElement(icon, { size: 16, strokeWidth: active ? 2 : 1.5 })}
    </div>
    <span style={{ fontSize: '0.85rem', fontWeight: active ? '600' : '500', transition: '0.2s' }}>{label}</span>
    {count !== undefined && (
      <div style={{ marginLeft: 'auto', background: active ? 'rgba(222, 106, 57, 0.15)' : 'rgba(255, 255, 255, 0.04)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '600', color: active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.4)' }}>
        {count}
      </div>
    )}
    {status && (
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700' }}>{status}</span>
      </div>
    )}
  </motion.button>
);

const ProjectWorkspace = ({ 
  projectId,
  userEmail,
  projects, 
  bridges, 
  filteredBridges, 
  recentBridges, 
  olderBridges, 
  stats, 
  triggerToast, 
  loadData, 
  setConfirmModal, 
  handleForge, 
  setActiveProject 
}) => {
  const [projectTab, setProjectTab] = useState('logs'); // 'logs' | 'memory' | 'decisions' | 'chat'
  
  const [techStack, setTechStack] = useState('');
  const [goals, setGoals] = useState('');
  const [rules, setRules] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [loadingContext, setLoadingContext] = useState(false);
  const [savingContext, setSavingContext] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const [decisions, setDecisions] = useState([]);
  
  // Decision Elaboration States
  const [elaboratingDecision, setElaboratingDecision] = useState(null);
  const [aiElaboration, setAiElaboration] = useState('');
  const [loadingElaboration, setLoadingElaboration] = useState(false);
  const [loadingDecisions, setLoadingDecisions] = useState(false);
  const [showDecModal, setShowDecModal] = useState(false);
  const [decTitle, setDecTitle] = useState('');
  const [decType, setDecType] = useState('accepted');
  const [decRationale, setDecRationale] = useState('');
  const [decAlternatives, setDecAlternatives] = useState('');
  const [savingDecision, setSavingDecision] = useState(false);

  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsChatSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [chatInput, setChatInput] = useState('');
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: `Hello! I am your Project Memory Assistant. I have indexed your tech stack, goals, rules, and decision history for this project. Ask me any questions, generate system prompts, or request onboarding docs!` }
  ]);
  const [sendingChat, setSendingChat] = useState(false);
  const chatContainerRef = useRef(null);

  // Use email from props (passed from Dashboard) so it's reactive across login/logout cycles
  const email = userEmail || '';

  // Scroll to bottom of chat (container only, no page scrolling)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Load context and decisions on project/tab changes
  // Re-fetch whenever email or projectId changes (handles login/logout cycles)
  useEffect(() => {
    if (!email || !projectId) return;
    fetchContext();
    fetchChatSessions();
  }, [projectId, email]);

  useEffect(() => {
    if (!email || !projectId) return;
    if (projectTab === 'decisions') {
      fetchDecisions();
    }
  }, [projectId, projectTab, email]);

  const fetchContext = async () => {
    setLoadingContext(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/context?email=${email}&project_id=${encodeURIComponent(projectId)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setTechStack(data.data.tech_stack || '');
        setGoals(data.data.goals || '');
        setRules(data.data.rules || '');
        setProblemStatement(data.data.problem_statement || '');
      }
    } catch (err) {
      triggerToast('Error loading project context.');
    } finally {
      setLoadingContext(false);
    }
  };

  const fetchChatSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/chats?email=${email}&project_id=${encodeURIComponent(projectId)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setChatSessions(data.data);
        // Always start on a fresh new chat after page load/refresh
        // Previous sessions are accessible in the sidebar
        setActiveSessionId(null);
        setChatHistory([
          { role: 'assistant', text: `Hello! I am your Project Memory Assistant. I have indexed your tech stack, goals, rules, and decision history for "${projectId}". Ask me any questions, generate system prompts, or request onboarding docs!` }
        ]);
      }
    } catch (err) {
      console.error("Error fetching chat sessions:", err);
    }
  };

  const saveContext = async () => {
    setSavingContext(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          project_id: projectId,
          tech_stack: techStack,
          goals,
          rules,
          problem_statement: problemStatement
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Project Memory Layer updated successfully!');
      } else {
        triggerToast('Error saving context.');
      }
    } catch (err) {
      triggerToast('Failed to connect to backend.');
    } finally {
      setSavingContext(false);
    }
  };

  const compileMemory = async () => {
    if (filteredBridges.length === 0) {
      triggerToast('Add conversation bridges to this project first.');
      return;
    }
    setIsCompiling(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, project_id: projectId })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTechStack(data.data.tech_stack || '');
        setGoals(data.data.goals || '');
        setRules(data.data.rules || '');
        setProblemStatement(data.data.problem_statement || '');
        fetchDecisions(); // Fetch updated decisions compiled by AI
        triggerToast('AI Distillation Complete: Memory Layer synthesized!');
      } else {
        triggerToast(data.error || 'Compilation failed.');
      }
    } catch (err) {
      triggerToast('Could not compile memory layer.');
    } finally {
      setIsCompiling(false);
    }
  };

  const fetchDecisions = async () => {
    setLoadingDecisions(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/decisions?email=${email}&project_id=${encodeURIComponent(projectId)}`);
      const data = await res.json();
      if (data.success) {
        setDecisions(data.data || []);
      }
    } catch (err) {
      triggerToast('Error loading decision ledger.');
    } finally {
      setLoadingDecisions(false);
    }
  };

  const createDecision = async (e) => {
    e.preventDefault();
    if (!decTitle.trim()) return;
    setSavingDecision(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          project_id: projectId,
          decision_type: decType,
          title: decTitle,
          rationale: decRationale,
          alternatives: decAlternatives
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Decision logged in Ledger.');
        setDecTitle('');
        setDecRationale('');
        setDecAlternatives('');
        setShowDecModal(false);
        fetchDecisions();
      }
    } catch (err) {
      triggerToast('Error logging decision.');
    } finally {
      setSavingDecision(false);
    }
  };

  const deleteDecision = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/decisions/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Decision removed.');
        fetchDecisions();
      }
    } catch (err) {
      triggerToast('Could not delete decision.');
    }
  };

  const handleElaborateDecision = async (decision) => {
    setElaboratingDecision(decision);
    setAiElaboration('');
    setLoadingElaboration(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/decisions/elaborate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          project_id: projectId,
          title: decision.title,
          decision_type: decision.decision_type,
          rationale: decision.rationale,
          alternatives: decision.alternatives
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiElaboration(data.elaboration);
      } else {
        setAiElaboration('Failed to generate elaboration: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setAiElaboration('Failed to generate elaboration: ' + err.message);
    } finally {
      setLoadingElaboration(false);
    }
  };

  const moveDecisionToChat = async (decision, elaborationText) => {
    setElaboratingDecision(null);
    setProjectTab('chat');
    
    const statusLabel = decision.decision_type === 'accepted' ? 'Accepted Decision' : 
                        decision.decision_type === 'rejected' ? 'Rejected Option' : 'Open Question';
    
    let promptText = `Let's discuss the project context regarding the ${statusLabel}: "${decision.title}".
    
- **Rationale**: ${decision.rationale || 'None provided'}
- **Alternatives/Options Considered**: ${decision.alternatives || 'None provided'}

`;

    if (elaborationText && !elaborationText.startsWith('Failed to')) {
      promptText += `AI Elaboration & Analysis:\n${elaborationText}\n\n`;
    }
    
    promptText += `Let's analyze this decision in detail: what are the next concrete implementation steps, risk mitigations, or things we should watch out for?`;

    setTimeout(() => {
      setChatInput(promptText);
      triggerProgrammaticChatSend(promptText);
    }, 200);
  };

  const triggerProgrammaticChatSend = async (messageText) => {
    if (!messageText.trim() || sendingChat) return;
    setSendingChat(true);
    const userMsgObj = { role: 'user', text: messageText };
    const updatedWithUser = [...chatHistory, userMsgObj];
    setChatHistory(updatedWithUser);
    
    let currentSessionId = activeSessionId;
    let title = 'New Chat';
    if (!currentSessionId) {
      currentSessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      setActiveSessionId(currentSessionId);
      title = messageText.length > 35 ? messageText.substring(0, 35).replace(/\n/g, ' ') + '...' : messageText.replace(/\n/g, ' ');
    } else {
      const existingSession = chatSessions.find(s => s.id === currentSessionId);
      if (existingSession) {
        title = existingSession.title || 'New Chat';
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/projects/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          project_id: projectId,
          message: messageText,
          history: chatHistory
        })
      });
      const data = await res.json();
      if (data.success) {
        const updatedWithAssistant = [...updatedWithUser, { role: 'assistant', text: data.text }];
        setChatHistory(updatedWithAssistant);
        await saveChatSessionToServer(currentSessionId, title, updatedWithAssistant);
      } else {
        const errorMsg = "Error: " + (data.error || 'Failed to query memory assistant.');
        const updatedWithError = [...updatedWithUser, { role: 'assistant', text: errorMsg }];
        setChatHistory(updatedWithError);
        await saveChatSessionToServer(currentSessionId, title, updatedWithError);
      }
    } catch (err) {
      const updatedWithFail = [...updatedWithUser, { role: 'assistant', text: 'Error connecting to the orchestrator: ' + err.message }];
      setChatHistory(updatedWithFail);
      await saveChatSessionToServer(currentSessionId, title, updatedWithFail);
    } finally {
      setSendingChat(false);
      setChatInput('');
    }
  };

  const saveChatSessionToServer = async (sessionId, title, messagesList) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sessionId,
          email,
          project_id: projectId,
          title,
          messages: messagesList
        })
      });
      const data = await res.json();
      if (data.success) {
        const listRes = await fetch(`${API_BASE}/api/projects/chats?email=${email}&project_id=${encodeURIComponent(projectId)}`);
        const listData = await listRes.json();
        if (listData.success && listData.data) {
          setChatSessions(listData.data);
        }
      }
    } catch (err) {
      console.error("Failed to save chat session on server:", err);
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setChatHistory([
      { role: 'assistant', text: `Hello! I am your Project Memory Assistant. I have indexed your tech stack, goals, rules, and decision history for "${projectId}". Ask me any questions, generate system prompts, or request onboarding docs!` }
    ]);
    if (isMobile) setIsChatSidebarOpen(false);
  };

  const selectChatSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      setChatHistory(session.messages || []);
    }
    if (isMobile) setIsChatSidebarOpen(false);
  };

  const deleteChatSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/api/projects/chats/${sessionId}?email=${email}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Conversation deleted.');
        const updated = chatSessions.filter(s => s.id !== sessionId);
        setChatSessions(updated);
        if (activeSessionId === sessionId) {
          if (updated.length > 0) {
            setActiveSessionId(updated[0].id);
            setChatHistory(updated[0].messages || []);
          } else {
            startNewChat();
          }
        }
      }
    } catch (err) {
      triggerToast('Could not delete conversation.');
    }
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingChat) return;
    const userMessage = chatInput;
    setChatInput('');
    await triggerProgrammaticChatSend(userMessage);
  };

  const renderTabNavigation = () => {
    const tabs = [
      { id: 'logs',      label: 'Saved Chats',      icon: <Layers size={14} /> },
      { id: 'memory',    label: 'Problem & Rules',    icon: <BookOpen size={14} /> },
      { id: 'decisions', label: 'Decisions Made',   icon: <Settings size={14} /> },
      { id: 'chat',      label: 'AI Assistant',     icon: <MessageSquare size={14} /> },
    ];

    return (
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
        {tabs.map(t => {
          const isActive = projectTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setProjectTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px',
                background: isActive ? 'rgba(222, 106, 57, 0.12)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(222, 106, 57, 0.25)' : 'transparent'}`,
                color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                fontWeight: isActive ? '700' : '500', cursor: 'pointer', transition: 'all 0.25s',
                fontSize: '0.85rem'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
    );
  };

  const acceptedDecisions = decisions.filter(d => d.decision_type === 'accepted');
  const rejectedDecisions = decisions.filter(d => d.decision_type === 'rejected');
  const openQuestions = decisions.filter(d => d.decision_type === 'open');

  return (
    <div>
      {/* Project Header Banner */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '28px 32px', borderRadius: '24px', background: 'rgba(13, 13, 13, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <button 
                onClick={() => setActiveProject(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', padding: 0 }}
              >
                {"\u2190"} Back to Sectors
              </button>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: '1px' }}>PROJECT VAULT</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0, maxWidth: '100%', wordBreak: 'normal', overflowWrap: 'break-word' }}>
              {projects.find(p => p.id === projectId)?.name || projectId}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px', margin: '4px 0 0 0', wordBreak: 'normal', overflowWrap: 'break-word', lineHeight: '1.4' }}>
              Aggregate and scale organizational context for Humans, AIs, and agents.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
            <button 
              onClick={compileMemory}
              disabled={isCompiling}
              className="btn-primary" 
              style={{ padding: '12px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #DE6A39, #7C3AED)', border: 'none' }}
            >
              <RefreshCw size={14} className={isCompiling ? 'ldBlink' : ''} />
              {isCompiling ? 'AI Synthesizing...' : '✨ Compile Memory with AI'}
            </button>
          </div>
        </div>
      </div>

      {renderTabNavigation()}
      
      {/* 📂 SESSION LOGS */}
      {projectTab === 'logs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          {/* Quickstart Feature Highlight Grid */}
          <div style={{ marginBottom: '32px' }}>
            {/* If memory layer is empty and there are bridges, show a call-to-action banner to compile */}
            {!techStack && !goals && !rules && !problemStatement && filteredBridges.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(222,106,57,0.1) 0%, rgba(124,58,237,0.06) 100%)',
                border: '1px solid rgba(222,106,57,0.25)',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 0 20px rgba(222,106,57,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 300px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#fff' }}>Synthesize Project Profile with AI</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Automatically extract your tech stack, objectives, architecture rules, and decisions from your saved chat logs.
                    </p>
                  </div>
                </div>
                <button
                  onClick={compileMemory}
                  disabled={isCompiling}
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: 'none',
                    flexShrink: 0
                  }}
                >
                  <RefreshCw size={14} className={isCompiling ? 'animate-spin' : ''} />
                  {isCompiling ? 'Synthesizing...' : '✨ Compile Profile Now'}
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Zap size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
                Workspace Intelligence Engine
              </span>
            </div>

            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              
              {/* Feature 1: Memory Layer */}
              <div 
                onClick={() => setProjectTab('memory')}
                style={{
                  background: 'rgba(13, 13, 13, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(222, 106, 57, 0.3)';
                  e.currentTarget.style.background = 'rgba(222, 106, 57, 0.02)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.background = 'rgba(13, 13, 13, 0.45)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(222, 106, 57, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <BookOpen size={18} />
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px',
                    background: (techStack || goals || rules || problemStatement) ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                    color: (techStack || goals || rules || problemStatement) ? '#34d399' : 'var(--text-muted)',
                    textTransform: 'uppercase'
                  }}>
                    {(techStack || goals || rules || problemStatement) ? '✓ Configured' : '○ Empty'}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '800', color: '#fff' }}>Problem &amp; Rules</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Keep track of code guidelines, constraints, and technologies. Inject context layers dynamically.
                </p>
              </div>

              {/* Feature 2: Decision Ledger */}
              <div 
                onClick={() => setProjectTab('decisions')}
                style={{
                  background: 'rgba(13, 13, 13, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                  e.currentTarget.style.background = 'rgba(124, 58, 237, 0.02)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.background = 'rgba(13, 13, 13, 0.45)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                    <Settings size={18} />
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px',
                    background: decisions.length > 0 ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                    color: decisions.length > 0 ? '#c084fc' : 'var(--text-muted)',
                    textTransform: 'uppercase'
                  }}>
                    {decisions.length} Saved
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '800', color: '#fff' }}>Decision Ledger</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Document architectural and tech choices. Elaborate rationale into actionable checklists.
                </p>
              </div>

              {/* Feature 3: RAG AI Assistant */}
              <div 
                onClick={() => setProjectTab('chat')}
                style={{
                  background: 'rgba(13, 13, 13, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  e.currentTarget.style.background = 'rgba(6, 182, 212, 0.02)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.background = 'rgba(13, 13, 13, 0.45)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                    <MessageSquare size={18} />
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px',
                    background: chatSessions.length > 0 ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.04)',
                    color: chatSessions.length > 0 ? '#22d3ee' : 'var(--text-muted)',
                    textTransform: 'uppercase'
                  }}>
                    {chatSessions.length} Chats
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '800', color: '#fff' }}>Memory AI Assistant</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Query your consolidated project contexts, decisions, and history dynamically.
                </p>
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
              Showing <strong>{filteredBridges.length}</strong> conversation logs in this sector.
            </span>
          </div>

          {filteredBridges.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentBridges.map(ctx => (
                <BridgeCard 
                  key={ctx.id} 
                  ctx={{ ...ctx, onCopy: (msg) => triggerToast(msg || 'Copied!') }} 
                  onDelete={() => setConfirmModal({ isOpen: true, id: ctx.id })} 
                  onForge={handleForge} 
                  loadData={loadData}
                  stats={stats}
                  triggerToast={triggerToast}
                  projects={projects}
                />
              ))}
              {olderBridges.map(ctx => (
                <BridgeCard 
                  key={ctx.id} 
                  ctx={{ ...ctx, onCopy: (msg) => triggerToast(msg || 'Copied!') }} 
                  onDelete={() => setConfirmModal({ isOpen: true, id: ctx.id })} 
                  onForge={handleForge} 
                  loadData={loadData}
                  stats={stats}
                  triggerToast={triggerToast}
                  projects={projects}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.06)' }}>
              <Layers size={40} style={{ color: 'var(--primary)', opacity: 0.5, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '8px' }}>No Sessions in this Sector</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto 20px', fontSize: '0.85rem' }}>
                Paste context manually or use the browser extension to bridge conversation logs into this project vault.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* 🧠 MEMORY LAYER */}
      {projectTab === 'memory' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {loadingContext ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <RefreshCw size={24} className="ldBlink" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '0.85rem' }}>Retrieving active memory context...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(222, 106, 57, 0.02)', border: '1px solid rgba(222, 106, 57, 0.1)', marginBottom: '4px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={14} /> Problem Statement & Rules
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>
                  This section lists the core problem statement, tech tools, goals, and coding rules for your project. Click <strong>Compile Memory</strong> above to let the AI automatically fill these details using your saved chat logs.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>PROBLEM STATEMENT</label>
                <textarea
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="e.g. - Developers waste hours manually copy-pasting code context across AI models.&#10;- Need an automated, secure context sync solution to preserve development state."
                  style={{
                    height: '120px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.06)', color: 'white', fontFamily: 'monospace',
                    fontSize: '0.85rem', resize: 'vertical', outline: 'none'
                  }}
                />
              </div>

              <div className="grid-responsive-2" style={{ gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>TECH STACK</label>
                  <textarea
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g. - React 19&#10;- Node/Express&#10;- PostgreSQL"
                    style={{
                      height: '240px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.06)', color: 'white', fontFamily: 'monospace',
                      fontSize: '0.85rem', resize: 'vertical', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>PROJECT GOALS</label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="e.g. - Build scalable Auth engine&#10;- Optimize database index structures"
                    style={{
                      height: '240px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.06)', color: 'white', fontFamily: 'monospace',
                      fontSize: '0.85rem', resize: 'vertical', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>CODING RULES &amp; ARCHITECTURE</label>
                <textarea
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="e.g. - No styling utilities; use vanilla CSS tokens&#10;- Encrypt client credentials locally&#10;- Keep functions under 50 lines"
                  style={{
                    height: '160px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.06)', color: 'white', fontFamily: 'monospace',
                    fontSize: '0.85rem', resize: 'vertical', outline: 'none'
                  }}
                />
              </div>

              <div>
                <button
                  onClick={saveContext}
                  disabled={savingContext}
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '0.85rem', background: 'rgba(222, 106, 57, 0.1)', color: 'var(--primary)', border: '1px solid rgba(222, 106, 57, 0.3)' }}
                >
                  {savingContext ? 'Saving...' : 'Save Rules'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 📋 DECISION LEDGER */}
      {projectTab === 'decisions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
              Log decisions made, options you looked at, and questions still open.
            </span>
            <button
              onClick={() => setShowDecModal(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Save Decision
            </button>
          </div>

          {loadingDecisions ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <RefreshCw size={24} className="ldBlink" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '0.85rem' }}>Fetching decision ledger records...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '10px' }}>
              {/* Decisions Made Column */}
              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', height: '480px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#10b981', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  <CheckCircle2 size={12} /> DECISIONS MADE ({acceptedDecisions.length})
                </div>
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                  {acceptedDecisions.map(d => (
                    <div key={d.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(13,13,13,0.45)', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                      <button onClick={() => deleteDecision(d.id)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                        <Trash2 size={12} />
                      </button>
                      <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'white', paddingRight: '20px', lineHeight: '1.4' }}>{d.title}</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>{d.rationale}</p>
                      {d.alternatives && (
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px', marginTop: '4px' }}>
                          <strong>Alternatives:</strong> {d.alternatives}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <button
                          onClick={() => handleElaborateDecision(d)}
                          style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', padding: '4px 8px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        >
                          <Cpu size={10} /> Elaborate &amp; See
                        </button>
                      </div>
                    </div>
                  ))}
                  {acceptedDecisions.length === 0 && (
                    <div style={{ padding: '24px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontStyle: 'italic' }}>No decisions saved yet</div>
                  )}
                </div>
              </div>

              {/* Rejected Options Column */}
              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', height: '480px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#ef4444', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  <X size={12} /> REJECTED OPTIONS ({rejectedDecisions.length})
                </div>
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                  {rejectedDecisions.map(d => (
                    <div key={d.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(13,13,13,0.45)', border: '1px solid rgba(239, 68, 68, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                      <button onClick={() => deleteDecision(d.id)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                        <Trash2 size={12} />
                      </button>
                      <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'white', paddingRight: '20px', lineHeight: '1.4' }}>{d.title}</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>{d.rationale}</p>
                      {d.alternatives && (
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px', marginTop: '4px' }}>
                          <strong>Preferred Choice:</strong> {d.alternatives}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <button
                          onClick={() => handleElaborateDecision(d)}
                          style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', padding: '4px 8px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        >
                          <Cpu size={10} /> Elaborate &amp; See
                        </button>
                      </div>
                    </div>
                  ))}
                  {rejectedDecisions.length === 0 && (
                    <div style={{ padding: '24px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontStyle: 'italic' }}>No rejected options yet</div>
                  )}
                </div>
              </div>

              {/* Open Questions Column */}
              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', height: '480px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#f59e0b', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  <HelpCircleIcon size={12} /> OPEN QUESTIONS ({openQuestions.length})
                </div>
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                  {openQuestions.map(d => (
                    <div key={d.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(13,13,13,0.45)', border: '1px solid rgba(245, 158, 11, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                      <button onClick={() => deleteDecision(d.id)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                        <Trash2 size={12} />
                      </button>
                      <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'white', paddingRight: '20px', lineHeight: '1.4' }}>{d.title}</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>{d.rationale}</p>
                      {d.alternatives && (
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.3)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px', marginTop: '4px' }}>
                          <strong>Options Considered:</strong> {d.alternatives}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <button
                          onClick={() => handleElaborateDecision(d)}
                          style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', padding: '4px 8px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        >
                          <Cpu size={10} /> Elaborate &amp; See
                        </button>
                      </div>
                    </div>
                  ))}
                  {openQuestions.length === 0 && (
                    <div style={{ padding: '24px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.75rem', fontStyle: 'italic' }}>No pending questions</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showDecModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(6px)' }}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ width: '90%', maxWidth: '460px', background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px', boxShadow: '0 24px 50px rgba(0,0,0,0.6)' }}>
                <h3 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '1.25rem', fontWeight: 800 }}>Save a Project Decision</h3>
                
                <form onSubmit={createDecision} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.5px' }}>DECISION TITLE</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Use PostgreSQL for Session Ledger"
                      value={decTitle}
                      onChange={(e) => setDecTitle(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.5px' }}>DECISION STATUS</label>
                    <select
                      value={decType}
                      onChange={(e) => setDecType(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', outline: 'none' }}
                    >
                      <option value="accepted">Accepted Decision</option>
                      <option value="rejected">Rejected Option</option>
                      <option value="open">Open Question</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.5px' }}>RATIONALE &amp; DESCRIPTION</label>
                    <textarea
                      required
                      placeholder="Why was this chosen? What criteria did it meet? E.g., Neon Postgres provides instant branching..."
                      value={decRationale}
                      onChange={(e) => setDecRationale(e.target.value)}
                      style={{ height: '80px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.5px' }}>ALTERNATIVES CONSIDERED</label>
                    <input
                      type="text"
                      placeholder="e.g. SQLite, MongoDB (comma separated)"
                      value={decAlternatives}
                      onChange={(e) => setDecAlternatives(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                    <button type="button" onClick={() => setShowDecModal(false)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={savingDecision} className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                      {savingDecision ? 'Saving...' : 'Save Decision'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {elaboratingDecision && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(6px)' }}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ width: '90%', maxWidth: '640px', background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 24px 50px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ 
                      fontSize: '0.65rem', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', marginRight: '8px',
                      background: elaboratingDecision.decision_type === 'accepted' ? 'rgba(16, 185, 129, 0.15)' : elaboratingDecision.decision_type === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: elaboratingDecision.decision_type === 'accepted' ? '#10b981' : elaboratingDecision.decision_type === 'rejected' ? '#ef4444' : '#f59e0b'
                    }}>
                      {elaboratingDecision.decision_type === 'accepted' ? 'ACCEPTED DECISION' : elaboratingDecision.decision_type === 'rejected' ? 'REJECTED OPTION' : 'OPEN QUESTION'}
                    </span>
                    <h3 style={{ margin: '8px 0 0 0', color: 'white', fontSize: '1.25rem', fontWeight: 800 }}>{elaboratingDecision.title}</h3>
                  </div>
                  <button onClick={() => setElaboratingDecision(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}>
                    &times;
                  </button>
                </div>

                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                      <strong>Rationale:</strong> {elaboratingDecision.rationale || 'None provided'}
                    </div>
                    {elaboratingDecision.alternatives && (
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px', marginTop: '4px' }}>
                        <strong>Alternatives/Preferred Options:</strong> {elaboratingDecision.alternatives}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Cpu size={14} /> AI Architectural Elaboration
                    </h4>
                    
                    {loadingElaboration ? (
                      <div style={{ padding: '32px 0', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                        <RefreshCw size={20} className="ldBlink" style={{ marginBottom: '8px' }} />
                        <p style={{ fontSize: '0.78rem', margin: 0 }}>Architect is analyzing rules &amp; context to elaborate...</p>
                      </div>
                    ) : (
                      <div style={{ 
                        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px',
                        fontSize: '0.85rem', color: '#E2E8F0', lineHeight: '1.6', overflowX: 'auto'
                      }}>
                        {aiElaboration ? parseMarkdownToJSX(aiElaboration) : 'No elaboration generated.'}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                  <button onClick={() => setElaboratingDecision(null)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Close
                  </button>
                  <button 
                    onClick={() => moveDecisionToChat(elaboratingDecision, aiElaboration)} 
                    disabled={loadingElaboration}
                    className="btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    💬 Discuss in Chatbot
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}

      {projectTab === 'chat' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '520px', borderRadius: '16px', background: 'rgba(13,13,13,0.45)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
            {/* Header Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)', zIndex: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  type="button"
                  onClick={() => setIsChatSidebarOpen(!isChatSidebarOpen)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  title={isChatSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  {isChatSidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '7px',
                    background: 'linear-gradient(135deg, #7C3AED, #DE6A39)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/>
                      <circle cx="9" cy="14" r="1.2" fill="white" stroke="none"/>
                      <circle cx="15" cy="14" r="1.2" fill="white" stroke="none"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>AI Memory Assistant</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
              {/* Overlay Backdrop for Mobile */}
              {isMobile && isChatSidebarOpen && (
                <div 
                  onClick={() => setIsChatSidebarOpen(false)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 9,
                    cursor: 'pointer'
                  }}
                />
              )}

              {/* Left Sidebar */}
              <div style={{ 
                width: isChatSidebarOpen ? '240px' : '0px', 
                borderRight: (isChatSidebarOpen && !isMobile) ? '1px solid rgba(255,255,255,0.05)' : 'none', 
                background: isMobile ? 'rgba(13,13,13,0.98)' : 'rgba(0,0,0,0.15)', 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden', 
                flexShrink: 0,
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
                position: isMobile ? 'absolute' : 'relative',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 10,
                height: '100%',
                boxShadow: (isChatSidebarOpen && isMobile) ? '10px 0 30px rgba(0,0,0,0.5)' : 'none'
              }}>
                {/* New Chat Button */}
                <div style={{ padding: '14px' }}>
                  <button
                    type="button"
                    onClick={startNewChat}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px', color: 'white', fontSize: '0.82rem', fontWeight: '600',
                      cursor: 'pointer', transition: 'all 0.25s', textAlign: 'left'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(222, 106, 57, 0.4)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  >
                    <Plus size={14} color="var(--primary)" />
                    New chat
                  </button>
                </div>

                {/* Sessions list */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 10px 14px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', padding: '0 10px 6px 10px', letterSpacing: '0.5px' }}>
                    RECENTS
                  </div>
                  {chatSessions.length === 0 ? (
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textAlign: 'center', padding: '20px 10px', fontStyle: 'italic' }}>
                      No recent chats
                    </div>
                  ) : (
                    chatSessions.map(s => {
                      const isActive = s.id === activeSessionId;
                      return (
                        <div
                          key={s.id}
                          onClick={() => selectChatSession(s.id)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '9px 12px',
                            borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                            background: isActive ? 'rgba(222, 106, 57, 0.12)' : 'transparent',
                            border: `1px solid ${isActive ? 'rgba(222, 106, 57, 0.2)' : 'transparent'}`,
                          }}
                          onMouseEnter={e => {
                            if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          }}
                          onMouseLeave={e => {
                            if (!isActive) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                            <MessageSquare size={12} color={isActive ? 'var(--primary)' : 'rgba(255,255,255,0.4)'} style={{ flexShrink: 0 }} />
                            <span style={{
                              fontSize: '0.78rem', color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                              fontWeight: isActive ? '600' : '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>
                              {s.title || 'New Chat'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => deleteChatSession(e, s.id)}
                            style={{
                              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', padding: '2px', borderRadius: '4px', transition: 'all 0.15s', flexShrink: 0
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent' }}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Chat Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'transparent' }}>
                {chatHistory.length <= 1 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '20px 40px', textAlign: 'center', overflowY: 'auto' }}>
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ 
                        width: '64px', height: '64px', borderRadius: '20px', 
                        background: 'linear-gradient(135deg, #7C3AED 0%, #DE6A39 100%)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        boxShadow: '0 0 40px rgba(124, 58, 237, 0.35)', marginBottom: '24px', flexShrink: 0
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/>
                        <circle cx="9" cy="14" r="1.5" fill="white" stroke="none"/>
                        <circle cx="15" cy="14" r="1.5" fill="white" stroke="none"/>
                      </svg>
                    </motion.div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                      How can I help you today?
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem', maxWidth: '400px', marginBottom: '32px', lineHeight: '1.5' }}>
                      Ask anything about this project's architecture, decisions ledger, tech stack, rules, or uploaded contexts.
                    </p>

                    <div className="grid-responsive-2" style={{ width: '100%', maxWidth: '640px', gap: '12px' }}>
                      {[
                        { q: "Why did we choose our database?", d: "Query active postgres/neon reasons" },
                        { q: "Write a developer onboarding guide", d: "Summarize active guidelines & rules" },
                        { q: "Create a system prompt for Claude", d: "Distill memory rules into Claude format" },
                        { q: "What decisions are still pending?", d: "List all open items in decision ledger" }
                      ].map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setChatInput(s.q)}
                          style={{
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px', padding: '16px', color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                            textAlign: 'left', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', gap: '4px'
                          }}
                          onMouseEnter={e => { 
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; 
                            e.currentTarget.style.borderColor = 'rgba(222, 106, 57, 0.4)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={e => { 
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; 
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.transform = '';
                          }}
                        >
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white' }}>{s.q}</div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{s.d}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div ref={chatContainerRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {chatHistory.map((msg, idx) => {
                      const isAssistant = msg.role === 'assistant';
                      return (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ display: 'flex', gap: '12px', justifyContent: isAssistant ? 'flex-start' : 'flex-end', alignItems: 'flex-start' }}
                        >
                          {isAssistant && (
                            <div style={{ 
                              width: '32px', height: '32px', borderRadius: '10px', 
                              background: 'linear-gradient(135deg, #7C3AED, #DE6A39)', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              flexShrink: 0,
                              boxShadow: '0 0 12px rgba(124, 58, 237, 0.3)' 
                            }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/>
                                <circle cx="9" cy="14" r="1.2" fill="white" stroke="none"/>
                                <circle cx="15" cy="14" r="1.2" fill="white" stroke="none"/>
                              </svg>
                            </div>
                          )}
                          <div style={{
                            maxWidth: '75%', 
                            padding: isAssistant ? '0 12px' : '12px 18px', 
                            borderRadius: isAssistant ? '0' : '20px',
                            background: isAssistant ? 'transparent' : 'rgba(222, 106, 57, 0.15)',
                            border: isAssistant ? 'none' : '1px solid rgba(222, 106, 57, 0.25)',
                            color: '#E2E8F0', 
                            fontSize: '0.9rem', 
                            lineHeight: '1.6'
                          }}>
                            {isAssistant ? parseMarkdownToJSX(msg.text) : msg.text}
                          </div>
                        </motion.div>
                      );
                    })}
                    {sendingChat && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '10px', 
                          background: 'rgba(255,255,255,0.05)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          flexShrink: 0, color: 'white' 
                        }}>
                          💭
                        </div>
                        <span>Memory Assistant is consulting vault logs...</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ padding: '16px 20px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.03)', background: 'transparent' }}>
                  <form onSubmit={sendChatMessage} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.25)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px', 
                    padding: '4px 8px 4px 18px',
                    transition: 'border-color 0.25s',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                  }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(222, 106, 57, 0.4)'}
                  onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                  >
                    <input
                      type="text"
                      placeholder="Ask anything about this project's architecture, rules, or stack..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      style={{ flex: 1, padding: '12px 0', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }}
                    />
                    <button
                      type="submit"
                      disabled={sendingChat || !chatInput.trim()}
                      className="btn-primary"
                      style={{ 
                        width: '36px', height: '36px', borderRadius: '50%', padding: 0, border: 'none', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: chatInput.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: chatInput.trim() ? 'white' : 'rgba(255,255,255,0.2)',
                        transition: 'all 0.25s', cursor: chatInput.trim() ? 'pointer' : 'default'
                      }}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const HelpCircleIcon = ({ size, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const parseMarkdownToJSX = (text) => {
  if (!text) return '';
  const lines = text.split('\n');
  let inList = false;
  const elements = [];
  let listItems = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle code block
    if (line.trim().startsWith('```')) {
      let codeContent = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeContent.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`code-${i}`} style={{ background: '#1c1917', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px', overflowX: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', color: '#f3f4f6', margin: '12px 0' }}>
          <code>{codeContent.join('\n')}</code>
        </pre>
      );
      continue;
    }
    
    // Close list if it was open and line doesn't start with list bullet
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim());
    if (inList && !isBullet && line.trim() !== '') {
      elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>{listItems}</ul>);
      inList = false;
      listItems = [];
    }
    
    if (isBullet) {
      inList = true;
      let cleanText = line.trim().replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
      listItems.push(<li key={`li-${i}-${listItems.length}`} style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{renderInlineMarkdown(cleanText)}</li>);
    } else if (line.trim().startsWith('###')) {
      elements.push(<h4 key={`h4-${i}`} style={{ color: 'white', fontWeight: '700', fontSize: '1rem', marginTop: '16px', marginBottom: '8px' }}>{renderInlineMarkdown(line.replace('###', '').trim())}</h4>);
    } else if (line.trim().startsWith('##')) {
      elements.push(<h3 key={`h3-${i}`} style={{ color: 'white', fontWeight: '800', fontSize: '1.15rem', marginTop: '20px', marginBottom: '8px' }}>{renderInlineMarkdown(line.replace('##', '').trim())}</h3>);
    } else if (line.trim().startsWith('#')) {
      elements.push(<h2 key={`h2-${i}`} style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', marginTop: '24px', marginBottom: '10px' }}>{renderInlineMarkdown(line.replace('#', '').trim())}</h2>);
    } else {
      if (line.trim() !== '') {
        elements.push(<p key={`p-${i}`} style={{ margin: '8px 0', color: '#e2e8f0', fontSize: '0.875rem', lineHeight: '1.6' }}>{renderInlineMarkdown(line)}</p>);
      }
    }
  }
  
  if (inList) {
    elements.push(<ul key={`ul-end`} style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>{listItems}</ul>);
  }
  
  return elements;
};

const renderInlineMarkdown = (text) => {
  const parts = [];
  let currentText = text;
  let keyIdx = 0;
  
  while (currentText.length > 0) {
    const boldIdx = currentText.indexOf('**');
    const codeIdx = currentText.indexOf('`');
    
    if (boldIdx === -1 && codeIdx === -1) {
      parts.push(currentText);
      break;
    }
    
    if (boldIdx !== -1 && (codeIdx === -1 || boldIdx < codeIdx)) {
      if (boldIdx > 0) {
        parts.push(currentText.substring(0, boldIdx));
      }
      const nextBold = currentText.indexOf('**', boldIdx + 2);
      if (nextBold !== -1) {
        parts.push(<strong key={`bold-${keyIdx++}`} style={{ color: 'white', fontWeight: '700' }}>{currentText.substring(boldIdx + 2, nextBold)}</strong>);
        currentText = currentText.substring(nextBold + 2);
      } else {
        parts.push(currentText.substring(boldIdx));
        break;
      }
    } else {
      if (codeIdx > 0) {
        parts.push(currentText.substring(0, codeIdx));
      }
      const nextCode = currentText.indexOf('`', codeIdx + 1);
      if (nextCode !== -1) {
        parts.push(<code key={`code-${keyIdx++}`} style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#DE6A39' }}>{currentText.substring(codeIdx + 1, nextCode)}</code>);
        currentText = currentText.substring(nextCode + 1);
      } else {
        parts.push(currentText.substring(codeIdx));
        break;
      }
    }
  }
  return parts;
};

const Dashboard = () => {
  const isNative = Capacitor.isNativePlatform();
  const isMobile = isNative || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ totalBridges: 0, totalTokens: 0, plan: 'free', usageCount: 0, trialDaysLeft: null, trialEndsAt: null });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [trialTimeLeft, setTrialTimeLeft] = useState('');
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  // Reactive user email - updates when user logs in/out so child components re-fetch data
  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bridge_user') || '{}').email || ''; } catch(e) { return ''; }
  });

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [promptModal, setPromptModal] = useState({ isOpen: false });
  const [localProjects, setLocalProjects] = useState([]);

  // Load user-specific local projects whenever the current user changes
  useEffect(() => {
    if (currentUserEmail) {
      try {
        const stored = JSON.parse(localStorage.getItem(`bridge_local_projects_${currentUserEmail}`) || '[]');
        setLocalProjects(stored);
      } catch (e) {
        setLocalProjects([]);
      }
    } else {
      setLocalProjects([]);
    }
  }, [currentUserEmail]);


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

      // Keep reactive email state in sync
      setCurrentUserEmail(email);

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

      const [bridgesRes, statusRes, metadataRes] = await Promise.all([
        fetchWithTimeout(`${API_BASE}/api/bridges?email=${email}`, { headers: { 'Cache-Control': 'no-cache' } }),
        fetchWithTimeout(`${API_BASE}/api/user/status?email=${email}`).catch(() => null),
        fetchWithTimeout(`${API_BASE}/api/user/metadata?email=${email}`).catch(() => null)
      ]);

      const bridgesData = await bridgesRes.json();
      
      if (bridgesData.success) {
        setHubStatus('online');
        const localBridges = bridgesData.data || [];
        setBridges(localBridges);
        
        const uniqueProjectIds = [...new Set(localBridges.map(b => b.project_id).filter(Boolean))];
        const serverProjects = uniqueProjectIds.map(id => ({ id, name: id }));
        
        let dbProjects = [];
        if (metadataRes) {
          const metadataData = await metadataRes.json().catch(() => null);
          if (metadataData && metadataData.success) {
            dbProjects = metadataData.projects || [];
            localStorage.setItem(`bridge_local_projects_${email}`, JSON.stringify(dbProjects));
            setLocalProjects(dbProjects);
          }
        }
        
        // Merge with local projects, avoiding duplicates
        const allProjects = [...serverProjects];
        const localProjectsToMerge = dbProjects.length > 0 ? dbProjects : (() => {
          try {
            return JSON.parse(localStorage.getItem(`bridge_local_projects_${email}`) || '[]');
          } catch (e) {
            return [];
          }
        })();
        localProjectsToMerge.forEach(lp => {
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
            usageCount: statusData.usage,
            trialDaysLeft: statusData.trial_days_left ?? null,
            trialEndsAt: statusData.trial_ends_at ?? null
          }));
          
          // Show expired popup modal if plan downgraded to free, and user hasn't dismissed it in the current session
          if (statusData.plan === 'free' && currentUserEmail && !sessionStorage.getItem('bridge_trial_expired_dismissed')) {
            setShowExpiredModal(true);
          }

          // Sync plan into localStorage if it changed (e.g. trial expired)
          try {
            const storedUser = JSON.parse(localStorage.getItem('bridge_user') || '{}');
            if (storedUser.email && (storedUser.plan !== statusData.plan || storedUser.trial_ends_at !== statusData.trial_ends_at)) {
              const updated = { ...storedUser, plan: statusData.plan, trial_ends_at: statusData.trial_ends_at || null };
              localStorage.setItem('bridge_user', JSON.stringify(updated));
            }
          } catch (e) {}
        }
      }
    } catch (err) {
      setHubStatus('offline');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [bridges.length]);

  // Live Countdown Timer for Pro Trial
  useEffect(() => {
    if (!stats.trialEndsAt) {
      setTrialTimeLeft('');
      return;
    }
    const updateTimer = () => {
      const msLeft = new Date(stats.trialEndsAt) - new Date();
      if (msLeft <= 0) {
        setTrialTimeLeft('Expired');
        // Force reload status to trigger downgrade / popup
        loadData(true);
      } else {
        const days = Math.floor(msLeft / 86400000);
        const hours = Math.floor((msLeft % 86400000) / 3600000);
        const minutes = Math.floor((msLeft % 3600000) / 60000);
        const seconds = Math.floor((msLeft % 60000) / 1000);
        
        let timerStr = '';
        if (days > 0) timerStr += `${days}d `;
        timerStr += `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
        setTrialTimeLeft(timerStr);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [stats.trialEndsAt, loadData]);

  const refreshVault = async () => {
    setIsRefreshing(true);
    await loadData(true);
    setIsRefreshing(false);
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
        loadData(true);
      } catch (e) {
        // Silently ignore parse errors
      }
    };

    // SSE connections frequently close on serverless platforms — suppress noisy warnings.
    // The 30s polling interval in the effect below acts as a reliable fallback.
    eventSource.onerror = () => {
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
    setLocalProjects(prev => {
      const updated = [...prev, newProject];
      if (currentUserEmail) {
        localStorage.setItem(`bridge_local_projects_${currentUserEmail}`, JSON.stringify(updated));
        // Persist workspaces to database
        fetch(`${API_BASE}/api/user/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentUserEmail, projects: updated })
        }).catch(err => console.error('Failed to persist workspaces to database:', err));
      }
      return updated;
    });
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
    
    // Free plan users only get Title search (Basic), Pro get Title + Summary + Source (Advanced)
    const isFree = stats.plan === 'free';
    const matchesSearch = !term || (isFree 
      ? title.includes(term) 
      : (title.includes(term) || summary.includes(term) || source.includes(term)));
    
    // Improved project filtering logic
    const matchesProject = activeProject 
      ? (String(b.project_id || '') === String(activeProject))
      : true;

    return matchesSearch && matchesProject;
  });

  const recentBridges  = filteredBridges.filter(b =>  isRecent(b.created_at));
  const olderBridges   = filteredBridges.filter(b => !isRecent(b.created_at) && (stats.plan !== 'free' || !isOlderThan7Days(b.created_at)));
  const historyBridges = olderBridges;
  const archivedCount  = filteredBridges.filter(b => stats.plan === 'free' && isOlderThan7Days(b.created_at)).length;

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
    <div className="container" style={{ padding: '120px 0 100px 0', background: 'transparent' }}>
      <div className="dashboard-layout mobile-col" style={{ display: 'flex', gap: '32px' }}>
        
        {/* Elite Dashboard Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="dashboard-sidebar" 
          style={{ 
            width: '280px', flexShrink: 0, position: 'sticky', top: '100px', 
            maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '4px' 
          }}
        >
          <div style={{ 
            borderRadius: '16px', overflow: 'hidden', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            background: 'rgba(13, 13, 13, 0.55)',
            backdropFilter: 'blur(16px)',
            marginBottom: '24px'
          }}>
            
            {/* Hub Identity & Status */}
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Cpu size={14} color="white" />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', color: 'var(--text-main)' }}>MY MEMORY VAULT</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: hubStatus === 'online' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(244, 63, 94, 0.08)', padding: '2px 8px', borderRadius: '100px', border: hubStatus === 'online' ? '1px solid rgba(34, 197, 94, 0.15)' : '1px solid rgba(244, 63, 94, 0.15)' }}>
                  <div className={hubStatus === 'online' ? 'pulse' : ''} style={{ width: '5px', height: '5px', borderRadius: '50%', background: hubStatus === 'online' ? '#22c55e' : '#f43f5e' }} />
                  <span style={{ fontSize: '0.6', fontWeight: '700', color: hubStatus === 'online' ? '#22c55e' : '#f43f5e' }}>{hubStatus.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #FF6B2C)', padding: '1px' }}>
                    <div style={{ width: '100%', height: '100%', background: '#0D0D0D', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
                      {JSON.parse(localStorage.getItem('bridge_user') || '{}').name?.charAt(0) || 'A'}
                    </div>
                  </div>
                  {String(stats.plan).toLowerCase() === 'infinite' && (
                    <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: '#f59e0b', borderRadius: '50%', border: '2px solid #020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={9} color="white" fill="white" />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {JSON.parse(localStorage.getItem('bridge_user') || '{}').name || 'Anonymous Analyst'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {JSON.parse(localStorage.getItem('bridge_user') || '{}').email}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Engine */}
            <div style={{ padding: '20px' }}>
              
              {/* Group: Vault Ops */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '4px' }}>VAULT STORAGE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <NavItem 
                    active={activeTab === 'saved' && !activeProject} 
                    icon={<Layers size={14} />} 
                    label="All Saved Chats" 
                    count={bridges.length} 
                    onClick={() => { setActiveTab('saved'); setActiveProject(null); }} 
                  />
                  <NavItem 
                    active={activeTab === 'history'} 
                    icon={<Clock size={14} />} 
                    label="Bridge History" 
                    onClick={() => setActiveTab('history')} 
                  />
                  <NavItem 
                    active={activeTab === 'extension'} 
                    icon={<Zap size={14} />} 
                    label="Chrome Extension" 
                    status="LIVE"
                    onClick={() => setActiveTab('extension')} 
                  />
                </div>
              </div>

              {/* Group: Project Folders */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingLeft: '4px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: '1px' }}>PROJECT WORKSPACES</div>
                  <button 
                    onClick={() => {
                      if (stats.plan === 'free') {
                        triggerToast('Upgrade to Pro to unlock Project Folders & workspaces.');
                        return;
                      }
                      setPromptModal({ isOpen: true });
                    }} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                  {stats.plan === 'free' ? (
                    <div style={{ padding: '12px', textAlign: 'center', background: 'rgba(222, 106, 57, 0.02)', borderRadius: '8px', border: '1px dashed rgba(222, 106, 57, 0.12)' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: 0 }}>
                        <Lock size={10} /> Project Folders (Pro)
                      </p>
                    </div>
                  ) : (
                    <>
                      {projects.length === 0 && (
                        <div style={{ padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>No folders initialized</p>
                        </div>
                      )}
                      {projects.map(p => (
                        <NavItem 
                          key={p.id}
                          active={activeProject === p.id} 
                          icon={<div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeProject === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }} />} 
                          label={p.name} 
                          count={bridges.filter(b => String(b.project_id) === String(p.id)).length}
                          onClick={() => { setActiveTab('saved'); setActiveProject(p.id); }} 
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Group: Capacity Protocol */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingLeft: '4px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: '1px' }}>STORAGE LIMIT</div>
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', color: (trialTimeLeft && trialTimeLeft !== 'Expired') ? '#f59e0b' : 'var(--primary)' }}>
                    {(trialTimeLeft && trialTimeLeft !== 'Expired') ? 'TRIAL' : (stats.plan || 'FREE').toUpperCase()}
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>

                  {/* ── Active Pro Trial ── */}
                  {trialTimeLeft && trialTimeLeft !== 'Expired' && (
                    <>
                      {/* Countdown pill */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: '8px', padding: '8px 10px', marginBottom: '10px'
                      }}>
                        <div style={{
                          width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b',
                          boxShadow: '0 0 6px rgba(245,158,11,0.7)', flexShrink: 0,
                          animation: 'trialPulse 1.5s ease-in-out infinite'
                        }} />
                        <style>{`@keyframes trialPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}`}</style>
                        <div>
                          <div style={{ fontSize: '0.6rem', fontWeight: '800', color: '#f59e0b', letterSpacing: '0.5px' }}>
                            PRO TRIAL ACTIVE
                          </div>
                          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginTop: '1px', fontFamily: 'monospace' }}>
                            {trialTimeLeft}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '2px 0' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'white' }}>Unlimited Storage</div>
                        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>All Pro features unlocked</div>
                      </div>
                    </>
                  )}

                  {/* ── Paid Pro / Infinite ── */}
                  {!stats.trialDaysLeft && (String(stats.plan).toLowerCase() === 'infinite' || String(stats.plan).toLowerCase() === 'pro') && (
                    <div style={{ textAlign: 'center', padding: '4px 0' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.5px', marginBottom: '2px' }}>STATUS</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white' }}>UNLIMITED STORAGE</div>
                    </div>
                  )}

                  {/* ── Free Plan (trial ended or never started) ── */}
                  {!stats.trialDaysLeft && String(stats.plan).toLowerCase() === 'free' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                        <span>Usage</span>
                        <span>{stats.usageCount} / 10</span>
                      </div>
                      <div style={{ height: '5px', width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '100px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${Math.min(100, (stats.usageCount / 10) * 100)}%` }}
                          transition={{ duration: 0.8 }}
                          style={{ height: '100%', background: 'var(--primary)' }} 
                        />
                      </div>
                      <Link to="/services#pricing" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                        marginTop: '12px', padding: '9px 6px', borderRadius: '9px',
                        background: 'linear-gradient(135deg, rgba(222,106,57,0.15), rgba(124,58,237,0.1))',
                        border: '1px solid rgba(222, 106, 57, 0.3)',
                        fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary)',
                        textDecoration: 'none', transition: 'all 0.2s',
                        boxShadow: '0 0 12px rgba(222,106,57,0.1)'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(222,106,57,0.2)'; e.currentTarget.style.boxShadow = '0 0 18px rgba(222,106,57,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(222,106,57,0.15), rgba(124,58,237,0.1))'; e.currentTarget.style.boxShadow = '0 0 12px rgba(222,106,57,0.1)'; }}
                      >
                        <Zap size={11} fill="currentColor" /> Upgrade to Pro
                      </Link>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar Footer */}
            <div style={{ padding: '14px 20px', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={12} color="#10b981" />
                  <span style={{ fontSize: '0.6rem', fontWeight: '500', color: 'rgba(255,255,255,0.3)' }}>SYNC ACTIVE</span>
               </div>
               <button onClick={refreshVault} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <RefreshCw size={12} />
               </button>
            </div>

          </div>
        </motion.aside>

        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'saved' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {activeProject ? (
                <ProjectWorkspace 
                  key={`${activeProject}-${currentUserEmail}`}
                  projectId={activeProject}
                  userEmail={currentUserEmail}
                  projects={projects}
                  bridges={bridges}
                  filteredBridges={filteredBridges}
                  recentBridges={recentBridges}
                  olderBridges={olderBridges}
                  stats={stats}
                  triggerToast={triggerToast}
                  loadData={loadData}
                  setConfirmModal={setConfirmModal}
                  handleForge={handleForge}
                  setActiveProject={setActiveProject}
                />
              ) : (
                <>
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
              
              <div style={{ position: 'relative', overflow: 'hidden', padding: '28px 32px', borderRadius: '24px', background: 'rgba(13, 13, 13, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', marginBottom: '32px' }}>
                <IntelligenceBridge />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <div style={{ 
                    padding: '4px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: '700', 
                    background: hubStatus === 'online' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                    color: hubStatus === 'online' ? '#22c55e' : '#f43f5e',
                    border: `1px solid ${hubStatus === 'online' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(244, 63, 94, 0.15)'}`,
                    display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px',
                    marginBottom: '16px'
                  }}>
                    <div className={hubStatus === 'online' ? 'pulse' : ''} style={{ width: '5px', height: '5px', borderRadius: '50%', background: hubStatus === 'online' ? '#22c55e' : '#f43f5e' }} />
                    Hub {hubStatus}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: '1.2', color: '#FFFFFF' }}>
                        {(() => {
                          const hour = new Date().getHours();
                          const user = JSON.parse(localStorage.getItem('bridge_user') || '{}');
                          const name = user.name?.split(' ')[0] || 'Analyst';
                          if (hour < 12) return `Good Morning, ${name}`;
                          if (hour < 18) return `Good Afternoon, ${name}`;
                          return `Good Evening, ${name}`;
                        })()}
                      </h1>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', fontWeight: '400', lineHeight: '1.4' }}>
                        Vault is hosting <strong>{filteredBridges.length}</strong> active intelligence bridges in the {activeProject ? `"${projects.find(p => p.id === activeProject)?.name}"` : 'Universal'} sector.
                      </p>
                    </div>
                    
                    <div style={{ position: 'relative', width: '280px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', zIndex: 2 }} />
                      <input 
                        type="text" 
                        placeholder="Search bridges..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '12px 16px 12px 42px', 
                          fontSize: '0.875rem', 
                          background: 'rgba(255,255,255,0.02)', 
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: '#FFFFFF',
                          borderRadius: '10px', 
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(0,0,0,0.2)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.02)'; }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="stats-grid grid-responsive-4" style={{ gap: '20px', marginBottom: '32px' }}>
                {[
                  { label: 'Total Bridges', val: stats.totalBridges || 0, icon: <Layers size={16} />, color: '#8b5cf6' },
                  { 
                    label: 'Distillation Ratio', 
                    val: (() => {
                      const totalSource = bridges.reduce((acc, b) => acc + (b.source_text?.length || 0), 0);
                      const totalSum = bridges.reduce((acc, b) => acc + (b.summary?.length || 0), 0);
                      if (!totalSource) return '99.4%';
                      return ((totalSum / totalSource) * 100).toFixed(1) + '%';
                    })(), 
                    icon: <Zap size={16} />, 
                    color: '#f59e0b' 
                  },
                  { label: 'Context Tokens', val: Math.round(stats.totalTokens || 0).toLocaleString(), icon: <Database size={16} />, color: '#06b6d4' },
                  { 
                    label: 'Intelligence Density', 
                    val: (() => {
                      if (bridges.length === 0) return '0.00';
                      const sumLen = bridges.reduce((acc, b) => acc + (b.summary?.length || 0), 0);
                      return (sumLen / (bridges.length * 1000)).toFixed(2);
                    })(), 
                    icon: <Activity size={16} />, 
                    color: '#10b981' 
                  }
                ].map((s, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.08)' }}
                    transition={{ delay: 0.05 + (i * 0.05) }}
                    style={{ 
                      padding: '20px', 
                      borderRadius: '12px',
                      background: 'rgba(13, 13, 13, 0.45)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '8px', background: `${s.color}10`, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color,
                        border: `1px solid ${s.color}20`
                      }}>
                        {s.icon}
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>{s.label.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.01em', marginTop: '4px' }}>{s.val}</div>
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
                    <>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '1.5px', color: 'var(--text-muted)', paddingLeft: '4px', marginTop: '8px' }}>
                        EARLIER
                      </div>
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
                    </>
                  )}
                  {stats.plan === 'free' && archivedCount > 0 && (
                    <div className="glass-card" style={{ 
                      padding: '24px', textAlign: 'center', background: 'rgba(222, 106, 57, 0.02)', 
                      border: '1px dashed rgba(222, 106, 57, 0.15)', borderRadius: '16px', 
                      marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                        <Lock size={14} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px' }}>7-DAY HISTORY LIMIT REACHED</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                        {archivedCount} older context bridges (older than 7 days) are archived. Upgrade to Pro to unlock full history access.
                      </p>
                      <Link to="/services" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', marginTop: '4px' }}>
                        Upgrade Plan &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--gray-50)', border: '1px dashed var(--gray-200)' }}>
                  <div style={{ width: '80px', height: '80px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <Target size={40} style={{ color: 'var(--primary)', opacity: 0.8 }} />
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
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
                    <button 
                      onClick={refreshVault} 
                      disabled={isRefreshing} 
                      className="btn-secondary" 
                      style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
                    >
                      <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} /> 
                      {isRefreshing ? 'Refreshing...' : 'Refresh Vault'}
                    </button>
                  </div>
                </div>
              )}
                </>
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
              
              <div className="grid-responsive-2" style={{ gap: '40px' }}>
                {/* Left Side: Status & Capabilities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)' }}>
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
                <div className="glass-card" style={{ padding: '40px', borderStyle: 'dashed', borderColor: 'var(--primary)', borderWidth: '2px', background: '#0b0f19' }}>
                  {isMobile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 0' }}>
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'rgba(255, 107, 44, 0.08)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                        border: '1px solid rgba(255, 107, 44, 0.2)'
                      }}>
                        <Puzzle size={28} color="var(--primary)" />
                      </div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'white', marginBottom: '12px' }}>Coming Soon on Mobile</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, marginBottom: '20px', maxWidth: '340px' }}>
                        BridgeAI browser extensions are currently designed for computer and laptop browsers (Chrome, Brave, Edge, etc.) which support developer extensions. Mobile syncing is coming soon!
                      </p>
                      <div style={{
                        padding: '10px 16px', background: 'rgba(255, 107, 44, 0.05)',
                        border: '1px solid rgba(255, 107, 44, 0.1)', borderRadius: '10px',
                        fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600'
                      }}>
                        💻 Please use a desktop to configure extensions
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            stats.plan === 'free' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="premium-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>History Log</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Review your past bridge transfers across all platforms.</p>
                <div className="glass-card" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(222, 106, 57, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
                    <Lock size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'white' }}>Deep Context History is Locked</h3>
                  <p style={{ maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.6 }}>
                    Free accounts only have access to active context within a 24-hour window. Upgrade to Pro to store, search, and recall your full history of conversation context across all LLM platforms.
                  </p>
                  <Link to="/services"><button className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>Upgrade to Pro ($5/mo)</button></Link>
                </div>
              </motion.div>
            ) : (
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
            )
          )}

          {activeTab === 'manual' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="premium-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>New Bridge</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Paste context, assign a project, and let BridgeAI extract its intelligence.</p>
              
              <div className="grid-responsive-2" style={{ gap: '16px', marginBottom: '16px' }}>
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
                  <select 
                    id="manual-project" 
                    className="input-premium" 
                    style={{ width: '100%', background: 'var(--bg)', cursor: stats.plan === 'free' ? 'not-allowed' : 'pointer' }}
                    disabled={stats.plan === 'free'}
                  >
                    <option value="">{stats.plan === 'free' ? '— Projects Locked (Pro Feature) —' : '— No Project —'}</option>
                    {stats.plan !== 'free' && projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '600' }}>Intelligence Mode</label>
                <div className="grid-auto-fit-small" style={{ gap: '10px' }}>
                  {[
                    { val: 'quick', label: 'Quick', icon: <Zap size={13} />, desc: 'TL;DR', color: '#22c55e', tier: 'free' },
                    { val: 'developer', label: 'Dev', icon: <Code size={13} />, desc: 'Code + Tasks', color: '#8b5cf6', tier: 'pro' },
                    { val: 'research', label: 'Research', icon: <BookOpen size={13} />, desc: 'Concepts', color: '#06b6d4', tier: 'pro' },
                    { val: 'study', label: 'Study', icon: <Target size={13} />, desc: 'Notes', color: '#f59e0b', tier: 'pro' },
                    { val: 'project', label: 'Project', icon: <Layers size={13} />, desc: 'Status', color: '#f43f5e', tier: 'pro' },
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
                          padding: '12px 10px', borderRadius: '10px', textAlign: 'center',
                          border: `1px solid rgba(255,255,255,0.05)`, background: 'rgba(255,255,255,0.01)',
                          transition: 'all 0.2s', opacity: isLocked ? 0.35 : 1,
                          position: 'relative'
                        }}
                        onClick={(e) => {
                          if (isLocked) {
                            triggerToast('Upgrade to Pro to unlock 5 Intelligence Modes.');
                            return;
                          }
                          document.querySelectorAll('.mode-card').forEach(c => {
                            c.style.border = '1px solid rgba(255,255,255,0.05)';
                            c.style.background = 'rgba(255,255,255,0.01)';
                          });
                          e.currentTarget.style.border = `1px solid ${m.color}`;
                          e.currentTarget.style.background = `${m.color}05`;
                        }}
                        className="mode-card"
                        >
                          {isLocked && <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#f43f5e', borderRadius: '50%', padding: '2px', display: 'flex', alignItems: 'center' }}><X size={8} color="white" /></div>}
                          <div style={{ fontSize: '1.1rem', color: m.color, marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'white' }}>{m.label}</div>
                          <div style={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>{m.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ 
                borderRadius: '12px', overflow: 'hidden', 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                background: 'rgba(13, 13, 13, 0.45)',
                backdropFilter: 'blur(10px)',
                padding: '24px'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '600' }}>Raw Context (paste chat logs, code, notes…)</label>
                  <textarea 
                    id="manual-text"
                    placeholder="Paste your conversation, code, or notes here. BridgeAI will extract structured intelligence from it."
                    className="input-premium"
                    style={{ 
                      width: '100%', height: '200px',
                      fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical',
                      background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px', padding: '12px', color: 'white'
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
                      style={{ fontSize: '0.75rem', padding: '8px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', opacity: stats.plan === 'infinite' ? 1 : 0.5, border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <GitMerge size={12} /> Merge Last 3
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
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '32px',
            background: 'rgba(13, 13, 13, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderLeft: '4px solid var(--primary)',
            padding: '12px 20px',
            borderRadius: '12px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 9999
          }}
        >
          <div style={{ background: 'rgba(222, 106, 57, 0.1)', padding: '6px', borderRadius: '50%', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
            <CheckCircle2 size={16} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Sync Status</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{toast}</p>
          </div>
        </motion.div>
      )}

      {/* Modern Confirmation Modal */}
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Intelligence Bridge?"
        message="Are you sure you want to permanently delete this context bridge? This action cannot be undone."
      />

      {/* Modern Prompt Modal */}
      <PromptModal 
        isOpen={promptModal.isOpen}
        onClose={() => setPromptModal({ isOpen: false })}
        onSubmit={handleCreateProject}
        title="Create Project Folder"
        label="Project Folder Name"
        placeholder="e.g. Frontend App, Research..."
      />

      {/* Universal Forge Modal */}
      <ForgeModal 
        isOpen={forgeState.isOpen} 
        onClose={() => setForgeState({ ...forgeState, isOpen: false })}
        context={forgeState.context}
        onDispatch={(url) => handleDispatch(url, forgeState.bestContext)}
      />

      {/* ── Trial Expired Popup Modal ── */}
      {showExpiredModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '36px', maxWidth: '440px', width: '90%', textAlign: 'center',
              background: 'var(--bg-secondary)', borderRadius: '24px',
              border: '1.5px solid rgba(222, 106, 57, 0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171'
              }}>
                <Zap size={28} fill="currentColor" />
              </div>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '10px', color: '#fff', letterSpacing: '-0.02em' }}>
              Pro Trial Expired
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '28px', lineHeight: '1.6', fontSize: '0.9rem' }}>
              Your 7-day Pro Trial has ended and your account has been downgraded to the Free tier. 
              <br /><br />
              Advanced Intelligence modes (Developer, Research, Study, Project), prompt optimization, and unlimited bridges are now locked. Upgrade to Pro to restore unlimited access.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=business@entrext.in&su=${encodeURIComponent(`[Upgrade Request] PRO Plan`)}&body=${encodeURIComponent(
                  `Hi BridgeAI Team,\n\nI would like to upgrade my account to the PRO plan ($5/month).\n\nMy Registered Email: ${currentUserEmail}\n\nPlease let me know how to complete the payment.\n\nThank you!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  padding: '14px', borderRadius: '12px', fontWeight: '700',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontSize: '0.92rem', background: 'linear-gradient(135deg, #f59e0b, #FF6B2C)',
                  color: '#fff', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.25)'
                }}
              >
                Upgrade to Pro — $5/mo
              </a>
              <button
                onClick={() => {
                  sessionStorage.setItem('bridge_trial_expired_dismissed', 'true');
                  setShowExpiredModal(false);
                }}
                className="btn-secondary"
                style={{
                  padding: '12px', borderRadius: '12px', fontWeight: '700',
                  background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                Continue as Free User (Degraded Services)
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
