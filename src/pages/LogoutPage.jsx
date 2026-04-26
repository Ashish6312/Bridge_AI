import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, LogIn } from 'lucide-react';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session data
    localStorage.removeItem('bridge_user');
    // We stay on this page to show the success message, then redirect if desired
    // For now, let the user manually go back or click buttons
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      padding: '20px', background: 'transparent' 
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card"
        style={{ 
          maxWidth: '440px', width: '100%', padding: '48px 32px', textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '32px', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)'
        }}
      >
        <div style={{ 
          width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px auto', border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <CheckCircle2 size={40} color="#10b981" />
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-0.04em' }}>
          System Logout
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
          Sovereign session terminated successfully. Your intelligence vault remains encrypted.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '1rem' }}
          >
            <LogIn size={20} /> Resume Session
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '1rem', background: 'rgba(255,255,255,0.03)' }}
          >
            <Home size={20} /> Back to Terminal
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutPage;
