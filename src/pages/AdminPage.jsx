import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, CreditCard, Mail, Database, 
  TrendingUp, Search, Trash2, Edit3, Key, LogOut, CheckCircle, 
  XCircle, ArrowRight, Eye, RefreshCw, Terminal
} from 'lucide-react';
import { apiFetch } from '../apiConfig';
import SEOHelmet from '../components/SEOHelmet';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  
  // Dashboard data states
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [bridges, setBridges] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  
  // Search and Filter states
  const [userSearch, setUserSearch] = useState('');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [bridgeSearch, setBridgeSearch] = useState('');
  
  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState('');
  const [loadingSql, setLoadingSql] = useState(false);

  // Modal view state
  const [selectedBridge, setSelectedBridge] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Check login on mount
  useEffect(() => {
    const token = sessionStorage.getItem('bridge_admin_token');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  // Fetch dashboard data when authenticated
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchTabContent(activeTab);
    }
  }, [isAdmin, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoadingLogin(true);
    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('bridge_admin_token', data.token);
        setIsAdmin(true);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server error during login');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bridge_admin_token');
    setIsAdmin(false);
    setStats(null);
    setUsers([]);
    setFeedbacks([]);
    setBridges([]);
    setInvoices([]);
    setSubscribers([]);
  };

  // Helper for admin headers
  const getAdminHeaders = () => {
    const token = sessionStorage.getItem('bridge_admin_token');
    return {
      'x-admin-token': token || ''
    };
  };

  const fetchStats = async () => {
    try {
      const res = await apiFetch('/api/admin/stats', {
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchTabContent = async (tab) => {
    setLoadingData(true);
    try {
      const headers = getAdminHeaders();
      if (tab === 'feedbacks') {
        const res = await apiFetch('/api/admin/feedbacks', { headers });
        const data = await res.json();
        if (res.ok) setFeedbacks(data.feedbacks);
      } else if (tab === 'users') {
        const res = await apiFetch('/api/admin/users', { headers });
        const data = await res.json();
        if (res.ok) setUsers(data.users);
      } else if (tab === 'bridges') {
        const res = await apiFetch('/api/admin/bridges', { headers });
        const data = await res.json();
        if (res.ok) setBridges(data.bridges);
      } else if (tab === 'invoices') {
        const res = await apiFetch('/api/admin/invoices', { headers });
        const data = await res.json();
        if (res.ok) setInvoices(data.invoices);
      } else if (tab === 'subscribers') {
        const res = await apiFetch('/api/admin/subscribers', { headers });
        const data = await res.json();
        if (res.ok) setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
    } finally {
      setLoadingData(false);
    }
  };

  // Actions
  const handleUpdateUserPlan = async (userEmail, newPlan) => {
    if (!window.confirm(`Are you sure you want to change plan for ${userEmail} to ${newPlan.toUpperCase()}?`)) return;
    try {
      const res = await apiFetch(`/api/admin/users/${userEmail}`, {
        method: 'PATCH',
        headers: {
          ...getAdminHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: newPlan })
      });
      if (res.ok) {
        fetchTabContent('users');
        fetchStats();
      } else {
        alert('Failed to update plan');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userEmail) => {
    if (!window.confirm(`⚠️ WARNING: Deleting user ${userEmail} will permanently erase all associated bridges, context layers, project history, and invoices. This action CANNOT be undone. Proceed?`)) return;
    try {
      const res = await apiFetch(`/api/admin/users/${userEmail}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        fetchTabContent('users');
        fetchStats();
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateFeedbackStatus = async (id, newStatus) => {
    try {
      const res = await apiFetch(`/api/admin/feedbacks/${id}`, {
        method: 'PATCH',
        headers: {
          ...getAdminHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTabContent('feedbacks');
        fetchStats();
      } else {
        alert('Failed to update feedback status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      const res = await apiFetch(`/api/admin/feedbacks/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        fetchTabContent('feedbacks');
        fetchStats();
      } else {
        alert('Failed to delete feedback');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBridge = async (id) => {
    if (!window.confirm('Delete this bridge distillation?')) return;
    try {
      const res = await apiFetch(`/api/admin/bridges/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        fetchTabContent('bridges');
        fetchStats();
      } else {
        alert('Failed to delete bridge');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriber = async (subEmail) => {
    if (!window.confirm(`Delete subscriber ${subEmail}?`)) return;
    try {
      const res = await apiFetch(`/api/admin/subscribers/${subEmail}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        fetchTabContent('subscribers');
        fetchStats();
      } else {
        alert('Failed to delete subscriber');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const executeSqlQuery = async (e) => {
    e.preventDefault();
    setSqlError('');
    setSqlResult(null);
    setLoadingSql(true);
    try {
      const res = await apiFetch('/api/admin/db-query', {
        method: 'POST',
        headers: {
          ...getAdminHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sqlQuery })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSqlResult(data.result);
      } else {
        setSqlError(data.error || 'Failed to execute query');
      }
    } catch (err) {
      setSqlError(err.message || 'Error executing query');
    } finally {
      setLoadingSql(false);
    }
  };

  // Render Login Panel
  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px',
        background: 'transparent',
        fontFamily: "'Inter', sans-serif"
      }}>
        <SEOHelmet 
          title="Admin Control - Login" 
          description="Sovereign admin panel authentication portal." 
        />
        
        <div className="glass-card" style={{
          maxWidth: '440px',
          width: '100%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '16px', 
              background: 'var(--primary-soft)', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
              marginBottom: '16px'
            }}>
              <Key size={28} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text)' }}>
              Admin <span style={{ color: 'var(--primary)' }}>Access Portal</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Authentication is required to view database ledgers.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Email
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="entrext1@gmail.com"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  border: '1px solid var(--border)', background: 'var(--bg-main)',
                  color: 'var(--text)', outline: 'none', fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  border: '1px solid var(--border)', background: 'var(--bg-main)',
                  color: 'var(--text)', outline: 'none', fontSize: '0.95rem'
                }}
              />
            </div>

            {loginError && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px', padding: '10px 14px', color: '#f87171', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <XCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loadingLogin}
              className="btn-primary" 
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                fontSize: '1rem', fontWeight: '700'
              }}
            >
              {loadingLogin ? 'Verifying...' : <>Authenticate <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredFeedbacks = feedbacks.filter(f => 
    feedbackFilter === 'all' ? true : f.status === feedbackFilter
  );

  const filteredBridges = bridges.filter(b => 
    b.title.toLowerCase().includes(bridgeSearch.toLowerCase()) ||
    b.user_email.toLowerCase().includes(bridgeSearch.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      color: 'var(--text)',
      padding: '120px 20px 80px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <SEOHelmet 
        title="Admin Control Center" 
        description="Core dashboard for platform analytics, user registries, database operations and customer feedbacks."
      />

      <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
        
        {/* Top Header Bar */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '40px', flexWrap: 'wrap', gap: '20px',
          borderBottom: '1px solid var(--border)', paddingBottom: '24px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>
              Sovereign Console
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text)', marginTop: '4px', letterSpacing: '-0.03em' }}>
              Control Center
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => fetchStats()}
              style={{
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '10px', color: 'var(--text)', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Reload stats"
            >
              <RefreshCw size={16} />
            </button>
            <button 
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px', padding: '10px 18px', color: '#f87171', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '700'
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="features-grid" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '20px', marginBottom: '40px' 
        }}>
          {[
            { label: 'Total Users', value: stats?.users ?? '...', icon: <Users size={20} />, color: 'var(--primary)' },
            { label: 'Total Syncs/Bridges', value: stats?.bridges ?? '...', icon: <Database size={20} />, color: '#7c3aed' },
            { label: 'Pending Issues', value: stats?.feedbacks ?? '...', icon: <MessageSquare size={20} />, color: '#cd6b6b' },
            { label: 'Total Invoices', value: stats?.invoices ?? '...', icon: <CreditCard size={20} />, color: '#10b981' },
            { label: 'Revenue (USD)', value: stats ? `$${stats.revenue.toFixed(2)}` : '...', icon: <TrendingUp size={20} />, color: '#059669' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card" style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: '18px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                color: item.color
              }}>
                {item.icon}
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '600' }}>{item.label}</span>
                <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: '900', color: 'var(--text)', marginTop: '2px' }}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Tab Controller Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Navigation Sidebar */}
          <div className="glass-card" style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', padding: '8px 12px' }}>
              Database ledgers
            </span>
            {[
              { id: 'overview', label: 'Console Home', icon: <Database size={16} /> },
              { id: 'feedbacks', label: 'Issues & Feedbacks', icon: <MessageSquare size={16} /> },
              { id: 'users', label: 'User Directory', icon: <Users size={16} /> },
              { id: 'bridges', label: 'Bridge Logs', icon: <Database size={16} /> },
              { id: 'invoices', label: 'Billing Invoices', icon: <CreditCard size={16} /> },
              { id: 'subscribers', label: 'Subscribers List', icon: <Mail size={16} /> },
              { id: 'sql', label: 'SQL console', icon: <Terminal size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  background: activeTab === tab.id ? 'var(--primary-soft)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                  fontSize: '0.9rem', fontWeight: '700', textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Display Area */}
          <div className="glass-card" style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '32px', minHeight: '500px',
            boxShadow: 'var(--shadow)'
          }}>
            {loadingData && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  border: '3px solid var(--primary-soft)', borderTopColor: 'var(--primary)',
                  animation: 'spin 1s linear infinite', margin: '0 auto 16px'
                }} />
                <span>Loading records...</span>
              </div>
            )}

            {!loadingData && activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '16px' }}>Control Panel Dashboard</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.7', marginBottom: '24px' }}>
                  Welcome to the BridgeAI Sovereign Control Center. Use the left menu to browse database schemas, manage issues, configure users, and inspect telemetry databases.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ padding: '20px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                    <h5 style={{ fontWeight: '800', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Terminal size={16} color="var(--primary)" /> SQL diagnostics
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                      Execute raw read SQL statements directly on your PostgreSQL database node to audit table structures.
                    </p>
                    <button onClick={() => setActiveTab('sql')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      Open Console
                    </button>
                  </div>
                  
                  <div style={{ padding: '20px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                    <h5 style={{ fontWeight: '800', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={16} color="var(--secondary)" /> Issue Backlog
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                      Manage user bug reports, troubleshoot feature updates, and update tickets to keep customer churn low.
                    </p>
                    <button onClick={() => setActiveTab('feedbacks')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      Review Tickets
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FEEDBACKS */}
            {!loadingData && activeTab === 'feedbacks' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>User Feedbacks &amp; Issues</h3>
                  <div>
                    <select 
                      value={feedbackFilter}
                      onChange={e => setFeedbackFilter(e.target.value)}
                      style={{
                        padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border)',
                        background: 'var(--bg-main)', color: 'var(--text)', outline: 'none', fontWeight: '700'
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {filteredFeedbacks.length === 0 ? (
                  <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No feedbacks logged matching criteria.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {filteredFeedbacks.map(fb => (
                      <div key={fb.id} style={{ 
                        padding: '20px', background: 'var(--bg-main)', border: '1px solid var(--border)', 
                        borderRadius: '16px', position: 'relative'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <span style={{ 
                              fontSize: '0.7rem', fontWeight: '800', padding: '4px 8px', borderRadius: '6px',
                              background: fb.type === 'bug' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                              color: fb.type === 'bug' ? '#f87171' : 'var(--primary)',
                              textTransform: 'uppercase', marginRight: '10px'
                            }}>
                              {fb.type}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600' }}>{fb.user_email}</span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <select 
                              value={fb.status}
                              onChange={e => handleUpdateFeedbackStatus(fb.id, e.target.value)}
                              style={{
                                padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)',
                                background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '0.8rem',
                                fontWeight: '700', outline: 'none'
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            
                            <button 
                              onClick={() => handleDeleteFeedback(fb.id)}
                              style={{
                                background: 'none', border: 'none', color: '#f87171', cursor: 'pointer',
                                padding: '4px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <h5 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text)', marginBottom: '8px' }}>{fb.title}</h5>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{fb.description}</p>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                          Submitted: {new Date(fb.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: USERS */}
            {!loadingData && activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>User Directories</h3>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                      <input 
                        type="text" 
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        style={{
                          padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid var(--border)',
                          background: 'var(--bg-main)', color: 'var(--text)', outline: 'none', fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {filteredUsers.length === 0 ? (
                  <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No users match search query.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontWeight: '700' }}>
                          <th style={{ padding: '12px 8px' }}>Profile</th>
                          <th style={{ padding: '12px 8px' }}>Email</th>
                          <th style={{ padding: '12px 8px' }}>Plan</th>
                          <th style={{ padding: '12px 8px' }}>Created</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', verticalAlign: 'middle' }}>
                            <td style={{ padding: '14px 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {u.picture ? (
                                <img src={u.picture} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                              ) : (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)' }}>
                                  {u.name ? u.name.substring(0,2).toUpperCase() : 'U'}
                                </div>
                              )}
                              <span style={{ fontWeight: '700' }}>{u.name || 'Anonymous'}</span>
                            </td>
                            <td style={{ padding: '14px 8px', color: 'var(--text-secondary)' }}>{u.email}</td>
                            <td style={{ padding: '14px 8px' }}>
                              <select 
                                value={u.plan}
                                onChange={e => handleUpdateUserPlan(u.email, e.target.value)}
                                style={{
                                  padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)',
                                  background: 'var(--bg-main)', color: 'var(--text)', fontSize: '0.8rem',
                                  fontWeight: '700', outline: 'none'
                                }}
                              >
                                <option value="free">Free</option>
                                <option value="pro">Pro</option>
                                <option value="infinite">Infinite</option>
                              </select>
                            </td>
                            <td style={{ padding: '14px 8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                              <button 
                                onClick={() => handleDeleteUser(u.email)}
                                style={{
                                  background: 'none', border: 'none', color: '#f87171', cursor: 'pointer',
                                  padding: '6px', borderRadius: '6px', transition: 'background 0.2s'
                                }}
                                title="Delete user data"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: BRIDGES */}
            {!loadingData && activeTab === 'bridges' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Bridge Extraction Logs</h3>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Search title/user..."
                      value={bridgeSearch}
                      onChange={e => setBridgeSearch(e.target.value)}
                      style={{
                        padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid var(--border)',
                        background: 'var(--bg-main)', color: 'var(--text)', outline: 'none', fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                {filteredBridges.length === 0 ? (
                  <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No extraction bridges match search queries.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontWeight: '700' }}>
                          <th style={{ padding: '12px 8px' }}>User Email</th>
                          <th style={{ padding: '12px 8px' }}>Title</th>
                          <th style={{ padding: '12px 8px' }}>Platform</th>
                          <th style={{ padding: '12px 8px' }}>Mode</th>
                          <th style={{ padding: '12px 8px' }}>Created</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBridges.map(b => (
                          <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{b.user_email}</td>
                            <td style={{ padding: '12px 8px', fontWeight: '700', color: 'var(--text)' }}>{b.title}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--primary)', fontWeight: '700' }}>{b.source}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>
                                {b.mode}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                              {new Date(b.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => setSelectedBridge(b)}
                                style={{
                                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                                  borderRadius: '6px', padding: '6px', color: 'var(--text)', cursor: 'pointer'
                                }}
                              >
                                <Eye size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteBridge(b.id)}
                                style={{
                                  background: 'none', border: 'none', color: '#f87171', cursor: 'pointer',
                                  padding: '6px'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: INVOICES */}
            {!loadingData && activeTab === 'invoices' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '24px' }}>Billing Ledgers</h3>
                {invoices.length === 0 ? (
                  <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No invoice data found in the database.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontWeight: '700' }}>
                          <th style={{ padding: '12px 8px' }}>Invoice ID</th>
                          <th style={{ padding: '12px 8px' }}>User Email</th>
                          <th style={{ padding: '12px 8px' }}>Tier</th>
                          <th style={{ padding: '12px 8px' }}>Amount</th>
                          <th style={{ padding: '12px 8px' }}>Status</th>
                          <th style={{ padding: '12px 8px' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map(inv => (
                          <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{inv.id}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{inv.user_email}</td>
                            <td style={{ padding: '12px 8px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)' }}>{inv.plan}</td>
                            <td style={{ padding: '12px 8px', fontWeight: '700' }}>${inv.amount} {inv.currency}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                {inv.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                              {new Date(inv.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SUBSCRIBERS */}
            {!loadingData && activeTab === 'subscribers' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '24px' }}>Subscribers Ledger</h3>
                {subscribers.length === 0 ? (
                  <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No subscribers found.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontWeight: '700' }}>
                          <th style={{ padding: '12px 8px' }}>Email Address</th>
                          <th style={{ padding: '12px 8px' }}>Subscription Date</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map(sub => (
                          <tr key={sub.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '12px 8px', color: 'var(--text)' }}>{sub.email}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                              {new Date(sub.created_at).toLocaleString()}
                            </td>
                            <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                              <button 
                                onClick={() => handleDeleteSubscriber(sub.email)}
                                style={{
                                  background: 'none', border: 'none', color: '#f87171', cursor: 'pointer',
                                  padding: '4px'
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SQL CONSOLE */}
            {!loadingData && activeTab === 'sql' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={22} color="var(--primary)" /> SQL Audit Console
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.6' }}>
                  Run read SQL operations to inspect database indexes, verify rows, or test schemas. Write query below:
                </p>

                <form onSubmit={executeSqlQuery} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  <textarea 
                    value={sqlQuery}
                    onChange={e => setSqlQuery(e.target.value)}
                    rows="5"
                    style={{
                      width: '100%', padding: '16px', borderRadius: '12px',
                      border: '1px solid var(--border)', background: 'var(--bg-main)',
                      color: '#34d399', fontFamily: 'monospace', outline: 'none', fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}
                    placeholder="SELECT * FROM users LIMIT 10;"
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      type="submit" 
                      disabled={loadingSql}
                      className="btn-primary" 
                      style={{ padding: '10px 24px', fontSize: '0.9rem', fontWeight: '700' }}
                    >
                      {loadingSql ? 'Executing...' : 'Run Query'}
                    </button>
                  </div>
                </form>

                {sqlError && (
                  <div style={{ 
                    background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '10px', padding: '16px', color: '#f87171', fontSize: '0.85rem',
                    fontFamily: 'monospace', whiteSpace: 'pre-wrap'
                  }}>
                    {sqlError}
                  </div>
                )}

                {sqlResult && (
                  <div>
                    <h5 style={{ fontWeight: '800', marginBottom: '12px', fontSize: '0.95rem' }}>
                      Query Results ({sqlResult.rowCount} rows)
                    </h5>
                    
                    {sqlResult.rows.length === 0 ? (
                      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Empty set returned.</p>
                    ) : (
                      <div style={{ overflowX: 'auto', maxHeight: '400px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          <thead>
                            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                              {sqlResult.fields.map((field, i) => (
                                <th key={i} style={{ padding: '10px 14px' }}>{field}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sqlResult.rows.map((row, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                {sqlResult.fields.map((field, i) => (
                                  <td key={i} style={{ padding: '10px 14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {typeof row[field] === 'object' ? JSON.stringify(row[field]) : String(row[field] ?? 'NULL')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bridge Detail Modal */}
      {selectedBridge && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(16px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }} onClick={() => setSelectedBridge(null)}>
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 20, maxWidth: 700, width: '100%', maxHeight: '80vh',
            overflowY: 'auto', padding: 36, position: 'relative', boxShadow: 'var(--shadow)'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedBridge(null)}
              style={{
                position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)',
                cursor: 'pointer', padding: '6px 10px', fontSize: '0.8rem', fontWeight: '800'
              }}
            >
              Close
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
              Bridge Distillation Telemetry
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '8px', marginBottom: '20px' }}>{selectedBridge.title}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: 'var(--bg-main)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)' }}>User Email</span>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedBridge.user_email}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)' }}>Platform Source</span>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)' }}>{selectedBridge.source}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)' }}>Distillation Mode</span>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedBridge.mode}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)' }}>Created Date</span>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{new Date(selectedBridge.created_at).toLocaleString()}</span>
              </div>
            </div>

            <h5 style={{ fontWeight: '800', marginBottom: '10px' }}>Distillation Summary</h5>
            <div style={{ 
              padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border)', 
              borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', 
              whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '20px'
            }}>
              {selectedBridge.summary}
            </div>

            {selectedBridge.chat_log && (
              <>
                <h5 style={{ fontWeight: '800', marginBottom: '10px' }}>Raw Chat Logs (Truncated)</h5>
                <pre style={{ 
                  padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border)', 
                  borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', 
                  whiteSpace: 'pre-wrap', maxHeight: '180px', overflowY: 'auto'
                }}>
                  {selectedBridge.chat_log}
                </pre>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
