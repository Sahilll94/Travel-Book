import React, { useState, useEffect } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import AuthService from "../../services/authService";
import { toast } from "sonner";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaShieldAlt, FaArrowRight } from "react-icons/fa";
// Import the logo image
import logo from "../../assets/images/logo.png";
// Import the OTP verification component
import OTPVerification from "../../components/Auth/OTPVerification";
// Import Social Login Buttons component
import SocialLoginButtons from "../../components/Auth/SocialLoginButtons";
// Import useAuth hook
import { useAuth } from "../../utils/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState({
    email: false,
    password: false
  });
  const [rememberMe, setRememberMe] = useState(false);
  // New states for OTP verification
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpMode, setOtpMode] = useState(false); // true: login with OTP, false: login with password

  const navigate = useNavigate();
  // Add the auth context
  const { login: authLogin } = useAuth();

  // Load saved email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    setFormTouched({
      email: true,
      password: !otpMode
    });

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Only validate password in password mode
    if (!otpMode && !password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Different API calls for different login modes
      if (otpMode) {
        // OTP login - send OTP
        const response = await AuthService.sendLoginOtp(email);

        if (response && !response.error) {
          setShowOtpVerification(true);
          toast.info("OTP sent to your email. Please verify to login.");
        }
      } else {
        // Regular password login
        const response = await AuthService.login(email, password);

        if (response && response.accessToken) {
          // Remember email if checkbox is checked
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          // Let authLogin handle the token storage and navigation
          // The login function will navigate to dashboard automatically
          authLogin(response.accessToken, response.user);

          // Show success message
          toast.success("Successfully logged in! Welcome to your Travel Book!");
          // Remove explicit navigation - let AuthContext handle it
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError(
          "An error occurred. Please wait a moment as the server responds."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (otp) => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.verifyLoginOtp(email, otp);

      if (response && response.accessToken) {
        // Remember email if checkbox is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Let authLogin handle the token storage and navigation
        authLogin(response.accessToken, response.user);

        // Show success message
        toast.success("Successfully logged in! Welcome to your Travel Book!");
        // Remove explicit navigation - let AuthContext handle it
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError(
          "OTP verification failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      await AuthService.resendOtp(email, false);
      toast.info("New OTP sent to your email");
    } catch (error) {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  // Toggle between password and OTP login modes
  const toggleLoginMode = () => {
    setOtpMode(!otpMode);
    setError(null);
  };

  // Validate form on input change
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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formTouched.password && !e.target.value) {
      setError("Please enter your password");
    } else if (formTouched.email && formTouched.password) {
      setError(null);
    }
  };

  const handleInputFocus = (field) => {
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  return (
    <div className=" flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">

      <HelmetProvider>
        <Helmet>
          <title>Login | Travel Book</title>
        </Helmet>
      </HelmetProvider>

      <div className="flex shadow-2xl rounded-xl overflow-hidden w-full max-w-5xl mx-auto my-8">

        {/* Image section with animation */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex md:w-1/2 min-h-[600px] items-end bg-login-bg-img bg-cover bg-center rounded-tl-xl rounded-bl-xl p-10 overflow-hidden"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h4 className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-tight">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-sm sm:text-base text-white leading-relaxed pr-7 mt-4">
              Record your travel experiences and memories in your personal
              travel journey.
            </p>
          </motion.div>
        </motion.div>

        {/* Form section with animation */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2 rounded-tr-xl rounded-br-xl p-5 sm:p-10 lg:p-16 bg-white dark:bg-gray-800 dark:shadow-gray-900/20"
        >
          {/* Show OTP verification or login form */}
          {showOtpVerification ? (
            <OTPVerification
              email={email}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              isSignup={false}
              error={otpError}
            />
          ) : (
            <>
              {/* Logo Section */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center mb-8"
              >
                <Link to="/" className="inline-block">
                  <img src={logo} alt="Travel Book Logo" className="h-24 mx-auto hover:scale-105 transition-transform duration-300" />
                </Link>
              </motion.div>

              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <h4 className="text-2xl font-semibold mb-7 text-center text-gray-800 dark:text-white">
                  Welcome back to your travel journal!
                </h4>

                {/* Email input with icon and validation */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    className={`pl-10 pr-4 py-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 border ${formTouched.email && !validateEmail(email)
                        ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:ring-cyan-500'
                      } focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white`}
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => handleInputFocus('email')}
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

                {/* Only show password input in password mode */}
                {!otpMode && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaShieldAlt className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <PasswordInput
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => handleInputFocus('password')}
                      className={`pl-10 ${formTouched.password && !password
                          ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                          : 'border-gray-200 dark:border-gray-600 focus:ring-cyan-500'
                        }`}
                    />
                    {formTouched.password && !password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-red-500"
                      >
                        Password is required
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Remember me checkbox and OTP toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm flex gap-3">
                    <button
                      type="button"
                      onClick={toggleLoginMode}
                      className="text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 text-sm hover:underline"
                    >
                      {otpMode ? "Login with password" : "Login with OTP"}
                    </button>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 text-sm hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>                {/* Error message with animation */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login button with animation */}
                <motion.button
                  type="submit"
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 dark:from-cyan-600 dark:to-cyan-700 dark:hover:from-cyan-700 dark:hover:to-cyan-800 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{otpMode ? "Sending OTP..." : "Signing in..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{otpMode ? "Send OTP" : "Sign In"}</span>
                      <FaArrowRight />
                    </>
                  )}
                </motion.button>

                {/* Social Login Buttons */}
                <motion.div
                  className="mt-6 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <SocialLoginButtons redirectPath="/dashboard" isSignUp={false} />
                </motion.div>

                {/* Create account button */}
                <motion.button
                  type="button"
                  className="w-full py-3 px-4 border border-cyan-500 dark:border-cyan-600 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-50 dark:hover:bg-cyan-900/20 bg-transparent dark:bg-gray-700 transition-colors duration-300 flex items-center justify-center gap-2"
                  onClick={() => navigate("/signUp")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create New Account
                </motion.button>

                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                  By signing in, you agree to our{" "}
                  <Link to="/terms" className="text-cyan-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-cyan-500 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </motion.form>
            </>
          )}
        </motion.div>
      </div>

    </div>

  );
};

export default Login;