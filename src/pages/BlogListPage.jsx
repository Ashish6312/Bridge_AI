import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { BLOGS } from '../data/blogsData';

const ITEMS_PER_PAGE = 6;

const BlogListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = "BridgeAI Insights | Multi-LLM Context Blog";
    const metaDesc = document.querySelector('meta[name="description"]');
    const descContent = "Explore high-fidelity technical articles, system architectures, secure context relays, and prompts guides on Bridge AI's blogs page.";
    if (metaDesc) {
      metaDesc.setAttribute("content", descContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descContent;
      document.head.appendChild(meta);
    }
  }, []);

  // Extract all unique categories
  const categories = useMemo(() => {
    const cats = new Set(BLOGS.map(post => post.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter posts by search query and category
  const filteredPosts = useMemo(() => {
    setCurrentPage(1); // Reset to first page when filtering
    return BLOGS.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Blog Hero Header */}
      <section style={{ padding: '140px 0 80px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'linear-gradient(180deg, var(--primary-soft) 0%, transparent 100%)', pointerEvents: 'none' }} />
        
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'var(--primary-soft)', borderRadius: '100px', marginBottom: '24px', border: '1px solid var(--border-subtle)' }}>
            <BookOpen size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', lineHeight: 1 }}>BridgeAI Insights</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '20px', lineHeight: 1.1 }}>
            The Sovereign <br /> <span style={{ color: 'var(--primary)' }}>Context Protocols</span> Blog
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Technical deep dives, architectural patterns, and enterprise security protocols for orchestrating multi-LLM networks.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ marginBottom: '48px', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '16px 24px', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Search Input Container */}
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
              <input 
                type="text"
                placeholder="Search articles, topics or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {/* Categories filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border-subtle)',
                    background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                    color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Grid of articles */}
      <section>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed var(--border-subtle)', borderRadius: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No articles match your search parameters. Try adjusting your query.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', background: 'var(--primary)', color: '#ffffff', border: 'none', fontWeight: '600', cursor: 'pointer' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid-auto-fit-medium" style={{ gap: '32px' }}>
                {paginatedPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.05 }}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'var(--bg-secondary)', 
                      borderRadius: '24px', 
                      overflow: 'hidden', 
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    whileHover={{ y: -8, borderColor: 'var(--primary)', boxShadow: '0 20px 40px rgba(99,102,241,0.08)' }}
                  >
                    {/* Image Area */}
                    <div style={{ overflow: 'hidden', display: 'block', aspectRatio: '16/10' }}>
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>

                    {/* Content Area */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', background: 'var(--primary-soft)', padding: '4px 10px', borderRadius: '100px' }}>
                          {post.category}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {post.date}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                        {post.title}
                      </h3>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                        {post.excerpt}
                      </p>

                      {/* Author & Read time row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
                            {post.author.avatar}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)' }}>{post.author.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{post.author.role}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '56px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontWeight: '600',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    Previous
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {Array.from({ length: totalPages }).map((_, pageIdx) => {
                      const pageNum = pageIdx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            border: '1px solid',
                            borderColor: currentPage === pageNum ? 'var(--primary)' : 'var(--border-subtle)',
                            background: currentPage === pageNum ? 'var(--primary)' : 'var(--bg-secondary)',
                            color: currentPage === pageNum ? '#ffffff' : 'var(--text-main)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontWeight: '600',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default BlogListPage;
