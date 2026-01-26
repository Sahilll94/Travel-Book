import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { signInWithGoogle } from '../../utils/firebase';
import AuthService from '../../services/authService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleOAuthButton = ({ redirectPath = '/dashboard', isSignUp = false }) => {
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
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    initial: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }
  };

  const handleGoogleSignIn = async (e) => {
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

      // Sign in with Google using Firebase
      const { user } = await signInWithGoogle();

      if (!user) {
        toast.error('Google sign-in failed. Please try again.');
        return;
      }

      // Send the Firebase user data to your backend to either create a new user or get an existing one
      const data = await AuthService.googleAuth({
        email: user.email,
        fullName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      });

      if (data.success) {
        // Login using your existing auth context
        login(data.token, data.user, redirectPath);
        toast.success('Signed in successfully with Google!');
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full py-3.5 flex items-center justify-center gap-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-medium shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 overflow-hidden relative group"
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Background hover effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(6, 182, 212, 0.3)',
              zIndex: 5
            }}
          />
        ))}
      </AnimatePresence>

      {/* Loading spinner or Google icon */}
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-cyan-600 dark:border-gray-600 dark:border-t-cyan-400"></div>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="ml-2 overflow-hidden"
            >
              <span className="text-cyan-600 dark:text-cyan-400 text-sm font-medium">Connecting...</span>
            </motion.div>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-white rounded-full w-7 h-7 shadow-md transition-transform duration-300 group-hover:scale-110">
            {/* Google "G" logo with official colors */}
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
        )}
      </div>

      {/* Button text */}
      <span className={`text-base font-medium relative z-10 transition-all duration-300 ${isLoading ? 'opacity-0' : 'group-hover:translate-x-1'}`}>
        {isSignUp
          ? 'Sign up with Google'
          : 'Sign in with Google'
        }
      </span>

      {/* Subtle right arrow icon that appears on hover */}
      <motion.span
        className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        initial={{ x: -5 }}
        animate={{ x: 0 }}
      >
        →
      </motion.span>
    </motion.button>
  );
};

export default GoogleOAuthButton;
