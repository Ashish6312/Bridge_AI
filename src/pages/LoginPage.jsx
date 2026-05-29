import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE } from '../apiConfig';

const LoginPage = () => {
  const [mode, setMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (localStorage.getItem('bridge_user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const userInfo = await userInfoRes.json();
        
        const res = await fetch(`${API_BASE}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            google_id: userInfo.sub
          })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('bridge_user', JSON.stringify(data.user));
          navigate('/dashboard');
        } else {
          throw new Error(data.error || 'Database sync failed');
        }
      } catch (e) {
        setError(e.message || 'Google Auth failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Login Failed')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const email = form.email.trim();
    const password = form.password;
    
    if (!email || !password) return setError('Please fill in all fields.');
    if (mode === 'signup' && (!form.firstName || !form.lastName)) {
      return setError('Please enter both first and last name.');
    }

    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/api/register' : '/api/login';
      const fullName = mode === 'signup' ? `${form.firstName} ${form.lastName}`.trim() : '';
      
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: fullName
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('bridge_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000000', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '120px 20px 80px',
      position: 'relative', 
      zIndex: 1,
      fontFamily: "'Outfit', 'Inter', sans-serif"
    }}>
      <style>{`
        .auth-input::placeholder {
          color: #52525B;
        }
        .auth-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 10px rgba(222, 106, 57, 0.12);
        }
      `}</style>
      
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'white', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </h2>
          
          <p style={{ fontSize: '0.95rem', color: '#888', marginBottom: '24px', fontWeight: '500' }}>
            {mode === 'login' ? (
              <>
                New user?{' '}
                <span onClick={() => { setMode('signup'); setError(''); }} style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>
                  Create an account
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span onClick={() => { setMode('login'); setError(''); }} style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>
                  Sign In
                </span>
              </>
            )}
          </p>

          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#f87171', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              fontSize: '0.85rem', 
              marginBottom: '20px', 
              fontWeight: '600' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'signup' && (
              <div className="mobile-col" style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#A1A1AA', marginBottom: '6px' }}>First Name</label>
                  <input 
                    type="text" placeholder="First Name" className="auth-input"
                    value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', color: 'white', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#A1A1AA', marginBottom: '6px' }}>Last Name</label>
                  <input 
                    type="text" placeholder="Last Name" className="auth-input"
                    value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', color: 'white', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#A1A1AA', marginBottom: '6px' }}>Email</label>
              <input 
                type="email" placeholder="Enter your email here" className="auth-input"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', color: 'white', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#A1A1AA', marginBottom: '6px' }}>Password</label>
              <input 
                type="password" placeholder="Enter your password here" className="auth-input"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', color: 'white', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
              />
            </div>

            {mode === 'signup' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '4px' }}>
                <input type="checkbox" defaultChecked style={{ marginTop: '3px', accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: '11px', color: '#71717A', lineHeight: '1.4' }}>
                  I agree to receive communications from BridgeAI via email, SMS, and phone calls, even if registered under DND/NDNC.
                </span>
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '8px', 
                fontSize: '0.95rem', 
                fontWeight: '700', 
                marginTop: '12px', 
                cursor: 'pointer',
                border: 'none',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: 'white',
                boxShadow: '0 4px 12px rgba(222,106,57,0.12)'
              }}
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register Now'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#52525B', textTransform: 'uppercase', letterSpacing: '1px' }}>Or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <button 
            type="button"
            onClick={() => googleLogin()}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              color: '#F5F5F5',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
