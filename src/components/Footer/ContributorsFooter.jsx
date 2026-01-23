import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaCode, FaUsers, FaBook, FaEnvelope } from 'react-icons/fa';
import { BiCopyright, BiLink } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import logo from '../../assets/images/logo.png';

const ContributorsFooter = ({ contributorsCount = 0 }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [commitsCount, setCommitsCount] = useState('400+');
  const [storiesCount, setStoriesCount] = useState('200+');

  useEffect(() => {
    // Fetch commits count from GitHub
    const fetchCommitsCount = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/Sahilll94/Travel-Book/commits?per_page=1');
        const linkHeader = response.headers.get('link');
        if (linkHeader) {
          const matches = linkHeader.match(/&page=(\d+)>; rel="last"/);
          if (matches && matches[1]) {
            setCommitsCount(matches[1] + '+');
          }
        }
      } catch (error) {
        console.error('Error fetching GitHub commits:', error);
      }
    };

    // Fetch stories count from database
    const fetchStoriesCount = async () => {
      try {
        const response = await axiosInstance.get('/total-stories');
        if (response.data && response.data.totalStories) {
          setStoriesCount(response.data.totalStories + '+');
        }
      } catch (error) {
        console.error('Error fetching stories count:', error);
      }
    };

    fetchCommitsCount();
    fetchStoriesCount();
  }, []);

  const footerLinks = {
    project: [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Contributors', path: '/contributors' },
      { name: 'Apply to Contribute', path: '/contribute' }
    ],
    community: [
      { name: 'GitHub Repository', url: 'https://github.com/Sahilll94/Travel-Book' },
      { name: 'Issues & Bugs', url: 'https://github.com/Sahilll94/Travel-Book/issues' },
      { name: 'Feature Requests', url: 'https://github.com/Sahilll94/Travel-Book/discussions' },
      { name: 'Contributing Guide', url: 'https://github.com/Sahilll94/Travel-Book/blob/main/CONTRIBUTING.md' }
    ],
    resources: [
      { name: 'Documentation', url: 'https://github.com/Sahilll94/Travel-Book/blob/main/QUICKSTART.md' },
      { name: 'API Reference', url: 'https://travel-book-api-docs.hashnode.dev/travel-book-api-documentation' },
      { name: 'Code of Conduct', url: 'https://github.com/Sahilll94/Travel-Book/blob/main/CODE_OF_CONDUCT.md' },
      { name: 'License', url: 'https://github.com/Sahilll94/Travel-Book/blob/main/LICENSE' }
    ]
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/Sahilll94/Travel-Book',
      color: 'hover:text-gray-900 dark:hover:text-white'
    }
  ];

  const stats = [
    { icon: FaUsers, label: 'Contributors', value: contributorsCount.toString() },
    { icon: FaCode, label: 'Commits', value: commitsCount },
    { icon: FaBook, label: 'Stories', value: storiesCount }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Project Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <img 
                    src={logo} 
                    alt="Travel Book Logo" 
                    loading="lazy"
                    className="w-8 h-8 object-contain"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Travel Book</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  A platform for travelers to share their experiences, 
                  built by a passionate community of developers worldwide.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <stat.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stat.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Project Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Project</h4>
                <ul className="space-y-3">
                  {footerLinks.project.map((link, index) => (
                    <li key={link.name}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-sm flex items-center group"
                      >
                        <BiLink className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Community Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Community</h4>
                <ul className="space-y-3">
                  {footerLinks.community.map((link, index) => (
                    <li key={link.name}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-sm flex items-center group"
                      >
                        <BiLink className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Resources */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={link.name}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-sm flex items-center group"
                      >
                        <BiLink className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <BiCopyright className="w-4 h-4 mr-1" />
              <span>{currentYear} Travel Book. Open Source Project.</span>
              <FaHeart className="w-4 h-4 mx-2 text-red-500 animate-pulse" />
              <span>Built with love by the community</span>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              <span className="text-gray-600 dark:text-gray-400 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-200`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Attribution */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <FaUsers className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" />
                  <span>Want to contribute? Join our community of developers!</span>
                </div>
                <button
                  onClick={() => window.location.href = "https://github.com/Sahilll94/Travel-Book"}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition-colors font-medium"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default ContributorsFooter;
