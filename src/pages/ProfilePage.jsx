import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  CreditCard, 
  Download, 
  ShieldCheck,
  Calendar,
  Activity,
  Layers,
  ExternalLink,
  Settings,
  Mail,
  MoreVertical,
  Key,
  Database,
  X,
  Bell,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../apiConfig';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({ usage: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  
  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ notifications: true, autoBridge: false, secureMode: true });

  useEffect(() => {
    const stored = localStorage.getItem('bridge_user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      fetchInvoices(userData.email);
      fetchStats(userData.email);
      fetchSettings(userData.email);
    }
    setLoading(false);
  }, []);

  const fetchSettings = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/settings?email=${email}`);
      const data = await res.json();
      if (data.success && data.settings) setSettingsForm(data.settings);
    } catch (err) { console.error("Settings fetch error:", err); }
  };

  const saveSettings = async () => {
    try {
      await fetch(`${API_BASE}/api/user/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, settings: settingsForm })
      });
      setShowSettings(false);
    } catch (err) { console.error("Settings update error:", err); }
  };

  const fetchInvoices = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/invoices?email=${email}`);
      const data = await res.json();
      if (data.success) setInvoices(data.invoices);
    } catch (err) { console.error("Billing fetch error:", err); }
  };

  const fetchStats = async (email) => {
    try {
      // Get current month usage
      const resStatus = await fetch(`${API_BASE}/api/user/status?email=${email}`);
      const dataStatus = await resStatus.json();
      
      // Get total bridges
      const resBridges = await fetch(`${API_BASE}/api/bridges?email=${email}`);
      const dataBridges = await resBridges.json();
      
      if (dataStatus.success && dataBridges.success) {
        setStats({
          usage: dataStatus.usage,
          total: dataBridges.data.length
        });
      }
    } catch (err) { console.error("Stats fetch error:", err); }
  };

  const downloadInvoice = (invoice) => {
    const content = `BRIDGEAI SOVEREIGN INVOICE\nID: ${invoice.id}\nDate: ${new Date(invoice.created_at).toLocaleDateString()}\nPlan: ${invoice.plan.toUpperCase()}\nAmount: $${invoice.amount}\nStatus: PAID`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${invoice.id}.txt`;
    a.click();
  };

  if (loading) return null;
  if (!user) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}><h2 className="premium-gradient-text">Please sign in to view protocol.</h2></div>;

  return (
    <div className="page-transition" style={{ padding: '80px 0 120px', background: 'transparent' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container" 
        style={{ maxWidth: '1100px' }}
      >
        
        {/* Identity & Navigation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '32px', 
                background: 'var(--gradient-1)', padding: '3px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                position: 'relative', zIndex: 2
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '29px', background: '#020617', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {user.picture ? (
                    <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '3rem', fontWeight: '900', color: 'white' }}>{user.name?.charAt(0) || <User size={40} />}</div>
                  )}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '900', border: '3px solid #020617', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 3, letterSpacing: '0.5px' }}>
                ACTIVE
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-0.04em', margin: 0 }}>{user.name}</h1>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '800', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  {user.plan?.toUpperCase() || 'FREE'} ANALYST
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', margin: 0 }}>
                <Mail size={16} /> {user.email}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/dashboard" className="btn-secondary" style={{ padding: '12px 24px' }}><Layers size={18} /> Dashboard</Link>
            <button onClick={() => setShowSettings(true)} className="btn-primary" style={{ padding: '12px 24px' }}><Settings size={18} /> Settings</button>
          </div>
        </div>

        {/* Professional Metrics Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {[
            { label: 'Intelligence Extractions', value: stats.total, icon: <Database size={24} color="var(--primary)" />, sub: 'Total session bridges stored', progress: null },
            { label: 'Active Quota Usage', value: `${stats.usage}/${user.plan === 'pro' ? 100 : user.plan === 'infinite' ? '∞' : 3}`, icon: <Activity size={24} color="var(--secondary)" />, sub: 'Current monthly cycle', progress: (user.plan === 'infinite' ? 100 : Math.min(100, (stats.usage / (user.plan === 'pro' ? 100 : 3)) * 100)) },
            { label: 'Sovereign Protocol', value: 'Active', icon: <ShieldCheck size={24} color="#10b981" />, sub: 'End-to-end context encryption', progress: null }
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(139, 92, 246, 0.4)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.5px' }}>{item.label}</span>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>{item.icon}</div>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1px' }}>{item.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.sub}</div>
              {item.progress !== null && (
                <div style={{ marginTop: '20px', height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} transition={{ duration: 1, delay: 0.5 }} style={{ height: '100%', background: 'var(--gradient-1)' }} />
                </div>
              )}
              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.02, transform: 'scale(4)' }}>{item.icon}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Main Console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Billing Ledger */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CreditCard size={22} color="var(--primary)" /> Financial Ledger
                </h3>
                <Link to="/services" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Upgrade Plan <ExternalLink size={14} /></Link>
              </div>
              <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                {invoices.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center' }}>
                    <CreditCard size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No transaction logs detected in local hub.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '18px 24px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Reference ID</th>
                        <th style={{ padding: '18px 24px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Sovereign Tier</th>
                        <th style={{ padding: '18px 24px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Amount</th>
                        <th style={{ padding: '18px 24px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv, idx) => (
                        <motion.tr key={inv.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                          <td style={{ padding: '20px 24px', fontSize: '0.9rem', fontWeight: '700', fontFamily: 'monospace' }}>{inv.id}</td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ 
                                padding: '4px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800',
                                background: inv.plan==='infinite' ? 'rgba(6,182,212,0.1)' : 'rgba(139,92,246,0.1)',
                                color: inv.plan==='infinite' ? 'var(--secondary)' : 'var(--primary)'
                            }}>{inv.plan.toUpperCase()}</span>
                          </td>
                          <td style={{ padding: '20px 24px', fontWeight: '800', fontSize: '1.1rem' }}>${inv.amount}</td>
                          <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                            <button onClick={() => downloadInvoice(inv)} className="btn-exit-minimal" style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', opacity: 0.8 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.8}>
                              <Download size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

          </div>

          {/* Sidebar Protocol Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Security Protocol */}
            <section>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Key size={22} color="var(--primary)" /> Protocol State
              </h3>
              <div className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Auth Method</span>
                    <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'white' }}>{user.google_id ? 'Google Sovereign' : 'Standard RSA'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Data Residency</span>
                    <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'white' }}>EU-Central-1</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Encryption</span>
                    <span style={{ fontWeight: '900', fontSize: '1.2rem', color: settingsForm.secureMode ? '#10b981' : 'var(--text-muted)', letterSpacing: '1px' }}>
                      {settingsForm.secureMode ? 'AES-256-GCM' : 'Standard TLS'}
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--glass-border)', margin: '8px 0' }} />
                  <button className="btn-secondary" style={{ width: '100%', fontSize: '0.9rem', padding: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                    Rotate Cipher Keys
                  </button>
                </div>
              </div>
            </section>

            {/* Session Info */}
            <section>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} color="var(--secondary)" /> Activity Log
              </h3>
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '2px', background: 'var(--primary)', margin: '4px 0' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Protocol Initialized</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(user.created_at || Date.now()).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '2px', background: 'var(--secondary)', margin: '4px 0' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Last Handshake</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attempt detected from Hub-24</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section style={{ marginTop: '20px' }}>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                   <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '900', letterSpacing: '1.5px', marginBottom: '12px', textTransform: 'uppercase' }}>Critical Actions</p>
                   <button className="btn-exit-minimal" style={{ width: '100%', textAlign: 'center', justifyContent: 'center', borderColor: 'rgba(244,63,94,0.2)', padding: '14px', fontSize: '0.9rem', fontWeight: '800' }}>
                       Revoke Sovereign Access
                   </button>
                </motion.div>
            </section>

          </div>
        </div>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card"
              style={{ width: '500px', maxWidth: '90%', background: '#020617', padding: '0', overflow: 'hidden' }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Settings size={22} color="var(--primary)" /> Profile Settings
                </h3>
                <button onClick={() => setShowSettings(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={16} color="var(--secondary)" /> Push Notifications
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Receive alerts on bridge extraction rates.</p>
                  </div>
                  <button 
                    onClick={() => setSettingsForm({ ...settingsForm, notifications: !settingsForm.notifications })}
                    style={{ width: '48px', height: '24px', borderRadius: '12px', background: settingsForm.notifications ? 'var(--primary)' : 'rgba(255,255,255,0.1)', position: 'relative', border: 'none', cursor: 'pointer', transition: '0.3s' }}
                  >
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: settingsForm.notifications ? '26px' : '2px', transition: '0.3s' }} />
                  </button>
                </div>

                <div style={{ height: '1px', background: 'var(--glass-border)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={16} color="var(--primary)" /> Auto-Bridge Sync
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automatically bridge data when extension is open.</p>
                  </div>
                  <button 
                    onClick={() => setSettingsForm({ ...settingsForm, autoBridge: !settingsForm.autoBridge })}
                    style={{ width: '48px', height: '24px', borderRadius: '12px', background: settingsForm.autoBridge ? 'var(--primary)' : 'rgba(255,255,255,0.1)', position: 'relative', border: 'none', cursor: 'pointer', transition: '0.3s' }}
                  >
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: settingsForm.autoBridge ? '26px' : '2px', transition: '0.3s' }} />
                  </button>
                </div>

                <div style={{ height: '1px', background: 'var(--glass-border)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={16} color="#10b981" /> Strict Secure Mode
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enforce TLS 1.3 only for vault synchronization.</p>
                  </div>
                  <button 
                    onClick={() => setSettingsForm({ ...settingsForm, secureMode: !settingsForm.secureMode })}
                    style={{ width: '48px', height: '24px', borderRadius: '12px', background: settingsForm.secureMode ? 'var(--primary)' : 'rgba(255,255,255,0.1)', position: 'relative', border: 'none', cursor: 'pointer', transition: '0.3s' }}
                  >
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: settingsForm.secureMode ? '26px' : '2px', transition: '0.3s' }} />
                  </button>
                </div>

              </div>
              <div style={{ padding: '24px 32px', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <button onClick={() => setShowSettings(false)} className="btn-secondary">Cancel</button>
                <button onClick={saveSettings} className="btn-primary">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProfilePage;
