import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "sonner";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { validateEmail } from "../../utils/helper";
import logo from "../../assets/images/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formTouched, setFormTouched] = useState({
    email: false,
  });

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (formTouched.email) {
      if (!validateEmail(e.target.value)) {
        setError("Please enter a valid email address");
      } else {
        setError(null);
      }
    }
  };

  const handleInputFocus = (field) => {
    setFormTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    setFormTouched({
      email: true,
    });

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/forgot-password", {
        email,
      });

      if (response.data && !response.data.error) {
        setSuccess(true);
        toast.success("Password reset link sent to your email!");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Failed to send reset link. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative flex items-center justify-center py-10 px-4"
    >
      <HelmetProvider>
        <Helmet>
          <title>Forgot Password | Travel Book</title>
        </Helmet>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md rounded-xl p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/20"
        >
          {/* Logo Section */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-6"
          >
            <Link to="/">
              <img
                src={logo}
                alt="Travel Book Logo"
                loading="eager"
                className="h-20 mx-auto hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </motion.div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center">
                <FaCheckCircle className="text-green-500 text-5xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Check Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and click on the "Secure Account" button to reset your password.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                If you don't see the email, please check your spam folder. The link will expire in 1 hour.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300"
                onClick={() => navigate("/login")}
              >
                <span>Return to Login</span>
                <FaArrowRight />
              </motion.button>
            </motion.div>
          ) : (
            <>
              <h4 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
                Forgot Your Password?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
                Enter your email address below and we'll send you a link to reset your password.
              </p>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6"
                  >
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => handleInputFocus("email")}
                    className={`pl-10 pr-4 py-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 border ${
                      formTouched.email && !validateEmail(email)
                        ? "border-red-400 dark:border-red-600 focus:ring-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:ring-cyan-500"
                    } focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white`}
                  />
                  {formTouched.email && !validateEmail(email) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-500"
                    >
                      Please enter a valid email address
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <FaArrowRight />
                    </>
                  )}
                </motion.button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline"
                  >
                    Return to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </HelmetProvider>
    </motion.div>
  );
};

export default ForgotPassword;