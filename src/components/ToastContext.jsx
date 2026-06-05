import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} style={{ color: '#10b981' }} />;
      case 'error':
        return <XCircle size={20} style={{ color: '#ef4444' }} />;
      case 'warning':
        return <AlertTriangle size={20} style={{ color: '#f59e0b' }} />;
      default:
        return <Info size={20} style={{ color: '#3b82f6' }} />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.25)';
      case 'error':
        return 'rgba(239, 68, 68, 0.25)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.25)';
      default:
        return 'rgba(59, 130, 246, 0.25)';
    }
  };

  const getProgressBarColor = (type) => {
    switch (type) {
      case 'success':
        return 'linear-gradient(90deg, #10b981, #34d399)';
      case 'error':
        return 'linear-gradient(90deg, #ef4444, #f87171)';
      case 'warning':
        return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
      default:
        return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none',
          maxWidth: '420px',
          width: 'calc(100% - 48px)',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
              getIcon={getIcon}
              getBorderColor={getBorderColor}
              getProgressBarColor={getProgressBarColor}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose, getIcon, getBorderColor, getProgressBarColor }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
      layout
      style={{
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '16px 20px 20px',
        background: 'rgba(15, 15, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${getBorderColor(toast.type)}`,
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        color: '#fff',
        fontSize: '0.875rem',
        fontWeight: 500,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon(toast.type)}</div>
      <div style={{ flexGrow: 1, paddingRight: '12px', wordBreak: 'break-word', lineHeight: '1.4' }}>
        {toast.message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.4)',
          cursor: 'pointer',
          padding: 0,
          borderRadius: '50%',
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        }}
      >
        <X size={12} />
      </button>

      {/* Progress Bar Timer indicator */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: getProgressBarColor(toast.type),
          borderBottomLeftRadius: '16px',
        }}
      />
    </motion.div>
  );
};
