// components/ScrollToTop.tsx
"use client"
import { useEffect } from 'react';

const ScrollToTop = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);
  return null;
};

export default ScrollToTop;
