import React from 'react';

const TESTIMONIALS = [
  { name: "Rahul Mehta", role: "Senior Backend Engineer", company: "Razorpay, Bengaluru", avatar: "RM", color: "#6366f1", stars: 5, platform: "Product Hunt", quote: "We use Claude for reasoning and GPT-4 for codegen. BridgeAI lets us switch mid-session without losing context. Saved our team hours every week." },
  { name: "Sarah Kim", role: "ML Engineer", company: "Anthropic Partner, SF", avatar: "SK", color: "#0ea5e9", stars: 5, platform: "G2", quote: "The zero-latency relay is not marketing fluff — it genuinely feels instant. Tested it switching between Claude 3 and GPT-4o. No drop in context whatsoever." },
  { name: "Priya Nair", role: "AI Product Manager", company: "Flipkart, Bengaluru", avatar: "PN", color: "#8b5cf6", stars: 5, platform: "Trustpilot", quote: "Our research team had context fragmentation across 4 different LLMs. BridgeAI unified everything in one protocol. Game changer for enterprise use." },
  { name: "Marcus Johnson", role: "Lead Developer", company: "Accenture, London", avatar: "MJ", color: "#10b981", stars: 4, platform: "Reddit", quote: "Solid tool. Had a minor hiccup with Gemini sync on day one — support fixed it in under 2 hours. The memory vault feature is worth it alone." },
  { name: "Arjun Sharma", role: "Full Stack Developer", company: "Zepto, Mumbai", avatar: "AS", color: "#f59e0b", stars: 5, platform: "LinkedIn", quote: "I was manually copy-pasting between ChatGPT and Claude every day. BridgeAI feels like someone finally solved the obvious problem everyone ignored." },
  { name: "Ananya Krishnan", role: "Data Scientist", company: "Swiggy, Hyderabad", avatar: "AK", color: "#ec4899", stars: 5, platform: "G2", quote: "The AES-256 encryption is what sold us. We handle sensitive customer data and could not use multi-LLM tools before this. Now we can. Incredible." },
  { name: "Tom Richards", role: "CTO", company: "NeuralStack, Berlin", avatar: "TR", color: "#14b8a6", stars: 5, platform: "Product Hunt", quote: "We built our entire multi-agent pipeline on BridgeAI Protocol. The structured JSON export means we can port context to any new model as they launch." },
  { name: "Vikram Patel", role: "DevOps Engineer", company: "CRED, Bengaluru", avatar: "VP", color: "#6366f1", stars: 4, platform: "Trustpilot", quote: "Setup took under 10 minutes. The CLI tool is clean, docs are excellent. Would love native Slack integration — apparently it's on the roadmap." },
  { name: "Divya Reddy", role: "AI Research Lead", company: "IIT Bombay Startup", avatar: "DR", color: "#f97316", stars: 5, platform: "Twitter / X", quote: "Running LLM benchmarks across models and manually managing context was a nightmare. BridgeAI's Intelligence Sync cut our research setup time by 60%." },
  { name: "Elena Vasquez", role: "Tech Lead", company: "Sovereign Lab, Madrid", avatar: "EV", color: "#0ea5e9", stars: 5, platform: "G2", quote: "Enterprise privacy was non-negotiable for us. Zero-knowledge architecture means our proprietary prompts never leave our infrastructure. Finally." }
];

const TestimonialMarquee = () => {
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(count)) {
        stars.push(<span key={i} style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>);
      } else if (i - count < 1) {
        stars.push(<span key={i} style={{ color: '#f59e0b', fontSize: '14px', opacity: 0.5 }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: 'var(--border-subtle)', fontSize: '14px' }}>★</span>);
      }
    }
    return stars;
  };

  return (
    <section style={{ padding: '100px 0', background: 'var(--bg-main)', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '12px' }}>
          Trusted by developers worldwide
        </p>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
          What developers are saying
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Real reviews from teams switching to BridgeAI Protocol
        </p>
      </div>

      <div className="carousel-wrap" style={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
        <style>
          {`
            .carousel-wrap::before,
            .carousel-wrap::after {
              content: '';
              position: absolute; top: 0; width: 80px; height: 100%; z-index: 2; pointer-events: none;
            }
            .carousel-wrap::before { left: 0; background: linear-gradient(to right, var(--bg-main, #0f172a), transparent); }
            .carousel-wrap::after  { right: 0; background: linear-gradient(to left, var(--bg-main, #0f172a), transparent); }

            .carousel-track {
              display: flex;
              gap: 20px;
              width: max-content;
              animation: scroll-left 40s linear infinite;
            }
            .carousel-track:hover { animation-play-state: paused; }

            @keyframes scroll-left {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }

            .review-card {
              background: var(--bg-secondary);
              border: 1px solid var(--border-subtle);
              border-radius: 16px;
              padding: 24px;
              width: 320px;
              flex-shrink: 0;
              display: flex;
              flex-direction: column;
              gap: 14px;
              box-shadow: 0 2px 12px rgba(0,0,0,0.15);
              transition: box-shadow 0.2s, transform 0.2s;
              text-align: left;
            }
            .review-card:hover { 
              box-shadow: 0 8px 28px rgba(99,102,241,0.18); 
              border-color: rgba(99,102,241,0.3);
              transform: translateY(-2px); 
            }
          `}
        </style>
        <div className="carousel-track">
          {duplicatedTestimonials.map((t, idx) => (
            <div key={idx} className="review-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '2px' }}>{renderStars(t.stars)}</div>
                <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', background: 'var(--bg-main)', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>{t.platform}</span>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1, margin: 0 }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', color: 'white', flexShrink: 0, background: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px', marginBottom: 0 }}>{t.role}</p>
                  <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '500', margin: 0 }}>{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialMarquee;
