import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth tracking for the outer ring
  const springConfig = { damping: 25, stiffness: 250 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (isHidden) setIsHidden(false);

      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isHidden]);

  if (isHidden) return null;

  return (
    <>
      {/* Refined Professional Mouse Follower Ring */}
      <motion.div
        animate={{
          scale: isClicking ? 0.9 : isPointer ? 1.3 : 1,
          borderColor: isPointer ? 'rgba(139, 92, 246, 0.4)' : 'rgba(148, 163, 184, 0.2)',
          backgroundColor: isPointer ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
          width: isPointer ? 48 : 32,
          height: isPointer ? 48 : 32,
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          border: '1px solid',
          borderRadius: '50%',
          zIndex: 999998,
          pointerEvents: 'none',
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          backdropFilter: isPointer ? 'blur(1px)' : 'none',
          mixBlendMode: 'plus-lighter', // Professional blend mode
        }}
      />
    </>
  );
};

export default CustomCursor;
