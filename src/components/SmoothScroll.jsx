import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SmoothScroll = ({ children }) => {
  const location = useLocation();

  // Instant scroll to top on page transitions to prevent mobile layout thrashing
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Only apply custom smooth wheel scrolling on desktop/laptop
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let isMoving = false;
    const speed = 0.08; // Interpolation speed (lower = smoother/longer scroll)

    const onWheel = (e) => {
      // Traverse parents to see if wheel is inside a scrollable container
      let parent = e.target;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.getPropertyValue('overflow-y') || style.getPropertyValue('overflow');
        if (overflowY === 'auto' || overflowY === 'scroll') {
          if (parent.scrollHeight > parent.clientHeight) {
            return; // Let the container scroll naturally
          }
        }
        parent = parent.parentElement;
      }

      // Prevent default page jump
      e.preventDefault();
      
      // Calculate target position
      targetScrollY += e.deltaY;
      
      // Keep within document limits
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));

      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateScroll);
      }
    };

    const updateScroll = () => {
      // Linear interpolation (lerp)
      currentScrollY += (targetScrollY - currentScrollY) * speed;

      // Scroll window to current position
      window.scrollTo(0, currentScrollY);

      // Continue animation until we are close enough to the target
      if (Math.abs(targetScrollY - currentScrollY) > 0.5) {
        requestAnimationFrame(updateScroll);
      } else {
        isMoving = false;
      }
    };

    // Update target when scrolled by other means (e.g. scrollbar drag, page down/up keys, hash jumps)
    const onScroll = () => {
      if (!isMoving) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
    };
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
