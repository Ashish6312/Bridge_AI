import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Users, Award, Target, BookOpen } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="landing-container" style={{ background: 'transparent' }}>
      
      {/* ── Mission ─────────────────────────────────────────────── */}
      <section className="about-hero" style={{ padding: '120px 0 60px' }}>
        <div className="container">
          <div className="about-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="premium-gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '24px', lineHeight: 1.1 }}>Our Mission</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '40px', maxWidth: '600px' }}>
                At BridgeAI, we believe that intelligence should be fluid, not trapped within the silos of individual AI platforms.
                Our team is building the connective tissue for the generative age.
              </p>
              
              <div className="about-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Target size={20} color="#8b5cf6" />
                  </div>
                  <h4 style={{ color: 'white', marginBottom: '8px' }}>Context Continuity</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Eliminating the 'Context Reset' that costs analysts hours of productivity.</p>
                </div>
                <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(6, 182, 212, 0.1)' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Shield size={20} color="#06b6d4" />
                  </div>
                  <h4 style={{ color: 'white', marginBottom: '8px' }}>Data Sovereignty</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Ensuring user context remains private, vault-bound, and portable.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="about-globe" style={{ position: 'relative' }}>
                <div style={{ 
                  width: '100%', aspectRatio: '1/1', background: 'var(--gradient-1)', 
                  borderRadius: '30px', opacity: 0.1, position: 'absolute', top: '20px', left: '20px' 
                }}></div>
                <div className="glass-card" style={{ 
                  width: '100%', aspectRatio: '1/1', padding: '12px', overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <img 
                    src="/about_mission_visionary.png" 
                    alt="BridgeAI Mission" 
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Core Values ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'white' }}>Intelligence Principles</h2>
          </div>
          <div className="about-values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: <Award />, title: "Excellence", desc: "Industrial-grade code and logic extraction without compromise." },
              { icon: <Users />, title: "Community", desc: "Built by AI analysts, for AI analysts. Fluid feedback cycles." },
              { icon: <BookOpen />, title: "Transparency", desc: "Clear protocols on how data is vaulted and bridged." }
            ].map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card" 
                style={{ padding: '32px', textAlign: 'center' }}
              >
                <div style={{ color: 'var(--primary)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{v.icon}</div>
                <h3 style={{ color: 'white', marginBottom: '12px' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
