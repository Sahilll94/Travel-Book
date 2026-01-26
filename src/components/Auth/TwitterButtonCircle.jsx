import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { signInWithTwitter, checkExistingAccount } from '../../utils/firebase';
import AuthService from '../../services/authService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { handleAuthError } from '../../utils/authErrorHandler.jsx';

const TwitterButtonCircle = ({
  redirectPath = '/dashboard',
  isSignUp = false,
  className = '',
  ...props
}) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  // Clean up ripples after animation completes
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  // Animation variants for button
  const buttonVariants = {
    hover: {
      scale: 1.08,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    },
    tap: {
      scale: 0.95,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    initial: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }
  };

  const handleSignIn = async (e) => {
    if (isLoading) return;

    // Create ripple effect
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipples([...ripples, { x, y, id: Date.now() }]);
    }

    try {
      setIsLoading(true);

      // Subtle haptic feedback using navigator.vibrate if available
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }

      // Sign in with Twitter using Firebase
      const { user, idToken } = await signInWithTwitter();

      if (!user) {
        toast.error('Twitter sign-in failed. Please try again.');
        return;
      }

      console.log('Twitter auth - got ID token:', idToken ? `${idToken.substring(0, 10)}...` : 'missing');

      // Send the Firebase user data to your backend to either create a new user or get an existing one
      const data = await AuthService.twitterAuth({
        email: user.email,
        fullName: user.displayName || (user.email ? user.email.split('@')[0] : ''),
        photoURL: user.photoURL,
        uid: user.uid
      }, idToken);

      if (data.success) {
        // Login using your existing auth context
        login(data.token, data.user, redirectPath);
        toast.success('Signed in successfully with Twitter!');
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Twitter OAuth error:', error);
      handleAuthError(error, 'Twitter');
    } finally {
      setIsLoading(false);
    }
  };

  // Hover label text
  const getLabelText = () => {
    if (isSignUp) {
      return 'Sign up with Twitter';
    }
    return 'Sign in with Twitter';
  };

  return (
    <div className="relative group">
      <motion.button
        ref={buttonRef}
        onClick={handleSignIn}
        disabled={isLoading}
        className={`w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 overflow-hidden relative ${className}`}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label={getLabelText()}
        {...props}
      >
        {/* Ripple effect */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              initial={{ opacity: 0.7, scale: 0 }}
              animate={{ opacity: 0, scale: 4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                top: ripple.y,
                left: ripple.x,
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(6, 182, 212, 0.3)',
                zIndex: 5
              }}
            />
          ))}
        </AnimatePresence>

        {/* Loading spinner or Twitter icon */}
        <div className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-cyan-600 dark:border-gray-600 dark:border-t-cyan-400"></div>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#1DA1F2" />
            </svg>
          )}
        </div>
      </motion.button>

      {/* Tooltip on hover */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {getLabelText()}
      </div>
    </div>
  );
};

export default TwitterButtonCircle;
