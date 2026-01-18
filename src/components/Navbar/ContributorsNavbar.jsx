import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGithub, FaUsers, FaUserPlus, FaHome, FaTachometerAlt } from 'react-icons/fa';
import { BiArrowBack, BiMenu, BiX } from 'react-icons/bi';
import { MdDashboard } from 'react-icons/md';
import logo from '../../assets/images/logo.png';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import ProfileInfo from '../Cards/ProfileInfo';

const ContributorsNavbar = ({ userInfo, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isToken = localStorage.getItem("token");

  const navigationItems = [
    {
      name: 'Home',
      path: '/',
      icon: FaHome,
      description: 'Back to main site'
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: MdDashboard,
      description: 'Your travel stories',
      requiresAuth: true
    },
    {
      name: 'Contributors',
      path: '/contributors',
      icon: FaUsers,
      description: 'Meet our community'
    },
    {
      name: 'Contribute',
      path: '/contribute',
      icon: FaUserPlus,
      description: 'Join our team'
    }
  ];

  const isActivePage = (path) => location.pathname === path;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 group"
            >
              <img src={logo} alt="Travel Book" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Travel Book
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contributors Hub
                </p>
              </div>
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              if (item.requiresAuth && !isToken) return null;
              
              const isActive = isActivePage(item.path);
              return (
                <motion.button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={item.description}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* GitHub Link - Icon Only */}
            <motion.a
              href="https://github.com/Sahilll94/Travel-Book"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="View on GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </motion.a>

            <ThemeToggle />

            {/* Profile or Auth - Only show if NOT authenticated */}
            {isToken && userInfo ? (
              <div className="hidden md:block">
                <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors font-medium"
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => navigate('/signUp')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {mobileMenuOpen ? <BiX className="w-6 h-6" /> : <BiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-2">
              {navigationItems.map((item) => {
                if (item.requiresAuth && !isToken) return null;
                
                const isActive = isActivePage(item.path);
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
                    </div>
                  </button>
                );
              })}

              {/* Mobile GitHub Link */}
              <a
                href="https://github.com/Sahilll94/Travel-Book"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaGithub className="w-5 h-5" />
                <div>
                  <div className="font-medium">GitHub Repository</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">View source code</div>
                </div>
              </a>

              {/* Mobile Auth */}
              {isToken && userInfo ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors font-medium text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signUp');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg transition-colors font-medium text-left"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContributorsNavbar;
