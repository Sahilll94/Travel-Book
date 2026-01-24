import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { signInWithGithub } from '../../utils/firebase';
import AuthService from '../../services/authService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const GithubOAuthButton = ({ redirectPath = '/dashboard', isSignUp = false }) => {
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

  const handleGithubSignIn = async (e) => {
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

      // Sign in with GitHub using Firebase
      const { user } = await signInWithGithub();

      if (!user) {
        toast.error('GitHub sign-in failed. Please try again.');
        return;
      }

      // Send the Firebase user data to your backend to either create a new user or get an existing one
      const data = await AuthService.githubAuth({
        email: user.email,
        fullName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        uid: user.uid
      });

      if (data.success) {
        // Login using your existing auth context
        login(data.token, data.user, redirectPath);
        toast.success('Signed in successfully with GitHub!');
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      toast.error('GitHub sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleGithubSignIn}
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

      {/* Loading spinner or GitHub icon */}
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
        ) : (<div className="flex items-center justify-center bg-white dark:bg-gray-700 rounded-full w-7 h-7 shadow-md transition-transform duration-300 group-hover:scale-110">
          {/* GitHub logo */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" className="fill-gray-800 dark:fill-white" />
          </svg>
        </div>
        )}
      </div>

      {/* Button text */}
      <span className={`text-base font-medium relative z-10 transition-all duration-300 ${isLoading ? 'opacity-0' : 'group-hover:translate-x-1'}`}>
        {isSignUp
          ? 'Sign up with GitHub'
          : 'Sign in with GitHub'
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

export default GithubOAuthButton;
