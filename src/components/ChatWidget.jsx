import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi there! 👋 How can we help you bridge your AI context today?' },
    { id: 2, sender: 'bot', text: 'You can also check our docs for quick answers.' }
  ]);
  const messagesEndRef = useRef(null);

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

  const handleSend = () => {
    if (!message.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: message.trim() };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const lowerText = userMsg.text.toLowerCase();
      let responseText = "I'm not quite sure about that. Our documentation might have the answer, or you can contact support@bridgeai.com.";
      let responseLink = null;
      
      if (lowerText.includes('more info') || lowerText.includes('more information') || lowerText.includes('details') || lowerText.includes('read more')) {
        responseText = "For an in-depth look at our architecture and features, check out our blog or detailed features section!";
        responseLink = { url: "#features", label: "View Features" };
      } else if (lowerText.includes('what is') || lowerText.includes('about') || lowerText.includes('what do you do')) {
        responseText = "Bridge AI is a universal chat and prompt sync engine. We allow you to instantly bridge, summarize, and sync conversation contexts across ChatGPT, Claude, Gemini, and DeepSeek without context loss.";
      } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('pricing')) {
        responseText = "BridgeAI is currently in a free beta phase for early adopters! Keep an eye on our pricing page for future updates.";
        responseLink = { url: "#pricing", label: "View Pricing" };
      } else if (lowerText.includes('docs') || lowerText.includes('documentation') || lowerText.includes('help') || lowerText.includes('faq')) {
        responseText = "You can find our comprehensive documentation covering system architectures and prompt guides, or check out our FAQ section.";
        responseLink = { url: "#faq", label: "View FAQ" };
      } else if (lowerText.includes('contact') || lowerText.includes('support')) {
        responseText = "You can reach our support team directly at support@bridgeai.com. We're here to help!";
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        responseText = "Hello there! How can I help you with BridgeAI today?";
      } else if (lowerText.includes('how it works') || lowerText.includes('how does it work') || lowerText.includes('features')) {
        responseText = "It works by securely extracting your context from one LLM (like ChatGPT) and injecting it into another (like Claude), maintaining your intelligence vault seamlessly. We support all major models!";
        responseLink = { url: "#features", label: "Explore Features" };
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: responseText, link: responseLink }]);
    }, 600);
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
