import React from 'react';

const GlobalBackground = () => {
  return (
    <>
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.1); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 40px) scale(1.05); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, 30px) scale(0.95); }
        }
        @keyframes subtleGridMove {
          0% { background-position: 0px 0px; }
          100% { background-position: 80px 80px; }
        }
      `}</style>
      
      <div style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        zIndex: 0, pointerEvents: 'none', background: 'var(--bg-main)', overflow: 'hidden'
      }}>
        {/* Ambient Glowing Orbs */}
        {/* Primary Orange Orb */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 107, 44, 0.08) 0%, transparent 70%)',
          filter: 'blur(100px)', animation: 'floatOrb1 20s ease-in-out infinite'
        }} />
        
        {/* Purple Accent Orb */}
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-10%', width: '700px', height: '700px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 90, 237, 0.07) 0%, transparent 70%)',
          filter: 'blur(120px)', animation: 'floatOrb2 25s ease-in-out infinite'
        }} />
        
        {/* Accent Red Orb */}
        <div style={{
          position: 'absolute', top: '40%', left: '30%', width: '500px', height: '500px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 92, 92, 0.04) 0%, transparent 70%)',
          filter: 'blur(130px)', animation: 'floatOrb3 18s ease-in-out infinite'
        }} />

        {/* Subtle Animated Grid Overlay */}
        <div className="bg-grid" style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundImage: 'linear-gradient(rgba(255, 107, 44, 0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 44, 0.012) 1px, transparent 1px)', 
          backgroundSize: '80px 80px', zIndex: 1, opacity: 0.7, 
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
          animation: 'subtleGridMove 120s linear infinite'
        }} />

        {/* Premium Cinematic Noise Texture */}
        <div style={{ 
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, opacity: 0.15, 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")` 
        }} />
      </div>
    </>
  );
};

export default GlobalBackground;
