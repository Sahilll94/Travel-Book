// BackToTopButton.jsx
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-80 right-6 bg-[#06b6d4] text-white p-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-[#0891b2] transition duration-300 z-40"
        aria-label="Back to Top"
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default BackToTopButton;

