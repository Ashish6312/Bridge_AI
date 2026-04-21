import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Layers, Eye, EyeOff, ArrowRight, Puzzle } from 'lucide-react';
import { API_BASE } from '../apiConfig';

const LoginPage = () => {
  const [mode, setMode] = useState('login'); 
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuthSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          google_id: decoded.sub
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('bridge_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      setError(e.message || 'Google Login failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields.');
    if (mode === 'signup' && !form.name) return setError('Please enter your name.');

    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/api/register' : '/api/login';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('bridge_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      <div className="container" style={{ 
        display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', 
        position: 'relative', zIndex: 1, padding: '20px', minHeight: '100vh', gap: '60px' 
      }}>
        
        {/* Left Column - Branding */}
        <div style={{ maxWidth: '400px', flex: 1 }} className="login-aspirator">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', 
              padding: '6px 12px', background: 'rgba(139, 92, 246, 0.08)', 
              borderRadius: '100px', border: '1px solid rgba(139, 92, 246, 0.15)',
              marginBottom: '20px'
            }}>
              <Puzzle size={10} className="premium-gradient-text" />
              <span style={{ fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.7)' }}>Sovereign AI Infrastructure</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--gradient-1)', padding: '8px', borderRadius: '10px' }}>
                <Layers size={20} color="white" />
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.04em' }}>Bridge<span style={{ color: 'var(--primary)' }}>AI</span></h1>
            </div>
            
            <h2 style={{ fontSize: '2.4rem', lineHeight: 1.1, marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.03em' }}>
              The Hub of Your <br />
              <span className="premium-gradient-text">Context</span> Vault
            </h2>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '24px', maxWidth: '360px' }}>
              Unified, searchable, and sovereign intelligence ecosystem.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', maxWidth: '340px' }}>
              {[
                { label: 'Cross-LLM Synchronization', icon: <Layers size={12} color="#8b5cf6" /> },
                { label: 'Encrypted Data Vaults', icon: <Puzzle size={12} color="#06b6d4" /> }
              ].map((feature, i) => (
                <div key={i} style={{ padding: '8px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '7px', display: 'flex' }}>{feature.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{feature.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ flex: '0 0 380px', position: 'relative' }} 
          className="login-form-container"
        >
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', zIndex: -1, pointerEvents: 'none' }} />
          
          <div className="glass-card authentication-card" style={{ padding: '32px', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px' }}>
            
            <div style={{ position: 'relative', display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '4px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <motion.div 
                animate={{ x: mode === 'login' ? '0%' : '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                style={{ position: 'absolute', top: '4px', left: '4px', width: 'calc(50% - 4px)', height: 'calc(100% - 8px)', background: 'white', borderRadius: '9px', zIndex: 0 }}
              />
              {['login', 'signup'].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); }}
                  style={{
                    flex: 1, padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer',
                    fontWeight: '800', fontSize: '0.7rem', position: 'relative', zIndex: 1,
                    color: mode === m ? '#020617' : 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <div style={{ minHeight: '300px' }}>
              <AnimatePresence mode="wait">
                <motion.div key={mode} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '4px', fontWeight: '800', letterSpacing: '-0.02em', color: 'white' }}>
                    {mode === 'login' ? 'Institutional Login' : 'Create Account'}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '20px', lineHeight: 1.4 }}>
                    {mode === 'login' ? 'Secure access to your intelligence hub.' : 'Initialize your context vault.'}
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {mode === 'signup' && (
                      <div className="input-group">
                        <label style={{ fontSize: '0.6rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Full Name</label>
                        <input type="text" placeholder="John Doe" className="input-premium" style={{ width: '100%', height: '42px', fontSize: '0.85rem', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                    )}
                    <div className="input-group">
                      <label style={{ fontSize: '0.6rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Email Address</label>
                      <input type="email" placeholder="name@company.com" className="input-premium" style={{ width: '100%', height: '42px', fontSize: '0.85rem', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label style={{ fontSize: '0.6rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="input-premium" style={{ width: '100%', height: '42px', paddingRight: '42px', fontSize: '0.85rem', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                        <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}>{showPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                      </div>
                    </div>

                    {error && <div style={{ fontSize: '0.7rem', color: '#fb7185', background: 'rgba(225,29,72,0.1)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(225,29,72,0.2)', fontWeight: '600' }}>{error}</div>}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '0.85rem', justifyContent: 'center', fontWeight: '800', borderRadius: '12px', marginTop: '4px' }}>
                      {loading ? 'WAITING...' : <>{mode === 'login' ? 'SIGN IN' : 'GET STARTED'} <ArrowRight size={16} style={{ marginLeft: '6px' }} /></>}
                    </button>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0 16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>Secure Gateway</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
               <div style={{ width: '100%', background: 'rgba(0,0,0,0.15)', padding: '1px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <GoogleLogin onSuccess={handleAuthSuccess} onError={() => setError('Google sign in failed.')} theme="filled_black" shape="pill" width="100%" text={mode === 'login' ? 'signin_with' : 'signup_with'} />
               </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? "New? " : "Joined? "}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '800', marginLeft: '4px' }}>
              {mode === 'login' ? 'Join Now' : 'Sign In'}
            </button>
          </p>
        </motion.div>
      </div>

      <style>{`
        .input-premium:focus {
          border-color: var(--primary) !important;
          background: rgba(139, 92, 246, 0.04) !important;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.1) !important;
        }
        @media (max-width: 1100px) {
          .login-aspirator { display: none !important; }
          .login-form-container { flex: 1 !important; max-width: 400px !important; }
        }
        @media (max-width: 480px) {
           .authentication-card { padding: 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
