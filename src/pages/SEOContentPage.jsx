import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Globe, Target } from 'lucide-react';
import SEOHelmet from '../components/SEOHelmet.jsx';

const SEOContentPage = ({ type }) => {
  const { slug } = useParams();
  const [content, setContent] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const module = await import(`../seo-data/${type}.json`);
        const data = module.default;
        const item = data.find(i => i.slug === slug);
        setContent(item);
      } catch (err) {
        console.error('Failed to load SEO data:', err);
      }
    };
    loadContent();
  }, [slug, type]);

  if (!content) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-main)' }}>
      <h2>Protocol Initializing...</h2>
    </div>
  );

  return (
    <div className="seo-page-container" style={{ padding: '120px 0', minHeight: '100vh' }}>
      <SEOHelmet 
        title={content.name || content.title} 
        description={content.description} 
        keywords={content.keywords}
      />

      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: '900', 
            fontSize: '0.8rem', 
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px'
          }}>
            {type === 'industries' ? 'Industry Solution' : 'Context Protocol'}
          </span>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px', lineHeight: 1.1 }}>
            {content.name || content.title}
          </h1>
          
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '48px' }}>
            {content.description}
          </p>

          <div className="glass-card" style={{ padding: '40px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {type === 'industries' ? <Globe className="text-primary" /> : <Target className="text-primary" />}
              {type === 'industries' ? 'Key Strategic Benefits' : 'The Sovereign Solution'}
            </h2>
            
            {type === 'industries' ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {content.benefits.map((benefit, i) => (
                  <li key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '1.1rem' }}>
                    <CheckCircle2 className="text-primary" style={{ flexShrink: 0 }} />
                    {benefit}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                {content.solution}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/signup" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
              Deploy BridgeAI Now <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SEOContentPage;
