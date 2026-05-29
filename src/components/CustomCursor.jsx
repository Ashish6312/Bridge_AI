import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let mx = -100, my = -100;
    let angle = 0;
    let hovering = false;
    let animationFrameId;

    const handleMouseMove = e => {
      mx = e.clientX;
      my = e.clientY;
    };
    
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]')
      ) {
        hovering = true;
      } else {
        hovering = false;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Center white dot */
      ctx.beginPath();
      ctx.arc(mx, my, hovering ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      /* Rotating dashed ring */
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      const ringRadius = hovering ? 20 : 16;
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = hovering ? 'rgba(255, 107, 44, 0.7)' : 'rgba(255, 107, 44, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      /* Small glowing accent dot situated exactly on the rotating ring */
      ctx.beginPath();
      ctx.arc(ringRadius, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = hovering ? '#7C3AED' : '#FF6B2C';
      ctx.fill();
      
      /* Glow effect for the small accent dot */
      ctx.shadowBlur = 8;
      ctx.shadowColor = hovering ? '#7C3AED' : '#FF6B2C';
      ctx.beginPath();
      ctx.arc(ringRadius, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = hovering ? '#7C3AED' : '#FF6B2C';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      /* Outer ghost ring — no rotation */
      ctx.rotate(-angle);
      ctx.beginPath();
      ctx.arc(0, 0, hovering ? 32 : 26, 0, Math.PI * 2);
      ctx.strokeStyle = hovering ? 'rgba(255, 107, 44, 0.18)' : 'rgba(255, 107, 44, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      /* Spin speed: slower on hover */
      angle += hovering ? 0.015 : 0.035;

      animationFrameId = requestAnimationFrame(draw);
    }
    
    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <style>
        {`
          * { cursor: none !important; }
        `}
      </style>
      <canvas 
        ref={canvasRef} 
        id="cursorCanvas" 
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99999
        }} 
      />
    </>
  );
};

export default CustomCursor;
