import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, CreditCard, Mail, Database, 
  TrendingUp, Search, Trash2, Key, LogOut, CheckCircle, 
  XCircle, ArrowRight, RefreshCw, Activity, Shield
} from 'lucide-react';
import { apiFetch } from '../apiConfig';
import SEOHelmet from '../components/SEOHelmet';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  
  // Console tabs: 'feedbacks' (Support Desk), 'users' (User Registry)
  const [activeTab, setActiveTab] = useState('feedbacks');
  
  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  // Search & Filter states
  const [userSearch, setUserSearch] = useState('');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState('all');
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  
  // Resolution inputs state
  const [resolutionNotes, setResolutionNotes] = useState({});
  const [loadingData, setLoadingData] = useState(false);

  // Check login on mount
  useEffect(() => {
    const token = sessionStorage.getItem('bridge_admin_token');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchTabContent('users'); // load users to show diagnostics on feedbacks
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
        headers: { 'Content-Type': 'application/json' },
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
    setInvoices([]);
    setSelectedFeedbackId(null);
  };

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
        if (res.ok) {
          setFeedbacks(data.feedbacks);
          // Auto-select first feedback if none selected and records exist
          if (data.feedbacks.length > 0 && !selectedFeedbackId) {
            setSelectedFeedbackId(data.feedbacks[0].id);
          }
        }
      } else if (tab === 'users') {
        const res = await apiFetch('/api/admin/users', { headers });
        const data = await res.json();
        if (res.ok) setUsers(data.users);
      }
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
    } finally {
      setLoadingData(false);
    }
  };

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
        // Reset selection if deleted the active one
        if (selectedFeedbackId === id) {
          setSelectedFeedbackId(null);
        }
        fetchTabContent('feedbacks');
        fetchStats();
      } else {
        alert('Failed to delete feedback');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveResolution = async (id, status = 'resolved') => {
    const note = resolutionNotes[id] !== undefined ? resolutionNotes[id] : '';
    try {
      const res = await apiFetch(`/api/admin/feedbacks/${id}`, {
        method: 'PATCH',
        headers: {
          ...getAdminHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ admin_response: note, status })
      });
      if (res.ok) {
        alert('Resolution updated successfully.');
        fetchTabContent('feedbacks');
      } else {
        alert('Failed to update resolution.');
      }
    } catch (err) {
      console.error(err);
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
        padding: '40px 20px',
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
          background: 'rgba(13, 13, 13, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '16px', 
              background: 'rgba(222, 106, 57, 0.08)', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
              border: '1px solid rgba(222, 106, 57, 0.2)',
              marginBottom: '16px'
            }}>
              <Key size={28} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
              Operator <span style={{ color: 'var(--primary)' }}>Console</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Authentication is required to view console database registries.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)',
                  color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)',
                  color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem'
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
                fontSize: '1rem', fontWeight: '700',
                background: 'linear-gradient(135deg, var(--primary) 0%, #ff8038 100%)',
                border: 'none', color: 'white', cursor: 'pointer'
              }}
            >
              {loadingLogin ? 'Verifying...' : <>Authenticate <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Lists
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesStatus = feedbackFilter === 'all' ? true : f.status === feedbackFilter;
    const matchesType = feedbackTypeFilter === 'all' ? true : f.type === feedbackTypeFilter;
    return matchesStatus && matchesType;
  });

  const selectedFeedback = feedbacks.find(f => f.id === selectedFeedbackId);
  const selectedUserDiagnostic = selectedFeedback ? users.find(u => u.email === selectedFeedback.user_email) : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      color: 'var(--text-main)',
      padding: '40px 20px 80px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <SEOHelmet 
        title="Admin Control Center" 
        description="Sovereign helpdesk database and user registry portal."
      />

      <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
        
        {/* Console Header */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '32px', flexWrap: 'wrap', gap: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>
              Operator Console
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px', letterSpacing: '-0.03em' }}>
              Control Panel
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Top Navigation Tabs */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <button
                onClick={() => { setActiveTab('feedbacks'); fetchTabContent('feedbacks'); }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'feedbacks' ? 'rgba(222, 106, 57, 0.15)' : 'transparent',
                  color: activeTab === 'feedbacks' ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.85rem', fontWeight: '700', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <MessageSquare size={14} />
                <span>Support Desk</span>
              </button>
              <button
                onClick={() => { setActiveTab('users'); fetchTabContent('users'); }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'users' ? 'rgba(222, 106, 57, 0.15)' : 'transparent',
                  color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.85rem', fontWeight: '700', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Users size={14} />
                <span>User Registry</span>
              </button>
            </div>

            <button 
              onClick={() => { fetchStats(); fetchTabContent(activeTab); }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '10px', padding: '10px', color: 'var(--text-main)', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Refresh ledger data"
            >
              <RefreshCw size={16} />
            </button>
            <button 
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '10px', padding: '10px 18px', color: '#f87171', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '700'
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Global Loading indicator */}
        {loadingData && feedbacks.length === 0 && users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: '3px solid var(--primary-soft)', borderTopColor: 'var(--primary)',
              animation: 'spin 1s linear infinite', margin: '0 auto 16px'
            }} />
            <span>Syncing database schemas...</span>
          </div>
        )}

        {/* TAB 1: SUPPORT DESK (User Queries & Feedback) */}
        {activeTab === 'feedbacks' && (
          <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', alignItems: 'stretch' }}>
            
            {/* Feed List Pane */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-card" style={{
                background: 'rgba(13, 13, 13, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={feedbackFilter}
                    onChange={e => setFeedbackFilter(e.target.value)}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-main)', outline: 'none', fontWeight: '700', fontSize: '0.8rem'
                    }}
                  >
                    <option value="all" style={{ background: '#0D0D0D' }}>All Statuses</option>
                    <option value="pending" style={{ background: '#0D0D0D' }}>Pending</option>
                    <option value="in_progress" style={{ background: '#0D0D0D' }}>In Progress</option>
                    <option value="resolved" style={{ background: '#0D0D0D' }}>Resolved</option>
                  </select>
                  <select 
                    value={feedbackTypeFilter}
                    onChange={e => setFeedbackTypeFilter(e.target.value)}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-main)', outline: 'none', fontWeight: '700', fontSize: '0.8rem'
                    }}
                  >
                    <option value="all" style={{ background: '#0D0D0D' }}>All Types</option>
                    <option value="bug" style={{ background: '#0D0D0D' }}>Bug Logs</option>
                    <option value="feedback" style={{ background: '#0D0D0D' }}>Feedback</option>
                  </select>
                </div>
              </div>

              {/* Tickets List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredFeedbacks.length === 0 ? (
                  <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(13,13,13,0.3)', borderRadius: '16px' }}>
                    No consultation tickets found.
                  </div>
                ) : (
                  filteredFeedbacks.map(fb => {
                    const isSelected = fb.id === selectedFeedbackId;
                    const statusColor = fb.status === 'resolved' ? '#10b981' : fb.status === 'in_progress' ? '#f59e0b' : '#ef4444';
                    
                    return (
                      <div 
                        key={fb.id} 
                        onClick={() => setSelectedFeedbackId(fb.id)}
                        style={{
                          padding: '16px', 
                          background: isSelected ? 'rgba(222, 106, 57, 0.08)' : 'rgba(13, 13, 13, 0.4)',
                          border: isSelected ? '1px solid rgba(222, 106, 57, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 0 16px rgba(222, 106, 57, 0.05)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ 
                            fontSize: '0.65rem', fontWeight: '800', padding: '3px 6px', borderRadius: '5px',
                            background: fb.type === 'bug' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(99, 102, 241, 0.08)',
                            color: fb.type === 'bug' ? '#f87171' : 'var(--primary)',
                            textTransform: 'uppercase'
                          }}>
                            {fb.type}
                          </span>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                              {fb.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: isSelected ? 'white' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                          {fb.title}
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>{fb.user_email}</span>
                          <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Detail Pane */}
            <div className="glass-card" style={{
              background: 'rgba(13, 13, 13, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px'
            }}>
              {selectedFeedback ? (
                <>
                  {/* Top Details */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '6px',
                          background: selectedFeedback.type === 'bug' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                          color: selectedFeedback.type === 'bug' ? '#f87171' : 'var(--primary)',
                          textTransform: 'uppercase'
                        }}>
                          {selectedFeedback.type}
                        </span>
                        
                        <select 
                          value={selectedFeedback.status}
                          onChange={e => handleUpdateFeedbackStatus(selectedFeedback.id, e.target.value)}
                          style={{
                            padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)',
                            background: 'rgba(13, 13, 13, 0.6)', color: 'var(--text-main)', fontSize: '0.75rem',
                            fontWeight: '700', outline: 'none'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Submitted {new Date(selectedFeedback.created_at).toLocaleString()}
                        </span>
                        <button 
                          onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px', padding: '6px', color: '#f87171', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyItems: 'center'
                          }}
                          title="Delete Ticket"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                      {selectedFeedback.title}
                    </h2>
                    <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>
                        {selectedFeedback.description}
                      </p>
                    </div>
                  </div>

                  {/* Privacy-Preserved User Diagnostic Panel */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '16px', padding: '20px'
                  }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={14} /> Diagnostic Profile (Privacy Locked)
                    </h3>
                    
                    {selectedUserDiagnostic ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Name</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{selectedUserDiagnostic.name || 'Anonymous User'}</span>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Account Email</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{selectedUserDiagnostic.email}</span>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Plan Level</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>
                            {selectedUserDiagnostic.plan || 'Free'}
                          </span>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Member Since</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {new Date(selectedUserDiagnostic.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        User account not registered or belongs to an offline developer session ({selectedFeedback.user_email}).
                      </div>
                    )}
                  </div>

                  {/* Resolution editor */}
                  <div style={{ marginTop: 'auto' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Support Consultation Response Note
                    </label>
                    <textarea
                      value={resolutionNotes[selectedFeedback.id] !== undefined ? resolutionNotes[selectedFeedback.id] : (selectedFeedback.admin_response || '')}
                      onChange={e => setResolutionNotes({ ...resolutionNotes, [selectedFeedback.id]: e.target.value })}
                      placeholder="Type response context or solution steps..."
                      rows="4"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)',
                        color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem',
                        resize: 'vertical', marginBottom: '14px', lineHeight: '1.5'
                      }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button
                        onClick={() => handleSaveResolution(selectedFeedback.id, selectedFeedback.status)}
                        style={{
                          padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', cursor: 'pointer',
                          fontSize: '0.85rem', fontWeight: '700'
                        }}
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => handleSaveResolution(selectedFeedback.id, 'resolved')}
                        style={{
                          padding: '10px 20px', borderRadius: '10px', border: 'none',
                          background: 'var(--primary)', color: 'white', cursor: 'pointer',
                          fontSize: '0.85rem', fontWeight: '700'
                        }}
                      >
                        Resolve &amp; Close Ticket
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
                  <MessageSquare size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
                  <span>Select a ticket from the helpdesk queue to consult.</span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: USER DIRECTORY & KEY STATS */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Top Telemetry KPIs */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '20px'
            }}>
              {[
                { label: 'Total Registries', value: stats?.users ?? '...', icon: <Users size={20} />, color: 'var(--primary)' },
                { label: 'Active Sync Bridges', value: stats?.bridges ?? '...', icon: <Database size={20} />, color: '#7c3aed' },
                { label: 'Inbox Feedbacks', value: stats?.feedbacks ?? '...', icon: <MessageSquare size={20} />, color: '#cd6b6b' },
                { label: 'Billing Revenue', value: stats ? `$${stats.revenue.toFixed(2)}` : '...', icon: <CreditCard size={20} />, color: '#10b981' },
              ].map((item, idx) => (
                <div key={idx} className="glass-card" style={{
                  background: 'rgba(13, 13, 13, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '18px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{item.label}</span>
                    <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '2px' }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* User Registry List */}
            <div className="glass-card" style={{
              background: 'rgba(13, 13, 13, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px', padding: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>User Directories</h3>
                
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    style={{
                      padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(13, 13, 13, 0.4)', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No users match search query.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', fontWeight: '700' }}>
                        <th style={{ padding: '12px 8px' }}>User</th>
                        <th style={{ padding: '12px 8px' }}>Email</th>
                        <th style={{ padding: '12px 8px' }}>Plan Level</th>
                        <th style={{ padding: '12px 8px' }}>Created</th>
                        <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.email} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', verticalAlign: 'middle' }}>
                          <td style={{ padding: '14px 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {u.picture ? (
                              <img src={u.picture} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                            ) : (
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(222, 106, 57, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)' }}>
                                {u.name ? u.name.substring(0, 2).toUpperCase() : 'US'}
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
                                padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)',
                                background: 'rgba(13, 13, 13, 0.6)', color: 'var(--text-main)', fontSize: '0.8rem',
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

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;
