import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCheck, FaArrowRight } from 'react-icons/fa';
import OTPInput from '../Input/OTPInput';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

const OTPVerification = ({ email, onVerify, onResend, isSignup = true, error }) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Initialize countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Format email for display (show first 3 chars and domain)
  const formatEmail = (email) => {
    if (!email || email.indexOf('@') === -1) return email;
    
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 3) + '•'.repeat(Math.max(0, username.length - 3));
    
    return `${maskedUsername}@${domain}`;
  };

  // Handle OTP completion
  const handleOtpComplete = (otp) => {
    onVerify(otp);
  };

  // Handle resend OTP
  const handleResend = () => {
    onResend();
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full rounded-xl p-5 sm:p-10 bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/20"
    >
      {/* Logo */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Link to="/" className="inline-block">
          <img src={logo} alt="Travel Book Logo" loading="eager" className="h-20 mx-auto hover:scale-105 transition-transform duration-300" />
        </Link>
      </motion.div>

      <div className="text-center mb-8">
        <motion.h2 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-semibold text-gray-800 dark:text-white mb-3"
        >
          {isSignup ? 'Verify your email' : 'Enter verification code'}
        </motion.h2>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-2"
        >
          <FaEnvelope className="text-cyan-500 mr-2" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            We sent a code to <span className="font-medium">{formatEmail(email)}</span>
          </p>
        </motion.div>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          {isSignup ? 'Please enter the 6-digit code to verify your account' : 'Enter the 6-digit code to continue'}
        </motion.p>
      </div>

      {/* OTP Input */}
      <div className="mb-8">
        <OTPInput length={6} onComplete={handleOtpComplete} />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6"
          >
            <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300"
        onClick={() => {}}
      >
        <span>Verify</span>
        <FaArrowRight />
      </motion.button>

      {/* Resend OTP */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Didn't receive the code?
        </p>
        {canResend ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResend}
            className="text-cyan-600 dark:text-cyan-400 font-medium text-sm hover:underline"
          >
            Resend Code
          </motion.button>
        ) : (
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Resend code in <span className="font-medium">{countdown}s</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default OTPVerification;