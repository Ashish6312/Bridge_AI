import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { apiFetch } from '../apiConfig';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi there! 👋 How can we help you bridge your AI context today?' },
    { id: 2, sender: 'bot', text: 'You can check our docs or FAQ for quick answers.' }
  ]);
  const messagesEndRef = useRef(null);

  // Read user email if logged in
  const userStr = localStorage.getItem('bridge_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || 'guest';

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('OPEN_SUPPORT_CHAT', handleOpenChat);
    return () => window.removeEventListener('OPEN_SUPPORT_CHAT', handleOpenChat);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const queryText = message.trim();
    const userMsg = { id: Date.now(), sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    // Add temporary bot thinking bubble
    const thinkingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: thinkingId, sender: 'bot', text: 'Thinking...' }]);
    
    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, email: userEmail })
      });
      const data = await res.json();
      
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        if (res.ok && data.success) {
          return [...filtered, { id: Date.now(), sender: 'bot', text: data.response }];
        } else {
          return [...filtered, { id: Date.now(), sender: 'bot', text: '⚠️ Connection lost. Please reload and try again.' }];
        }
      });
    } catch (err) {
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        return [...filtered, { id: Date.now(), sender: 'bot', text: '⚠️ Connection lost. Please reload and try again.' }];
      });
    }
  };

  return (
    <div className="chat-widget">
      <style>{`
        @keyframes chatPulse {
          0%,100% { box-shadow: 0 4px 16px rgba(0,0,0,0.4); transform: scale(1); }
          50%      { box-shadow: 0 6px 20px rgba(0,0,0,0.5); transform: scale(1.03); }
        }
        @keyframes chatRingPulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .chat-trigger-btn {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, var(--primary), #7C3AED);
          border: 1px solid rgba(222,106,57,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative;
          transition: all 0.25s ease;
          animation: chatPulse 4.0s ease-in-out infinite;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .chat-trigger-btn:hover {
          transform: scale(1.08) translateY(-2px);
          background: linear-gradient(135deg, var(--primary), #7C3AED);
          box-shadow: 0 12px 32px rgba(0,0,0,0.6);
        }
        .chat-online-dot {
          position: absolute; top: -3px; right: -3px;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--primary);
          border: 2px solid #050505;
        }
        .chat-online-dot::before {
          content: ''; position: absolute; inset: -3px;
          border-radius: 50%; border: 1px solid rgba(222,106,57,0.3);
          animation: chatRingPulse 1.8s ease-out infinite;
        }
        .chat-send-btn:hover {
          background: var(--primary) !important;
          opacity: 0.95;
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            style={{
              position: 'absolute', bottom: 72, right: 0,
              width: 320, borderRadius: 20,
              background: 'rgba(13,13,13,0.96)',
              border: '1px solid rgba(222,106,57,0.15)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', zIndex: 1000
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(222,106,57,0.06), rgba(124,58,237,0.02))',
              borderBottom: '1px solid rgba(222,106,57,0.1)',
              padding: '18px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={16} color="white" style={{ margin: '9px auto' }} />
                  </div>
                  <div style={{ position: 'absolute', top: -2, right: -2, width: 9, height: 9, borderRadius: '50%', background: 'var(--primary)', border: '2px solid #0D0D0D' }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', letterSpacing: '-0.01em' }}>Bridge Support</div>
                  <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500 }}>● Online now</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#A1A1AA', cursor: 'pointer', padding: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#F5F5F5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#A1A1AA'; }}>
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: '20px', background: 'rgba(5,5,5,0.6)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 200, maxHeight: 260, overflowY: 'auto' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{
                  background: msg.sender === 'bot' ? 'rgba(222,106,57,0.06)' : 'rgba(124,58,237,0.08)',
                  border: msg.sender === 'bot' ? '1px solid rgba(222,106,57,0.12)' : '1px solid rgba(124,58,237,0.12)',
                  color: msg.sender === 'bot' ? '#F5F5F5' : '#A1A1AA',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'bot' ? '14px 14px 14px 0' : '14px 14px 0 14px',
                  fontSize: 13,
                  alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                  maxWidth: '88%',
                  lineHeight: 1.6
                }}>
                  {msg.sender === 'bot' && msg.id === 2 ? (
                    <>You can also check our <span style={{ color: 'var(--primary)', fontWeight: 600 }}>docs</span> for quick answers.</>
                  ) : (
                    <>
                      {msg.text}
                      {msg.link && (
                        <div style={{ marginTop: 8 }}>
                          <a href={msg.link.url} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {msg.link.label} →
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '14px 16px', background: 'rgba(13,13,13,0.95)', borderTop: '1px solid rgba(222,106,57,0.08)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="text" placeholder="Type a message…" value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', color: '#F5F5F5', border: '1px solid rgba(222,106,57,0.12)', borderRadius: 12, padding: '10px 14px', outline: 'none', fontSize: 13, fontFamily: 'inherit' }}
              />
              <button className="chat-send-btn" onClick={handleSend}
                style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button className="chat-trigger-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Chat support">
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', alignItems: 'center' }}>
          {isOpen ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
        </motion.div>
        {!isOpen && <div className="chat-online-dot" />}
      </button>
    </div>
  );
}
