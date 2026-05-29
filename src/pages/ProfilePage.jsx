import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User, CreditCard, Download, ShieldCheck, Calendar, Activity,
  Layers, Settings, Mail, Key, Database, X, Bell, Lock, Zap,
  Globe, ArrowUpRight, Shield, Camera, CheckCircle, Circle,
  Clock, Star, Trophy, Cpu, ArrowRight, AlertTriangle,
  FileText, HelpCircle, MessageSquare, Bug, LogOut,
  RefreshCw, Smartphone, Monitor, BarChart2, Archive,
  ChevronRight, BookOpen, ExternalLink, Sparkles
} from 'lucide-react';
import { API_BASE } from '../apiConfig';

/* ─── Real AI Platform SVG Logos ──────────────────────────── */
const ChatGPTLogo = () => (
  <svg width="18" height="18" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835 9.964 9.964 0 00-7.505-3.360 10.079 10.079 0 00-9.612 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.504 3.36 10.079 10.079 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.814zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103l-8.051 4.648a7.504 7.504 0 01-10.24-2.743zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.012L7.044 23.86a7.504 7.504 0 01-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.114-.012l8.048 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.499v4.993l-4.330 2.5-4.332-2.5V18z" fill="#74aa9c"/>
  </svg>
);

const ClaudeLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-1.227-.072L2 12.66l.097-.791.766-.072 1.156.025 2.29.097 2.507.122 1.194.048-.048-.178L9.61 11.2 8.978 9.485 8.008 6.876l-.571-1.784-.388-1.316.534-.766h.938l.433.388.388 1.123.655 2.036.875 2.616.534 1.614.194.607.146-.097.972-2.616.729-1.93.777-1.735.534-.97.729-.389h.801l.656.583-.146.85-.534.923-.875 1.832-.826 1.98-.631 1.784.157.048 1.39-.157 2.786-.146 1.784-.024h1.026l.8.754-.146.68-.607.51-1.784.122-2.362.17-1.978.17-.986.097.048.146.729.777 1.784 2.12.996 1.297.55 1.03-.194.85-.777.388-.534-.146-.68-.63-1.49-1.784-1.784-1.954-.84-.996-.097.048-.048 1.16v1.736l-.073 1.49-.17 1.3-.413.729-.729.194-.68-.437-.17-.68.073-.948.17-1.832.048-1.783v-2.12l-.048-1.33-.146.072-1.27 3.005-.923 2.169-.826 1.59-.656.923-.85.122-.607-.437.097-.85.34-.607.777-1.42.875-2.023.972-2.41z" fill="#D97757"/>
  </svg>
);

const GeminiLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24A14.232 14.232 0 019.86 12 14.232 14.232 0 0112 0a14.232 14.232 0 012.14 12A14.232 14.232 0 0112 24z" fill="url(#gemini-a)"/>
    <path d="M24 12c-3.53.35-8.765 2.14-12 2.14C8.765 14.14 3.53 12.35 0 12c3.53-.35 8.765-2.14 12-2.14C15.235 9.86 20.47 11.65 24 12z" fill="url(#gemini-b)"/>
    <defs>
      <linearGradient id="gemini-a" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1C7DFF"/>
        <stop offset="1" stopColor="#1C69FF"/>
      </linearGradient>
      <linearGradient id="gemini-b" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1C7DFF"/>
        <stop offset="1" stopColor="#1C69FF"/>
      </linearGradient>
    </defs>
  </svg>
);

const DeepSeekLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.748 11.11a.899.899 0 00-.216-.537c-.138-.166-.286-.299-.286-.299s-.025-.616-.138-.85c-.113-.233-.312-.52-.6-.76-.286-.242-.65-.428-1.025-.547-.374-.12-.78-.17-1.147-.13-.368.038-.67.15-.894.308-.226.158-.364.357-.392.549-.028.192.05.39.208.542.155.152.386.262.647.31a2.94 2.94 0 00.776.017c.262-.03.512-.11.727-.22.213-.112.376-.25.473-.393.096-.143.122-.27.08-.369a.383.383 0 00-.273-.22 1.55 1.55 0 00-.46-.048c-.166.01-.33.038-.48.089-.15.05-.277.122-.376.21a.69.69 0 00-.192.296.484.484 0 00.005.334c.058.108.17.198.323.258.151.06.338.087.537.076a2.39 2.39 0 00.594-.12c.195-.063.37-.154.521-.27.15-.116.269-.257.346-.405a.916.916 0 00.083-.487.87.87 0 00-.196-.461 1.396 1.396 0 00-.437-.337 2.284 2.284 0 00-.587-.189 3.2 3.2 0 00-.66-.043 3.756 3.756 0 00-.665.1 3.285 3.285 0 00-.597.228 2.527 2.527 0 00-.475.352 1.828 1.828 0 00-.325.467 1.548 1.548 0 00-.119.56 1.72 1.72 0 00.09.607c.078.198.2.38.358.534.16.153.355.276.573.362.217.085.453.132.692.137.238.005.474-.032.69-.109.216-.077.41-.195.57-.347.158-.152.276-.336.346-.535.07-.2.09-.413.058-.623a1.512 1.512 0 00-.24-.568 2.116 2.116 0 00-.464-.444 2.988 2.988 0 00-.617-.307A3.944 3.944 0 0019 7.09a4.33 4.33 0 00-.715-.014 4.265 4.265 0 00-.702.112 3.752 3.752 0 00-.63.245 2.984 2.984 0 00-.513.371 2.21 2.21 0 00-.37.485 1.8 1.8 0 00-.186.58 2.017 2.017 0 00.031.64c.07.213.183.41.333.582.15.17.336.314.548.424.212.11.447.184.692.217.244.033.494.021.733-.036a2.55 2.55 0 00.644-.247 2.272 2.272 0 00.496-.41 1.88 1.88 0 00.315-.543 1.69 1.69 0 00.092-.617 1.857 1.857 0 00-.149-.617 2.22 2.22 0 00-.376-.533 2.762 2.762 0 00-.556-.41 3.422 3.422 0 00-.682-.252 3.93 3.93 0 00-.76-.095 4.123 4.123 0 00-.764.047 3.77 3.77 0 00-.708.195 3.18 3.18 0 00-.608.343 2.549 2.549 0 00-.474.478 2.08 2.08 0 00-.298.596 2.173 2.173 0 00-.074.677 2.475 2.475 0 00.177.695c.108.225.257.433.44.613.184.18.397.33.631.443.234.113.484.188.74.22.255.033.512.022.757-.033.245-.055.474-.155.678-.293.203-.137.376-.31.505-.505.129-.196.213-.415.245-.642.032-.228.01-.46-.065-.677a1.857 1.857 0 00-.369-.58 2.534 2.534 0 00-.578-.43 3.276 3.276 0 00-.722-.268 4.007 4.007 0 00-.8-.095" fill="#4D6BFE"/>
    <circle cx="5" cy="12" r="4.5" fill="#4D6BFE" opacity="0.8"/>
    <text x="3" y="15.5" fill="white" fontSize="7" fontWeight="bold">DS</text>
  </svg>
);

const OthersLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="4" fill="#a78bfa" opacity="0.6"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#a78bfa"/>
  </svg>
);

/* ─── Mock / fallback data ─────────────────────────────────── */
const MOCK_ACTIVITY = [
  { day: 'Today',        icon: '↔', text: 'Context transferred ChatGPT → Claude',   time: '2 hours ago',   ok: true },
  { day: 'Today',        icon: '⬇', text: 'Context extracted from Gemini',           time: '5 hours ago',   ok: true },
  { day: 'Yesterday',    icon: '↔', text: 'Context transferred Claude → DeepSeek',   time: '18 hours ago',  ok: true },
  { day: 'Yesterday',    icon: '🔒', text: 'Security keys refreshed',                 time: '22 hours ago',  ok: true },
  { day: '3 days ago',   icon: '💾', text: 'Memory synced — E-commerce Project',      time: '3 days ago',    ok: true },
  { day: '3 days ago',   icon: '↔', text: 'Context transferred Gemini → ChatGPT',    time: '3 days ago',    ok: true },
];

const MOCK_TRANSFERS = [
  { source: 'ChatGPT',   dest: 'Claude',    date: 'Today,  2:13 PM',    status: 'success' },
  { source: 'Gemini',    dest: 'ChatGPT',   date: 'Yesterday, 9:04 AM', status: 'success' },
  { source: 'Claude',    dest: 'DeepSeek',  date: '2 days ago',         status: 'success' },
  { source: 'ChatGPT',   dest: 'Perplexity',date: '4 days ago',         status: 'success' },
  { source: 'Mistral',   dest: 'Claude',    date: '5 days ago',         status: 'success' },
];

const MOCK_VAULT = [
  { id: 1, title: 'E-commerce Project',   tags: ['ChatGPT', 'Claude'],   updated: '2h ago',   size: '4.2 KB' },
  { id: 2, title: 'AI Interview Prep',    tags: ['Claude', 'Gemini'],    updated: '1d ago',   size: '2.8 KB' },
  { id: 3, title: 'Startup Research',     tags: ['Perplexity', 'GPT-4'], updated: '3d ago',   size: '6.1 KB' },
  { id: 4, title: 'Resume Builder',       tags: ['ChatGPT'],             updated: '5d ago',   size: '1.5 KB' },
  { id: 5, title: 'Marketing Strategy',   tags: ['Claude', 'DeepSeek'],  updated: '1w ago',   size: '3.9 KB' },
];

const MOCK_PLATFORMS = [
  { name: 'ChatGPT',    color: '#74aa9c', pct: 42, logo: <ChatGPTLogo /> },
  { name: 'Claude',     color: '#D97757', pct: 31, logo: <ClaudeLogo /> },
  { name: 'Gemini',     color: '#1C7DFF', pct: 17, logo: <GeminiLogo /> },
  { name: 'DeepSeek',   color: '#4D6BFE', pct:  6, logo: <DeepSeekLogo /> },
  { name: 'Others',     color: '#a78bfa', pct:  4, logo: <OthersLogo /> },
];

const MOCK_ACHIEVEMENTS = [
  { id: 'first',   label: 'First Transfer',   icon: '🚀', earned: true  },
  { id: 'ten',     label: '10 Transfers',      icon: '⚡', earned: true  },
  { id: 'hundred', label: '100 Transfers',     icon: '💯', earned: false },
  { id: 'multi',   label: 'Multi-Platform',    icon: '🌐', earned: true  },
  { id: 'power',   label: 'Power User',        icon: '🔥', earned: false },
];

const MOCK_DEVICES = [
  { name: 'Chrome — Windows',  icon: <Monitor size={14}/>, last: 'Active now',    current: true  },
  { name: 'Firefox — macOS',   icon: <Monitor size={14}/>, last: '2 days ago',   current: false },
  { name: 'Mobile — Android',  icon: <Smartphone size={14}/>, last: '5 days ago',current: false },
];

const TABS = ['Overview', 'Context Vault', 'Security', 'Billing', 'Support'];
const P = '#FF6B2C';

/* ─── Colour helpers ───────────────────────────────────────── */
const cardStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: 28,
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('bridge_user');
    return s ? JSON.parse(s) : null;
  });
  const [stats, setStats]       = useState({ usage: 0, total: 0 });
  const [invoices, setInvoices]   = useState([]);
  const [realTransfers, setRealTransfers] = useState([]);
  const [realActivity, setRealActivity]   = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ notifications: true, autoBridge: false, secureMode: true });
  const fileInputRef = useRef(null);

  /* ── Avatar change ─────────────────────────────────────── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...user, picture: reader.result };
      setUser(updated);
      localStorage.setItem('bridge_user', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  /* ── Save display name ─────────────────────────────────── */
  const handleSaveName = () => {
    if (!editName.trim()) return;
    const updated = { ...user, name: editName.trim() };
    setUser(updated);
    localStorage.setItem('bridge_user', JSON.stringify(updated));
    setShowEditProfile(false);
  };

  /* ── API calls (parallel, silent on refresh) ───────────── */
  useEffect(() => {
    const load = async () => {
      const s = localStorage.getItem('bridge_user');
      if (!s) return;
      const u = JSON.parse(s);
      try {
        const [statusRes, invoiceRes, settingsRes, bridgesRes] = await Promise.all([
          fetch(`${API_BASE}/api/user/status?email=${u.email}`).catch(() => null),
          fetch(`${API_BASE}/api/user/invoices?email=${u.email}`).catch(() => null),
          fetch(`${API_BASE}/api/user/settings?email=${u.email}`).catch(() => null),
          fetch(`${API_BASE}/api/bridges?email=${u.email}`, { headers: { 'Cache-Control': 'no-cache' } }).catch(() => null),
        ]);
        if (statusRes?.ok) {
          const d = await statusRes.json();
          if (d.success) {
            setStats({ usage: d.usage, total: d.total });
            if (u.plan !== d.plan) {
              const upd = { ...u, plan: d.plan };
              localStorage.setItem('bridge_user', JSON.stringify(upd));
              setUser(upd);
            }
          }
        }
        if (invoiceRes?.ok) {
          const d = await invoiceRes.json();
          if (d.success) setInvoices(d.invoices || []);
        }
        if (settingsRes?.ok) {
          const d = await settingsRes.json();
          if (d.success && d.settings) setSettingsForm(d.settings);
        }
        if (bridgesRes?.ok) {
          const d = await bridgesRes.json();
          const bridges = Array.isArray(d) ? d : (d.bridges || []);
          if (bridges.length > 0) {
            // Build recent transfers
            const transfers = bridges.slice(0, 5).map(b => {
              const date = b.created_at || b.createdAt;
              const now = new Date();
              const created = new Date(date);
              const diffMs = now - created;
              const diffDays = Math.floor(diffMs / 86400000);
              let dateLabel;
              if (diffDays === 0) dateLabel = `Today, ${created.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
              else if (diffDays === 1) dateLabel = `Yesterday, ${created.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
              else dateLabel = `${diffDays} days ago`;
              return {
                source: b.source_platform || b.platform || 'AI Platform',
                dest: b.destination_platform || b.target || 'Target',
                date: dateLabel,
                status: 'success'
              };
            });
            setRealTransfers(transfers);

            // Build activity from bridges
            const activity = bridges.slice(0, 6).map(b => {
              const date = b.created_at || b.createdAt;
              const now = new Date();
              const created = new Date(date);
              const diffMs = now - created;
              const diffDays = Math.floor(diffMs / 86400000);
              const diffHrs = Math.floor(diffMs / 3600000);
              let day, time;
              if (diffDays === 0) { day = 'Today'; time = `${diffHrs || 1} hour${diffHrs !== 1 ? 's' : ''} ago`; }
              else if (diffDays === 1) { day = 'Yesterday'; time = '~18 hours ago'; }
              else { day = `${diffDays} days ago`; time = `${diffDays} days ago`; }
              const src = b.source_platform || b.platform || 'Platform';
              const dst = b.destination_platform || b.target || '';
              return { day, text: dst ? `Context transferred ${src} → ${dst}` : `Context extracted from ${src}`, time, ok: true };
            });
            setRealActivity(activity);
          }
        }
      } catch (e) { console.error(e); }
    };
    load();
    const interval = setInterval(load, 30000);
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(interval); window.removeEventListener('visibilitychange', onVisible); };
  }, []);

  if (!user) return (
    <div style={{ padding: '100px 24px', textAlign: 'center', color: '#f2f2f2' }}>
      <h2>Please sign in to view your profile.</h2>
    </div>
  );

  const planLimit    = user.plan === 'pro' ? 100 : user.plan === 'infinite' ? Infinity : 3;
  const usagePct     = user.plan === 'infinite' ? 100 : Math.min(100, (stats.usage / planLimit) * 100);
  const memberSince  = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'May 2026';
  const accountId    = user.id || user._id || ('BRG-' + user.email?.slice(0,4).toUpperCase() + '-7291');
  const lastLogin    = 'Just now';
  const onboardDone  = [!!user.picture, stats.total > 0, MOCK_VAULT.length > 0, true];
  const onboardPct   = Math.round((onboardDone.filter(Boolean).length / onboardDone.length) * 100);

  /* ── Grouped activity (real from API, fallback to mock) ─── */
  const activitySource = realActivity.length > 0 ? realActivity : MOCK_ACTIVITY;
  const activityGroups = activitySource.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});
  const displayTransfers = realTransfers.length > 0 ? realTransfers : MOCK_TRANSFERS;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 90, paddingBottom: 80, color: '#f2f2f2' }}>
      <style>{`
        .pp-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; }
        .pp-card-pad { padding: 28px; }
        .pp-section-label { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 18px; }
        .pp-row { display: flex; justify-content: space-between; align-items: center; padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .pp-row:last-child { border-bottom: none; }
        .pp-row-label { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
        .pp-row-val { font-weight: 700; font-size: 0.88rem; }
        .pp-tab-btn { padding: 9px 20px; border-radius: 100px; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.45); }
        .pp-tab-btn.active { background: rgba(255,107,44,0.12); border-color: rgba(255,107,44,0.3); color: #FF6B2C; }
        .pp-tab-btn:hover:not(.active) { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.8); }
        .pp-action-btn { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.75); font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none; width: 100%; }
        .pp-action-btn:hover { border-color: rgba(255,107,44,0.3); background: rgba(255,107,44,0.06); color: #FF6B2C; }
        .pp-ghost-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.65); font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .pp-ghost-btn:hover { border-color: rgba(255,255,255,0.2); color: #f2f2f2; }
        .pp-orange-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,107,44,0.3); background: rgba(255,107,44,0.08); color: #FF6B2C; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .pp-orange-btn:hover { background: rgba(255,107,44,0.15); }
        .pp-danger-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.05); color: #f87171; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .pp-danger-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.35); }
        .pp-input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #f2f2f2; font-size: 0.9rem; font-family: inherit; outline: none; box-sizing: border-box; }
        .pp-input:focus { border-color: rgba(255,107,44,0.4); }
        .pp-progress-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; }
        .pp-platform-bar { height: 6px; border-radius: 100px; }
        .pp-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.04em; }
        .transfer-row:hover { background: rgba(255,255,255,0.02); }
        @media(max-width:768px) {
          .pp-hero-inner { flex-direction: column; align-items: flex-start !important; }
          .pp-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .pp-tabs { overflow-x: auto; }
        }
      `}</style>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px' }}>

        {/* ═════════ HERO ═════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', marginBottom: 32, border: '1px solid rgba(255,255,255,0.07)' }}>
            {/* BG */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(255,107,44,0.1) 60%, rgba(16,185,129,0.07) 100%)', zIndex: 0 }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(255,107,44,0.08) 1px, transparent 1px)`, backgroundSize: '32px 32px', zIndex: 0 }} />
            <div className="pp-hero-inner" style={{ position: 'relative', zIndex: 1, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap' }}>

              {/* Left: Avatar + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: -6, borderRadius: 30, background: 'conic-gradient(from 0deg,#7C3AED,#FF6B2C,#10b981,#7C3AED)', opacity: 0.5, filter: 'blur(10px)', animation: 'avatarPulse 4s ease-in-out infinite' }} />
                  <style>{`@keyframes avatarPulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.7;transform:scale(1.03)}}`}</style>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: 100, height: 100, borderRadius: 24, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                  >
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
                    {user.picture ? <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '2.6rem', fontWeight: 900 }}>{user.name?.charAt(0) || '?'}</span>}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                    >
                      <Camera size={22} color="#fff" />
                    </div>
                  </div>
                  <span style={{ position: 'absolute', bottom: -4, right: -4, zIndex: 3, background: '#10b981', color: '#fff', padding: '3px 10px', borderRadius: 100, fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.5px', border: '2px solid #0d0d0d' }}>ACTIVE</span>
                </div>

                {/* Info */}
                <div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.03em' }}>{user.name}</h1>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 7, margin: '0 0 10px' }}><Mail size={13} /> {user.email}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="pp-badge" style={{ background: 'rgba(255,107,44,0.12)', border: '1px solid rgba(255,107,44,0.25)', color: P }}><Zap size={10} /> {user.plan?.toUpperCase() || 'FREE'} PLAN</span>
                    <span className="pp-badge" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}><ShieldCheck size={10} /> VERIFIED</span>
                    <span className="pp-badge" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}><Calendar size={10} /> Since {memberSince}</span>
                  </div>
                </div>
              </div>

              {/* Right: meta info + actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>
                  <div>Account ID: <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontFamily: 'monospace' }}>{accountId}</span></div>
                  <div>Last Login: <span style={{ color: 'rgba(255,255,255,0.6)' }}>{lastLogin}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setEditName(user.name); setShowEditProfile(true); }} className="pp-ghost-btn">Edit Profile</button>
                  <button onClick={() => setShowSettings(true)} className="pp-orange-btn"><Settings size={14} style={{ display: 'inline', marginRight: 6 }} />Settings</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═════════ TABS ═════════ */}
        <div className="pp-tabs" style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pp-tab-btn${activeTab === tab ? ' active' : ''}`}>{tab}</button>
          ))}
        </div>

        {/* ═════════ OVERVIEW TAB ═════════ */}
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

              {/* Getting Started (for new users) */}
              {onboardPct < 100 && (
                <div className="pp-card pp-card-pad" style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 9 }}><Sparkles size={16} color={P} /> Welcome to BridgeAI 👋</h3>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: P }}>{onboardPct}% Complete</span>
                  </div>
                  <div className="pp-progress-track" style={{ marginBottom: 20 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${onboardPct}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', background: `linear-gradient(90deg, ${P}, #7C3AED)`, borderRadius: 100 }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 10 }}>
                    {['Install Extension', 'Complete First Transfer', 'Save First Context', 'Explore Dashboard'].map((s, i) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: onboardDone[i] ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${onboardDone[i] ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                        {onboardDone[i] ? <CheckCircle size={16} color="#34d399" /> : <Circle size={16} color="rgba(255,255,255,0.2)" />}
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: onboardDone[i] ? '#34d399' : 'rgba(255,255,255,0.5)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="pp-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Total Transfers',  value: stats.total || 27,  icon: <RefreshCw size={20}/>,  color: '#FF6B2C', bg: 'rgba(255,107,44,0.1)',  sub: 'All time' },
                  { label: 'Contexts Saved',   value: MOCK_VAULT.length,  icon: <Database size={20}/>,  color: '#a78bfa', bg: 'rgba(124,58,237,0.1)', sub: 'In vault' },
                  { label: 'Platforms Used',   value: 6,                  icon: <Globe size={20}/>,     color: '#64a0ff', bg: 'rgba(100,160,255,0.1)', sub: 'AI models' },
                  { label: 'Time Saved',       value: '13h',              icon: <Clock size={20}/>,     color: '#34d399', bg: 'rgba(16,185,129,0.1)', sub: 'Estimated' },
                ].map((s,i) => (
                  <motion.div key={i} className="pp-card pp-card-pad" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay: i*0.07 }}
                    style={{ cursor: 'default', transition: 'all 0.25s' }}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform=''}
                  >
                    <div style={{ width:42,height:42,borderRadius:13,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',color:s.color,marginBottom:14 }}>{s.icon}</div>
                    <div style={{ fontSize:'0.72rem',fontWeight:700,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5 }}>{s.label}</div>
                    <div style={{ fontSize:'1.9rem',fontWeight:800,letterSpacing:'-0.03em',color:'#f2f2f2' }}>{s.value}</div>
                    <div style={{ fontSize:'0.75rem',color:'rgba(255,255,255,0.3)',marginTop:2 }}>{s.sub}</div>
                  </motion.div>
                ))}
              </div>

              {/* Monthly Usage + Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
                {/* Monthly Usage */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Monthly Usage</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.usage || 2}<span style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>/{user.plan === 'infinite' ? '∞' : planLimit}</span></span>
                    <span style={{ fontSize: '0.8rem', color: P, fontWeight: 700 }}>{Math.round(usagePct || 66)}% used</span>
                  </div>
                  <div className="pp-progress-track">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${usagePct || 66}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} style={{ height: '100%', background: `linear-gradient(90deg,${P},#e85d1a)`, borderRadius: 100 }} />
                  </div>
                  <div style={{ marginTop:14, display:'flex', gap:10 }}>
                    <div style={{ flex:1, padding:'10px 14px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', fontSize:'0.78rem', color:'rgba(255,255,255,0.4)' }}>
                      Remaining <span style={{ display:'block', fontSize:'1rem', fontWeight:800, color:'#f2f2f2', marginTop:2 }}>{user.plan==='infinite'?'∞':Math.max(0,planLimit-(stats.usage||2))}</span>
                    </div>
                    <div style={{ flex:1, padding:'10px 14px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', fontSize:'0.78rem', color:'rgba(255,255,255,0.4)' }}>
                      Avg Time <span style={{ display:'block', fontSize:'1rem', fontWeight:800, color:'#f2f2f2', marginTop:2 }}>0.4s</span>
                    </div>
                    <div style={{ flex:1, padding:'10px 14px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', fontSize:'0.78rem', color:'rgba(255,255,255,0.4)' }}>
                      Success <span style={{ display:'block', fontSize:'1rem', fontWeight:800, color:'#34d399', marginTop:2 }}>98.7%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Quick Actions</div>
                  <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                    {[
                      { label:'Open Extension',   icon:<ExternalLink size={15}/>, to:'/extension' },
                      { label:'Start Transfer',   icon:<RefreshCw size={15}/>,   to:'/dashboard' },
                      { label:'View Docs',         icon:<BookOpen size={15}/>,    to:'/docs' },
                      { label:'Upgrade Plan',      icon:<Zap size={15}/>,         to:'/services' },
                      { label:'Contact Support',   icon:<HelpCircle size={15}/>,  to:'/support' },
                    ].map(a => (
                      <Link key={a.label} to={a.to} onClick={() => window.scrollTo(0,0)} className="pp-action-btn">
                        <span style={{ color: P }}>{a.icon}</span>{a.label}<ChevronRight size={14} style={{ marginLeft:'auto', opacity:0.4 }} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Platforms + Achievements */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }}>
                {/* AI Platforms */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">AI Platforms Used</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    {MOCK_PLATFORMS.map(p => (
                      <div key={p.name}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.85rem', fontWeight:600 }}>
                            <span style={{ width:26,height:26,borderRadius:8,background:`${p.color}18`,display:'flex',alignItems:'center',justifyContent:'center' }}>{p.logo}</span>
                            {p.name}
                          </div>
                          <span style={{ fontWeight:800, fontSize:'0.82rem', color:p.color }}>{p.pct}%</span>
                        </div>
                        <div className="pp-progress-track">
                          <motion.div className="pp-platform-bar" initial={{ width:0 }} animate={{ width:`${p.pct}%` }} transition={{ duration:1,ease:'easeOut' }} style={{ background: p.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label" style={{ display:'flex', justifyContent:'space-between' }}>
                    <span>Achievements</span>
                    <span style={{ color:P }}>🏆 {MOCK_ACHIEVEMENTS.filter(a=>a.earned).length}/{MOCK_ACHIEVEMENTS.length}</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {MOCK_ACHIEVEMENTS.map(a => (
                      <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:13, background: a.earned ? 'rgba(255,107,44,0.05)' : 'rgba(255,255,255,0.01)', border:`1px solid ${a.earned ? 'rgba(255,107,44,0.2)' : 'rgba(255,255,255,0.05)'}`, opacity: a.earned ? 1 : 0.45 }}>
                        <span style={{ fontSize:'1.3rem' }}>{a.icon}</span>
                        <span style={{ fontWeight:700, fontSize:'0.85rem', color: a.earned ? '#f2f2f2' : 'rgba(255,255,255,0.4)' }}>{a.label}</span>
                        {a.earned && <CheckCircle size={14} color="#34d399" style={{ marginLeft:'auto' }} />}
                        {!a.earned && <Lock size={13} color="rgba(255,255,255,0.2)" style={{ marginLeft:'auto' }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Insights row */}
              <div className="pp-card pp-card-pad" style={{ marginBottom:28 }}>
                <div className="pp-section-label">Insights</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                  {[
                    { label:'Most Used AI',        val:'ChatGPT',  logo:<ChatGPTLogo />, color:'#74aa9c' },
                    { label:'Favorite Destination', val:'Claude',   logo:<ClaudeLogo />,  color:'#D97757' },
                    { label:'Avg Transfer Time',   val:'0.4 sec',  logo:<Zap size={20} color={P}/>, color:P },
                    { label:'Most Active Day',     val:'Monday',   logo:<Calendar size={20} color="#a78bfa"/>, color:'#a78bfa' },
                  ].map(i => (
                    <div key={i.label} style={{ padding:'16px', borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', textAlign:'center' }}>
                      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', width:40, height:40, borderRadius:12, background:`${i.color}18`, margin:'0 auto 10px' }}>{i.logo}</div>
                      <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>{i.label}</div>
                      <div style={{ fontWeight:800, fontSize:'0.95rem', color: i.color }}>{i.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transfers + Activity Timeline */}
              <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:20 }}>
                {/* Recent Transfers */}
                <div className="pp-card">
                  <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <h4 style={{ margin:0, fontSize:'0.95rem', fontWeight:800, display:'flex', alignItems:'center', gap:8 }}><RefreshCw size={15} color={P} /> Recent Transfers</h4>
                    <Link to="/dashboard" style={{ fontSize:'0.78rem', color:P, textDecoration:'none', fontWeight:700 }}>View All <ArrowUpRight size={12} style={{ display:'inline' }}/></Link>
                  </div>
                  <div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'10px 24px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      {['Source','Destination','Date'].map(h=><span key={h} style={{ fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'rgba(255,255,255,0.25)' }}>{h}</span>)}
                    </div>
                    {displayTransfers.map((t,i) => (
                      <div key={i} className="transfer-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'13px 24px', borderBottom:'1px solid rgba(255,255,255,0.03)', transition:'background 0.2s' }}>
                        <span style={{ fontWeight:700, fontSize:'0.85rem' }}>{t.source}</span>
                        <span style={{ fontWeight:600, fontSize:'0.85rem', color:'rgba(255,255,255,0.5)' }}>{t.dest}</span>
                        <span style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.35)' }}>{t.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Activity Timeline</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                    {Object.entries(activityGroups).map(([day, items]) => (
                      <div key={day}>
                        <div style={{ fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,0.25)', padding:'8px 0 6px' }}>{day}</div>
                        {items.map((item,j) => (
                          <div key={j} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ width:22,height:22,borderRadius:8,background:'rgba(16,185,129,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2 }}>
                              <CheckCircle size={12} color="#34d399" />
                            </div>
                            <div>
                              <div style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.8)', lineHeight:1.4 }}>{item.text}</div>
                              <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.25)', marginTop:2 }}>{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═════════ CONTEXT VAULT TAB ═════════ */}
          {activeTab === 'Context Vault' && (
            <motion.div key="vault" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <h3 style={{ margin:0, fontSize:'1.1rem', fontWeight:800, display:'flex', alignItems:'center', gap:10 }}><Archive size={18} color={P} /> My Context Vault</h3>
                <button className="pp-orange-btn">+ New Context</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {MOCK_VAULT.map((v, i) => (
                  <motion.div key={v.id} className="pp-card" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                    style={{ padding:'18px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,107,44,0.25)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform=''; }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ width:42,height:42,borderRadius:13,background:'rgba(124,58,237,0.1)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                        <Database size={18} color="#a78bfa" />
                      </div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:4 }}>{v.title}</div>
                        <div style={{ display:'flex', gap:6 }}>
                          {v.tags.map(t=><span key={t} style={{ padding:'2px 8px', borderRadius:6, background:'rgba(255,107,44,0.08)', border:'1px solid rgba(255,107,44,0.18)', fontSize:'0.65rem', fontWeight:700, color:P }}>{t}</span>)}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', marginBottom:4 }}>{v.updated}</div>
                      <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.25)' }}>{v.size}</div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button className="pp-ghost-btn" style={{ padding:'7px 14px', fontSize:'0.78rem' }}>Open</button>
                      <button className="pp-orange-btn" style={{ padding:'7px 14px', fontSize:'0.78rem' }}>Restore</button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div style={{ marginTop:20, padding:'14px 20px', borderRadius:14, background:'rgba(255,255,255,0.01)', border:'1px dashed rgba(255,255,255,0.08)', textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:'0.82rem' }}>
                Context Vault auto-saves your sessions. Start a transfer to build your vault.
              </div>
            </motion.div>
          )}

          {/* ═════════ SECURITY TAB ═════════ */}
          {activeTab === 'Security' && (
            <motion.div key="security" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                {/* Status Overview */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Security Center</div>
                  {[
                    { label:'Encryption Status',  val:'AES-256-GCM Active', ok:true },
                    { label:'Session Protection',  val:'JWT + Refresh Token', ok:true },
                    { label:'Security Keys',       val:'RSA-4096, Active',   ok:true },
                    { label:'2FA',                 val:'Not Configured',     ok:false },
                  ].map(r=>(
                    <div key={r.label} className="pp-row">
                      <span className="pp-row-label">{r.label}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:6, fontWeight:700, fontSize:'0.82rem', color: r.ok?'#34d399':'#f87171' }}>
                        {r.ok?<CheckCircle size={13}/>:<AlertTriangle size={13}/>} {r.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recent Logins */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Connected Devices</div>
                  {MOCK_DEVICES.map((d,i)=>(
                    <div key={i} className="pp-row">
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ color:'rgba(255,255,255,0.4)' }}>{d.icon}</span>
                        <div>
                          <div style={{ fontWeight:600, fontSize:'0.85rem' }}>{d.name}</div>
                          <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.3)' }}>{d.last}</div>
                        </div>
                      </div>
                      {d.current
                        ? <span style={{ padding:'2px 9px', borderRadius:6, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', fontSize:'0.62rem', fontWeight:800, color:'#34d399' }}>CURRENT</span>
                        : <button className="pp-danger-btn" style={{ padding:'4px 10px', fontSize:'0.72rem' }}>Revoke</button>
                      }
                    </div>
                  ))}
                </div>

                {/* Security Actions */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Security Actions</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    <button className="pp-action-btn"><RefreshCw size={15} color={P}/>Refresh Security Keys</button>
                    <button className="pp-action-btn"><LogOut size={15} color="#f87171}"/>
                      <span style={{ color:'#f87171' }}>Logout All Devices</span>
                    </button>
                    <button className="pp-action-btn"><Download size={15} color={P}/>Download Security Report</button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Notifications</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {['Extension Updated','Security Key Refreshed','Transfer Completed','Quota Limit Reached'].map((n,i)=>(
                      <div key={n} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', borderRadius:12, background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9, fontSize:'0.83rem', fontWeight:600 }}>
                          <Bell size={13} color={P} />{n}
                        </div>
                        <div style={{ width:36,height:20,borderRadius:10,background:settingsForm.notifications?'rgba(255,107,44,0.8)':'rgba(255,255,255,0.1)',position:'relative',cursor:'pointer',transition:'background 0.2s' }}
                          onClick={()=>setSettingsForm(f=>({...f,notifications:!f.notifications}))}>
                          <div style={{ width:14,height:14,borderRadius:'50%',background:'white',position:'absolute',top:3,left:settingsForm.notifications?18:4,transition:'left 0.2s' }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═════════ BILLING TAB ═════════ */}
          {activeTab === 'Billing' && (
            <motion.div key="billing" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:20 }}>
                {/* Plan Details */}
                <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                  <div className="pp-card pp-card-pad">
                    <div className="pp-section-label">Current Plan</div>
                    <div style={{ fontSize:'2.5rem', fontWeight:900, color: user.plan==='pro'?P:'rgba(255,255,255,0.8)', marginBottom:4 }}>
                      {user.plan==='pro'?'Pro':'Free'}
                    </div>
                    <div style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.35)', marginBottom:18 }}>
                      {user.plan==='pro'?'₹299/month · Unlimited Features':'₹0 · Limited Access'}
                    </div>
                    <div className="pp-progress-track" style={{ marginBottom:10 }}>
                      <motion.div initial={{width:0}} animate={{width:`${usagePct||66}%`}} transition={{duration:1.2}} style={{height:'100%',background:`linear-gradient(90deg,${P},#e85d1a)`,borderRadius:100}}/>
                    </div>
                    <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.35)', marginBottom:20 }}>
                      {stats.usage || 2} / {user.plan==='infinite'?'∞':planLimit} Transfers Used
                    </div>
                    {user.plan !== 'pro' && (
                      <div>
                        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>Upgrade benefits:</div>
                        {['Unlimited Transfers','Context Vault','Priority Support','Early Access'].map(b=>(
                          <div key={b} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7, fontSize:'0.83rem', color:'rgba(255,255,255,0.6)' }}>
                            <CheckCircle size={13} color={P}/>{b}
                          </div>
                        ))}
                        <Link to="/services" onClick={()=>window.scrollTo(0,0)}>
                          <button className="pp-orange-btn" style={{ width:'100%', marginTop:16, padding:'12px', fontSize:'0.9rem' }}>
                            <Zap size={15} style={{ display:'inline', marginRight:6 }}/>Upgrade to Pro
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Billing History */}
                <div className="pp-card">
                  <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <h4 style={{ margin:0, fontSize:'0.95rem', fontWeight:800 }}>Billing History</h4>
                    <button className="pp-ghost-btn"><Download size={13} style={{ display:'inline', marginRight:5 }}/>Export</button>
                  </div>
                  {invoices.length === 0 ? (
                    <div style={{ padding:'60px 24px', textAlign:'center' }}>
                      <CreditCard size={40} color="rgba(255,255,255,0.06)" style={{ marginBottom:12 }}/>
                      <div style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.9rem' }}>No invoices yet.</div>
                    </div>
                  ) : (
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr>
                          {['Invoice ID','Date','Plan','Amount',''].map(h=>(
                            <th key={h} style={{ padding:'12px 24px', textAlign:'left', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'rgba(255,255,255,0.25)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv,i)=>(
                          <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding:'14px 24px', fontSize:'0.8rem', fontFamily:'monospace' }}>#{inv.id?.slice(0,8)}</td>
                            <td style={{ padding:'14px 24px', fontSize:'0.82rem', color:'rgba(255,255,255,0.5)' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                            <td style={{ padding:'14px 24px' }}><span style={{ padding:'3px 10px', borderRadius:6, background:'rgba(255,107,44,0.1)', color:P, fontSize:'0.65rem', fontWeight:800 }}>{inv.plan?.toUpperCase()}</span></td>
                            <td style={{ padding:'14px 24px', fontWeight:800 }}>₹{inv.amount}</td>
                            <td style={{ padding:'14px 24px' }}><button onClick={()=>{}} style={{ padding:'5px 10px', borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.5)', cursor:'pointer', transition:'all 0.2s' }}><Download size={13}/></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═════════ SUPPORT & EXPORT TAB ═════════ */}
          {activeTab === 'Support' && (
            <motion.div key="support" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                {/* Support Section */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Support</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      { label:'Documentation',    icon:<BookOpen size={15}/>,     to:'/docs' },
                      { label:'Discord Community', icon:<MessageSquare size={15}/>, href:'https://discord.gg' },
                      { label:'Email Support',    icon:<Mail size={15}/>,          href:'mailto:business@entrext.in' },
                      { label:'Feature Requests', icon:<Star size={15}/>,          to:'/support' },
                      { label:'Report Bug',       icon:<Bug size={15}/>,           to:'/support' },
                    ].map(a=>(
                      a.to
                        ? <Link key={a.label} to={a.to} className="pp-action-btn" onClick={()=>window.scrollTo(0,0)}><span style={{ color:P }}>{a.icon}</span>{a.label}<ChevronRight size={14} style={{ marginLeft:'auto', opacity:0.4 }}/></Link>
                        : <a key={a.label} href={a.href} className="pp-action-btn" target="_blank" rel="noopener noreferrer"><span style={{ color:P }}>{a.icon}</span>{a.label}<ExternalLink size={12} style={{ marginLeft:'auto', opacity:0.4 }}/></a>
                    ))}
                  </div>
                </div>

                {/* Export & Backup */}
                <div className="pp-card pp-card-pad">
                  <div className="pp-section-label">Export & Backup</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      { label:'Download Transfer History', icon:<Download size={15}/> },
                      { label:'Export Context Vault',      icon:<Archive size={15}/> },
                      { label:'Backup Settings',           icon:<Database size={15}/> },
                    ].map(a=>(
                      <button key={a.label} className="pp-action-btn"><span style={{ color:P }}>{a.icon}</span>{a.label}</button>
                    ))}
                    <div style={{ marginTop:8, padding:'1px 0' }}>
                      <div style={{ fontSize:'0.7rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(239,68,68,0.5)', marginBottom:10 }}>Danger Zone</div>
                      <button className="pp-danger-btn" style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}>
                        <AlertTriangle size={14}/>Delete Account Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═════════ EDIT PROFILE MODAL ═════════ */}
      <AnimatePresence>
        {showEditProfile && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setShowEditProfile(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(10px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          >
            <motion.div initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:20 }}
              onClick={e=>e.stopPropagation()}
              style={{ background:'#111', borderRadius:22, border:'1px solid rgba(255,255,255,0.08)', width:420, padding:32, boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h3 style={{ margin:0, fontWeight:800, fontSize:'1.1rem' }}>Edit Profile</h3>
                <button onClick={()=>setShowEditProfile(false)} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', padding:4, borderRadius:8 }}><X size={18}/></button>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:'0.78rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>Full Name</label>
                <input className="pp-input" value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Enter your name" />
              </div>
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:'0.78rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>Email (cannot change)</label>
                <input className="pp-input" value={user.email} disabled style={{ opacity:0.4, cursor:'not-allowed' }} />
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button onClick={()=>setShowEditProfile(false)} className="pp-ghost-btn">Cancel</button>
                <button onClick={handleSaveName} className="pp-orange-btn">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═════════ SETTINGS MODAL ═════════ */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={()=>setShowSettings(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(10px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          >
            <motion.div initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:20 }}
              onClick={e=>e.stopPropagation()}
              style={{ background:'#111', borderRadius:22, border:'1px solid rgba(255,255,255,0.08)', width:480, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div style={{ padding:'20px 28px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, display:'flex', alignItems:'center', gap:10 }}><Settings size={16} color={P}/> Preferences</h3>
                <button onClick={()=>setShowSettings(false)} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', borderRadius:8, padding:4 }}><X size={18}/></button>
              </div>
              <div style={{ padding:28, display:'flex', flexDirection:'column', gap:0 }}>
                {[
                  { key:'notifications', label:'Push Notifications', desc:'Get notified on transfer events' },
                  { key:'autoBridge',    label:'Auto-Bridge Mode',   desc:'Automatically continue sessions' },
                  { key:'secureMode',    label:'Secure Mode',        desc:'End-to-end encryption enforced' },
                ].map(row=>(
                  <div key={row.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <h4 style={{ margin:'0 0 3px', fontSize:'0.9rem', fontWeight:700 }}>{row.label}</h4>
                      <p style={{ margin:0, fontSize:'0.78rem', color:'rgba(255,255,255,0.3)' }}>{row.desc}</p>
                    </div>
                    <div style={{ width:44,height:22,borderRadius:11,background:settingsForm[row.key]?'rgba(255,107,44,0.8)':'rgba(255,255,255,0.1)',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0 }}
                      onClick={()=>setSettingsForm(f=>({...f,[row.key]:!f[row.key]}))}>
                      <div style={{ width:16,height:16,borderRadius:'50%',background:'white',position:'absolute',top:3,left:settingsForm[row.key]?24:4,transition:'left 0.3s',boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding:'18px 28px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'flex-end', gap:12 }}>
                <button onClick={()=>setShowSettings(false)} className="pp-ghost-btn">Cancel</button>
                <button onClick={async()=>{
                  try { await fetch(`${API_BASE}/api/user/settings`,{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:user.email, settings:settingsForm }) }); } catch(e){}
                  setShowSettings(false);
                }} className="pp-orange-btn">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
