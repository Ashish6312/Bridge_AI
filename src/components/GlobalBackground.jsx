import React from 'react';

const GlobalBackground = () => {
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at bottom, #060918 0%, #020617 100%)'
    }}>
      {/* Universal Grid Overlay */}
      <div className="bg-grid" style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', 
        backgroundSize: '80px 80px', zIndex: 1, maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)' 
      }} />
    </div>
  );
};

export default GlobalBackground;
