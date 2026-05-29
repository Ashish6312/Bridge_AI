import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, ChevronDown, Award, Share2, Shield, Zap, Puzzle, Volume2, VolumeX, Play, Pause, Square, BookOpen } from 'lucide-react';
import { BLOGS } from '../data/blogsData';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const utteranceRef = useRef(null);

  // Stop speaking when slug changes or component unmounts
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, [slug]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayVoice = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // Cancel anything running
    window.speechSynthesis.cancel();

    // Prepare text to read
    const bodyText = post?.content || '';
    const fullTextToRead = `${post?.title || ''}. By ${post?.author?.name || ''}. ${bodyText}`;

    const utterance = new SpeechSynthesisUtterance(fullTextToRead);
    utterance.rate = speechRate;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePauseVoice = () => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStopVoice = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleRateChange = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(speechRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setSpeechRate(nextRate);

    // If currently speaking, we need to restart with the new rate
    if (isSpeaking || isPaused) {
      const wasPaused = isPaused;
      window.speechSynthesis.cancel();
      
      const bodyText = post?.content || '';
      const fullTextToRead = `${post?.title || ''}. By ${post?.author?.name || ''}. ${bodyText}`;
      const utterance = new SpeechSynthesisUtterance(fullTextToRead);
      utterance.rate = nextRate;
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      if (wasPaused) {
        window.speechSynthesis.pause();
        setIsSpeaking(false);
        setIsPaused(true);
      } else {
        setIsSpeaking(true);
        setIsPaused(false);
      }
    }
  };

  // Find active blog post
  const post = useMemo(() => {
    return BLOGS.find(p => p.slug === slug);
  }, [slug]);

  // Set browser metadata and title for SEO/AEO
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | BridgeAI Insights`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", post.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = post.excerpt;
      document.head.appendChild(meta);
    }
  }, [post]);

  // Calculate reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re-scroll to top on slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Extract outline headers from paragraph strings
  const articleOutline = useMemo(() => {
    if (!post) return [];
    // Outline headers corresponding to the text blocks generated
    return [
      "Introduction to the Ecosystem",
      "Analyzing the Core Obstacles",
      "Architecting the Sync Relay",
      "Under the Hood: Technical Details",
      "Practical Setup & Integration",
      "Zero-Knowledge Security Analysis",
      "Enterprise ROI & Efficiency",
      "Prompt Optimization Patterns",
      "The Future of Sovereign AI"
    ];
  }, [post]);

  // Find related articles (matching category, excluding current post)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const matches = BLOGS.filter(p => p.category === post.category && p.id !== post.id);
    return matches.slice(0, 2);
  }, [post]);

  if (!post) {
    return (
      <div style={{ background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>Article Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The requested article does not exist or has been relocated.</p>
        <Link to="/blog" style={{ padding: '12px 24px', background: 'var(--primary)', color: '#ffffff', borderRadius: '100px', textDecoration: 'none', fontWeight: '600' }}>
          Back to Blog
        </Link>
      </div>
    );
  }

  // Parse paragraphs of content
  const paragraphs = post.content.split('\n\n');

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '120px', position: 'relative' }}>
      {/* Article schema for SEO/AEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "image": [post.image],
          "datePublished": post.date,
          "author": [{
            "@type": "Person",
            "name": post.author.name,
            "jobTitle": post.author.role
          }],
          "description": post.excerpt,
          "wordCount": post.wordCount
        })}
      </script>

      {/* FAQ schema for the blog post */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": post.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        })}
      </script>
      
      {/* Scroll Progress Indicator */}
      <div 
        style={{ 
          position: 'fixed', top: 0, left: 0, width: `${scrollProgress}%`, height: '4px', 
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))', 
          zIndex: 9999, transition: 'width 0.1s ease-out' 
        }} 
      />

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 24px 0' }}>
        
        {/* Back Link */}
        <Link 
          to="/blog" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', marginBottom: '40px', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} /> Back to Insights
        </Link>

        {/* Article Meta Header */}
        <div style={{ maxWidth: '800px', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', background: 'var(--primary-soft)', padding: '6px 14px', borderRadius: '100px', display: 'inline-block', marginBottom: '24px' }}>
            {post.category}
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: '24px' }}>
            {post.title}
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
                {post.author.avatar}
              </div>
              <div>
                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{post.author.name}</div>
                <div style={{ fontSize: '0.75rem' }}>{post.author.role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '24px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> {post.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> {post.readTime}
              </span>
            </div>
          </div>
        </div>
        {/* Audio Player Block */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '16px 24px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <style>
            {`
              @keyframes voicePulse {
                0% { box-shadow: 0 0 0 0 rgba(222, 106, 57, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(222, 106, 57, 0); }
                100% { box-shadow: 0 0 0 0 rgba(222, 106, 57, 0); }
              }
              .voice-pulsing {
                animation: voicePulse 2s infinite !important;
              }
              .blog-detail-grid {
                display: grid;
                grid-template-columns: 2.5fr 1fr;
                gap: 64px;
                align-items: start;
              }
              .blog-sidebar {
                position: sticky;
                top: 100px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                flex-shrink: 0;
              }
              .blog-hero-img-container {
                width: 100%;
                aspect-ratio: 21/9;
                border-radius: 32px;
                overflow: hidden;
                margin-bottom: 56px;
                border: 1px solid var(--border-subtle);
                box-shadow: var(--shadow-lg);
              }
              @media (max-width: 992px) {
                .blog-detail-grid {
                  grid-template-columns: 1fr;
                  gap: 40px;
                }
                .blog-sidebar {
                  position: static;
                }
                .blog-hero-img-container {
                  aspect-ratio: 16/9;
                  margin-bottom: 32px;
                  border-radius: 20px;
                }
              }
            `}
          </style>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              className={isSpeaking ? 'voice-pulsing' : ''}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isSpeaking ? 'var(--primary)' : 'var(--primary-soft)',
                color: isSpeaking ? '#ffffff' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              {isSpeaking ? <Volume2 size={20} /> : <Volume2 size={20} />}
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)' }}>Listen to this article</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {isSpeaking ? 'Reading aloud...' : isPaused ? 'Narration paused' : 'AI voice generated narration'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Play / Pause button */}
            <button 
              onClick={isSpeaking ? handlePauseVoice : handlePlayVoice}
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title={isSpeaking ? "Pause Narration" : "Play Narration"}
            >
              {isSpeaking ? <Pause size={18} fill="#ffffff" /> : <Play size={18} fill="#ffffff" style={{ marginLeft: '2px' }} />}
            </button>

            {/* Stop Button */}
            {(isSpeaking || isPaused) && (
              <button 
                onClick={handleStopVoice}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-soft)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                title="Stop Narration"
              >
                <Square size={16} fill="currentColor" />
              </button>
            )}

            {/* Speed Toggle */}
            <button
              onClick={handleRateChange}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                padding: '8px 14px',
                borderRadius: '30px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '56px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Change Speed"
            >
              {speechRate}x
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="blog-hero-img-container">
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Two Column Content Layout */}
        <div className="blog-detail-grid">
          
          {/* Main Article Body */}
          <article style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.75 }}>
            {/* Executive Summary / Key Takeaways Card */}
            <div style={{ 
              background: 'var(--primary-soft)', 
              borderLeft: '4px solid var(--primary)', 
              borderRadius: '0 16px 16px 0', 
              padding: '24px', 
              marginBottom: '40px' 
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <BookOpen size={18} color="var(--primary)" /> Executive Intelligence Summary
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                {post.excerpt}
              </p>
            </div>

            {paragraphs.map((p, idx) => {
              // 1. Drop-cap for the first paragraph
              if (idx === 0) {
                const firstLetter = p.charAt(0);
                const restOfParagraph = p.slice(1);
                return (
                  <div key={idx} style={{ marginBottom: '36px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '400', margin: 0, fontSize: '1.15rem', lineHeight: 1.8 }}>
                      <span style={{ 
                        float: 'left', 
                        fontSize: '3.5rem', 
                        fontWeight: '900', 
                        lineHeight: '0.8', 
                        marginRight: '12px', 
                        marginTop: '4px',
                        color: 'var(--primary)',
                        fontFamily: 'Outfit, sans-serif'
                      }}>{firstLetter}</span>
                      {restOfParagraph}
                    </p>
                  </div>
                );
              }

              // 2. Blockquote for paragraph 4 (pull-quote)
              if (idx === 4) {
                return (
                  <div key={idx} style={{ marginBottom: '36px' }}>
                    {idx < articleOutline.length && (
                      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '48px', marginBottom: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '6px', height: '24px', background: 'var(--primary)', borderRadius: '3px', display: 'inline-block' }} />
                        {articleOutline[idx]}
                      </h2>
                    )}
                    <div style={{ 
                      margin: '40px 0', 
                      padding: '20px 32px', 
                      borderLeft: '4px solid var(--primary)', 
                      fontStyle: 'italic', 
                      fontSize: '1.2rem', 
                      lineHeight: 1.6, 
                      color: 'var(--text-main)', 
                      background: 'var(--bg-secondary)',
                      borderRadius: '0 16px 16px 0',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      "{p}"
                    </div>
                  </div>
                );
              }

              // 3. Security Callout Note for paragraph 6
              if (idx === 6) {
                return (
                  <div key={idx} style={{ marginBottom: '36px' }}>
                    {idx < articleOutline.length && (
                      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '48px', marginBottom: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '6px', height: '24px', background: 'var(--primary)', borderRadius: '3px', display: 'inline-block' }} />
                        {articleOutline[idx]}
                      </h2>
                    )}
                    <div style={{ 
                      margin: '40px 0', 
                      padding: '24px', 
                      background: 'rgba(5, 150, 105, 0.05)', 
                      border: '1px dashed #059669', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      gap: '16px', 
                      alignItems: 'flex-start' 
                    }}>
                      <div style={{ background: '#059669', color: 'white', borderRadius: '50%', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Shield size={18} />
                      </div>
                      <div>
                        <h5 style={{ fontWeight: '800', margin: '0 0 6px', color: 'var(--text-main)', fontSize: '0.95rem' }}>Security Protocol Note</h5>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                          {p}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // Default paragraph rendering
              return (
                <div key={idx} style={{ marginBottom: '36px' }}>
                  {idx < articleOutline.length && (
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '48px', marginBottom: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '6px', height: '24px', background: 'var(--primary)', borderRadius: '3px', display: 'inline-block' }} />
                      {articleOutline[idx]}
                    </h2>
                  )}
                  <p style={{ color: 'var(--text-secondary)', fontWeight: '400', margin: 0 }}>
                    {p}
                  </p>
                </div>
              );
            })}

            {/* FAQs Accordion */}
            <div style={{ marginTop: '80px', borderTop: '1px solid var(--border-subtle)', paddingTop: '56px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '32px', color: 'var(--text-main)' }}>
                Article Frequently Asked Questions
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {post.faqs.map((faq, fIdx) => {
                  const isExpanded = activeFaq === fIdx;
                  return (
                    <div 
                      key={fIdx}
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '16px', 
                        border: '1px solid var(--border-subtle)', 
                        overflow: 'hidden',
                        transition: 'all 0.2s ease-out'
                      }}
                    >
                      <button
                        onClick={() => setActiveFaq(isExpanded ? null : fIdx)}
                        style={{
                          width: '100%',
                          padding: '20px 24px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          outline: 'none'
                        }}
                      >
                        <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', paddingRight: '16px' }}>
                          {faq.q}
                        </span>
                        <ChevronDown 
                          size={18} 
                          style={{ 
                            color: 'var(--text-secondary)',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }} 
                        />
                      </button>
                      
                      {isExpanded && (
                        <div style={{ padding: '0 24px 20px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid var(--border-light)' }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside className="blog-sidebar">
            
            {/* Outline list */}
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-main)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                On this page
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {articleOutline.map((item, index) => (
                  <div 
                    key={index} 
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, cursor: 'pointer', transition: 'color 0.2s' }}
                    onClick={() => {
                      // Scroll to top index of paragraphs
                      const targetIdx = index;
                      const paragraphs = document.querySelectorAll('article > div');
                      if (paragraphs[targetIdx]) {
                        paragraphs[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {item}
                  </div>
                ))}
              </nav>
            </div>
 
            {/* Sidebar extension CTA card */}
            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(10px)' }} />
              
              <div style={{ color: 'var(--primary)', marginBottom: '12px', display: 'inline-flex', padding: '8px', background: 'var(--primary-soft)', borderRadius: '10px' }}>
                <Puzzle size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                BridgeAI Analyst Extension
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
                Sync context blocks and retain conversation structures directly inside your browser.
              </p>
              <Link 
                to="/extension" 
                style={{ 
                  display: 'block', padding: '10px 14px', background: 'var(--primary)', color: '#ffffff', 
                  borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '700', 
                  boxShadow: '0 4px 14px rgba(99,102,241,0.2)' 
                }}
              >
                Install Analyst Free
              </Link>
            </div>
          </aside>

        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: '100px', borderTop: '1px solid var(--border-subtle)', paddingTop: '64px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '36px' }}>
              Recommended Insights
            </h2>
            
            <div className="grid-auto-fit-large" style={{ gap: '32px' }}>
              {relatedPosts.map(related => (
                <div 
                  key={related.id} 
                  onClick={() => navigate(`/blog/${related.slug}`)}
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', display: 'block' }}>
                    <img src={related.image} alt={related.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'inline-block' }}>
                      {related.category}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.3 }}>
                      {related.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                      {related.excerpt}
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}>
                      Read Post <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetailPage;
