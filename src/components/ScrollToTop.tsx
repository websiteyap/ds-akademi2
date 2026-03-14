"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleVisibility = () => {
    // How much the user has scrolled
    const scrollPx = document.documentElement.scrollTop;
    
    // Total scrollable height
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Calculate percentage
    if (winHeightPx > 0) {
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    }

    // Show button after scrolling 300px
    if (scrollPx > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const circleRadius = 22;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div 
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`} 
      onClick={scrollToTop}
      aria-label="Yukarı Çık"
      title="Yukarı Çık"
    >
      <svg width="50" height="50" viewBox="0 0 50 50" className="progress-ring">
        <circle
          cx="25"
          cy="25"
          r={circleRadius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth="3"
        />
        <circle
          cx="25"
          cy="25"
          r={circleRadius}
          fill="none"
          stroke="var(--accent-color)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          transform="rotate(-90 25 25)"
        />
      </svg>
      <div className="scroll-arrow">
        <ArrowUp size={20} strokeWidth={2.5} />
      </div>
    </div>
  );
}
