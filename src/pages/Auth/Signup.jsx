import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import logo from "../../assets/images/logo.png";
import { toast } from "sonner"; 
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaShieldAlt, FaUser, FaArrowRight, FaCheck } from "react-icons/fa";
import OTPVerification from "../../components/Auth/OTPVerification";
import SocialLoginButtons from "../../components/Auth/SocialLoginButtons";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState({
    name: false,
    email: false,
    password: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const getPasswordFeedback = () => {
    if (passwordStrength === 0) return "Weak password";
    if (passwordStrength <= 2) return "Moderate password";
    if (passwordStrength <= 4) return "Strong password";
    return "Very strong password";
  };

  const getPasswordColor = () => {
    if (passwordStrength === 0) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-green-500";
    return "bg-green-600";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
    if (formTouched.password && !newPassword) {
      setError("Please enter a password");
    } else {
      setError(null);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (formTouched.name && !e.target.value.trim()) {
      setError("Please enter your name");
    } else {
      setError(null);
    }
  };

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
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormTouched({
      name: true,
      email: true,
      password: true
    });

    if (!name.trim()) {
      setError("Please enter your name to continue");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (passwordStrength < 2) {
      setError("Please choose a stronger password for your security");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/send-signup-otp", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && !response.data.error) {
        setShowOtpVerification(true);
        toast.info("OTP sent to your email. Please verify to complete registration.");
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

  const handleVerifyOtp = async (otp) => {
    setVerifyingOtp(true);
    setOtpError(null);

    try {
      const response = await axiosInstance.post("/verify-signup-otp", {
        email,
        otp
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        setShowSuccess(true);
        setTimeout(() => {
          toast.success("Account created successfully! Welcome to Travel Book.");
          navigate("/dashboard");
        }, 1500);
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
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axiosInstance.post("/resend-otp", {
        email,
        isSignup: true
      });
      toast.info("New OTP sent to your email");
    } catch (error) {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <HelmetProvider>
        <Helmet>
          <title>Create Account | Travel Book</title>
        </Helmet>
      </HelmetProvider>
      
      <div className="flex shadow-2xl rounded-xl overflow-hidden w-full max-w-5xl mx-auto my-8">        
        {/* image section */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex md:w-1/2 min-h-[600px] items-end bg-signup-bg-img bg-cover bg-center rounded-tl-xl rounded-bl-xl p-10 overflow-hidden"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h4 className="text-3xl sm:text-4xl lg:text-5xl text-black font-bold leading-tight">
              Join The <br /> Adventure
            </h4>
            <p className="text-sm sm:text-base text-black font-bold leading-relaxed pr-7 mt-4">
              Create an account to start documenting your travels and preserving your memories in your personal travel journal.
            </p>
          </motion.div>
        </motion.div>
 
       {/* signup form section */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2 rounded-tr-xl rounded-br-xl p-5 sm:p-10 lg:p-16 bg-white dark:bg-gray-800 dark:shadow-gray-900/20"
        
        >
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 z-50 rounded-xl"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                  className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 dark:text-green-400 mb-4"
                >
                  <FaCheck size={40} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Account Created!</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-xs">
                  Your account has been created successfully. Taking you to your dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {showOtpVerification ? (
            <OTPVerification 
              email={email}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              isSignup={true}
              error={otpError}
            />
          ) : (
            <>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center mb-8"
              >
                <Link to="/" className="inline-block">
                  <img src={logo} alt="Travel Book Logo" loading="eager" className="h-24 mx-auto hover:scale-105 transition-transform duration-300" />
                </Link>
              </motion.div>

              <motion.form 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                onSubmit={handleSignUp}
                className="space-y-5"
              >
                <h4 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
                Start Logging Your Adventures
                </h4>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full name"
                    className={`pl-10 pr-4 py-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 border ${
                      formTouched.name && !name.trim() 
                        ? 'border-red-400 dark:border-red-600 focus:ring-red-500' 
                        : 'border-gray-200 dark:border-gray-600 focus:ring-cyan-500'
                    } focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white`}
                    value={name}
                    onChange={handleNameChange}
                    onFocus={() => handleInputFocus('name')}
                  />
                  {formTouched.name && !name.trim() && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-500"
                    >
                      Please enter your name
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    className={`pl-10 pr-4 py-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 border ${
                      formTouched.email && !validateEmail(email) 
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

                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaShieldAlt className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <PasswordInput
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => handleInputFocus('password')}
                      className={`pl-10 ${
                        formTouched.password && !password 
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
                  
                  {password && (
                    <div className="space-y-1">
                      <div className="flex space-x-1 h-1">
                        {[...Array(5)].map((_, index) => (
                          <div 
                            key={index} 
                            className={`flex-1 rounded-full ${
                              index < passwordStrength 
                                ? getPasswordColor() 
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <p className={`text-xs ${
                        passwordStrength <= 1 
                          ? 'text-red-500' 
                          : passwordStrength <= 3 
                            ? 'text-yellow-500' 
                            : 'text-green-500'
                      }`}>
                        {getPasswordFeedback()}
                      </p>
                    </div>
                  )}
                </div>

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

                <motion.button 
                  type="submit" 
                  className="w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
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
                  <SocialLoginButtons redirectPath="/dashboard" isSignUp={true} />
                </motion.div>

                <motion.button
                  type="button"
                  className="w-full py-3 px-4 border border-cyan-500 dark:border-cyan-600 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors duration-300 flex items-center justify-center gap-2"
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In to Existing Account
                </motion.button>

                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                  By creating an account, you agree to our{" "}
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

export default Signup;