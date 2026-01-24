import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import PasswordInput from "../../components/Input/PasswordInput";
import AuthService from "../../services/authService";
import { toast } from "sonner";
import { Helmet, HelmetProvider } from "react-helmet-async";
import logo from "../../assets/images/logo.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formTouched, setFormTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token and email from URL query parameters
    const params = new URLSearchParams(location.search);
    const resetToken = params.get("token");
    const userEmail = params.get("email");

    if (!resetToken || !userEmail) {
      setError("Invalid or missing reset information. Please request a new password reset link.");
      return;
    }

    setToken(resetToken);
    setEmail(userEmail);
  }, [location]);

  const validatePassword = (pass) => {
    return pass.length >= 8;
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formTouched.password) {
      if (!validatePassword(e.target.value)) {
        setError("Password must be at least 8 characters long");
      } else {
        setError(null);
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (formTouched.confirmPassword) {
      if (password !== e.target.value) {
        setError("Passwords do not match");
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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    setFormTouched({
      password: true,
      confirmPassword: true,
    });

    // Validate password
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await AuthService.resetPassword(email, token, password);

      if (data && !data.error) {
        setSuccess(true);
        toast.success("Password has been successfully reset!");
        // Navigate to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to reset password. Please try again or request a new reset link.");
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
          <title>Reset Password | Travel Book</title>
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
            <img
              src={logo}
              alt="Travel Book Logo"
              className="h-20 mx-auto hover:scale-105 transition-transform duration-300"
            />
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
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your password has been updated successfully. You will be redirected to the login page shortly.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300"
                onClick={() => navigate("/login")}
              >
                <span>Go to Login</span>
                <FaArrowRight />
              </motion.button>
            </motion.div>
          ) : (
            <>
              <h4 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
                Reset Your Password
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
                Please enter your new password below to securely reset your account password.
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

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaShieldAlt className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <PasswordInput
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => handleInputFocus("password")}
                    placeholder="New password"
                    className={`pl-10 ${formTouched.password && !validatePassword(password)
                        ? "border-red-400 dark:border-red-600 focus:ring-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:ring-cyan-500"
                      }`}
                  />
                  {formTouched.password && !validatePassword(password) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-500"
                    >
                      Password must be at least 8 characters long
                    </motion.p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onFocus={() => handleInputFocus("confirmPassword")}
                    placeholder="Confirm new password"
                    className={`pl-10 ${formTouched.confirmPassword && password !== confirmPassword
                        ? "border-red-400 dark:border-red-600 focus:ring-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:ring-cyan-500"
                      }`}
                  />
                  {formTouched.confirmPassword && password !== confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-500"
                    >
                      Passwords do not match
                    </motion.p>
                  )}
                </div>

                {/* Reset Password Button */}
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
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <FaArrowRight />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </HelmetProvider>
    </motion.div>
  );
};

export default ResetPassword;