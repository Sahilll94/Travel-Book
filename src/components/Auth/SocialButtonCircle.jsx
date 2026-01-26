import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { signInWithGoogle, signInWithTwitter, checkExistingAccount } from '../../utils/firebase';
import AuthService from '../../services/authService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { handleAuthError } from '../../utils/authErrorHandler.jsx';

const SocialButtonCircle = ({
  provider = 'google',
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
      // Sign in with selected provider using Firebase
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else if (provider === 'twitter') {
        result = await signInWithTwitter();
      } else {
        throw new Error('Unsupported provider');
      }

      const { user, idToken } = result;
      if (!user) {
        toast.error(`${provider} sign-in failed. Please try again.`);
        return;
      }

      console.log('Google auth - got ID token:', idToken ? `${idToken.substring(0, 10)}...` : 'missing');

      // Send the Firebase user data to your backend to either create a new user or get an existing one
      let data;
      if (provider === 'google') {
        data = await AuthService.googleAuth({
          email: user.email,
          fullName: user.displayName || (user.email ? user.email.split('@')[0] : ''),
          photoURL: user.photoURL,
          uid: user.uid
        });
      } else if (provider === 'twitter') {
        data = await AuthService.twitterAuth({
          email: user.email,
          fullName: user.displayName || (user.email ? user.email.split('@')[0] : ''),
          photoURL: user.photoURL,
          uid: user.uid
        }, idToken);
      }

      if (data && data.success) {
        // Login using your existing auth context
        login(data.token, data.user, redirectPath);
        toast.success(`Signed in successfully with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`);
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      handleAuthError(error, provider.charAt(0).toUpperCase() + provider.slice(1));
    } finally {
      setIsLoading(false);
    }
  };

  // Get the appropriate icon based on provider
  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#1DA1F2" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Hover label text
  const getLabelText = () => {
    if (isSignUp) {
      return `Sign up with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
    }
    return `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
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

        {/* Loading spinner or provider icon */}
        <div className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-cyan-600 dark:border-gray-600 dark:border-t-cyan-400"></div>
          ) : (
            getProviderIcon()
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

export default SocialButtonCircle;
