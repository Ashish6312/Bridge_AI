import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
  { quote: "BridgeAI completely changed how our team handles context. Moving sessions between Claude and ChatGPT used to be a copy-paste nightmare.", author: "Alex G.", role: "Software Engineer", avatar: "AG", rating: 5 },
  { quote: "Pretty good tool for my daily workflow. Had some issues with Gemini sync initially but their support sorted it out fast.", author: "Mia T.", role: "Data Analyst", avatar: "MT", rating: 4 },
  { quote: "Finally, a secure way to persist our LLM knowledge. The encryption ensures our enterprise data never leaks. Highly recommend.", author: "John D.", role: "Tech Lead", avatar: "JD", rating: 5 }
];

const TestimonialCarousel = () => {
  const [index, setIndex] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ padding: '40px 0' }}
        >
          <h3 style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '32px', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
            "{TESTIMONIALS[index].quote}"
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifycontent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
              {TESTIMONIALS[index].avatar}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1rem' }}>{TESTIMONIALS[index].author}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{TESTIMONIALS[index].role}</div>
              <div style={{ color: '#fbbf24', fontSize: '1rem', marginTop: '4px', letterSpacing: '2px' }}>
                {'★'.repeat(TESTIMONIALS[index].rating) + '☆'.repeat(5 - TESTIMONIALS[index].rating)}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
        {TESTIMONIALS.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            style={{ 
              width: '8px', height: '8px', borderRadius: '50%', 
              background: i === index ? 'var(--primary)' : 'var(--gray-200)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
