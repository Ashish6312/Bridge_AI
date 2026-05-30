import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, LogIn } from 'lucide-react';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session data
    localStorage.removeItem('bridge_user');
  }, []);

  return (
    <div 
      onClick={() => navigate('/')}
      style={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '20px', background: 'var(--bg-main)', cursor: 'pointer'
      }}
    >
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ 
          maxWidth: '440px', width: '100%', padding: '48px 32px', textAlign: 'center',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: '32px', boxShadow: 'var(--shadow)', cursor: 'default'
        }}
      >
        <div style={{ 
          width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px auto', border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <CheckCircle2 size={40} color="#10b981" />
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.04em' }}>
          Session Ended
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
          Your sovereign session has been terminated. Your intelligence vault remains secure and encrypted.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '1rem' }}
          >
            <LogIn size={20} /> Sign In Again
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <Home size={20} /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutPage;
