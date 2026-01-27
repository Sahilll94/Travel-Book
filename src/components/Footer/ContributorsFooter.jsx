import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, FaLinkedin, FaHeart, FaCode, 
  FaUsers, FaBook, FaGlobe, FaRocket 
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { BiCopyright, BiChevronRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import logo from '../../assets/images/logo.png';

const ContributorsFooter = ({ contributorsCount = 0 }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [commitsCount, setCommitsCount] = useState('400+');
  const [storiesCount, setStoriesCount] = useState('200+');

  useEffect(() => {
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
      { name: 'Apply Now', path: '/contribute' }
    ],
    community: [
      { name: 'Source Code', url: 'https://github.com/Sahilll94/Travel-Book' },
      { name: 'Report Issue', url: 'https://github.com/Sahilll94/Travel-Book/issues' },
      { name: 'Discussions', url: 'https://github.com/Sahilll94/Travel-Book/discussions' },
      { name: 'Contribution Guide', url: 'https://github.com/Sahilll94/Travel-Book/blob/main/CONTRIBUTING.md' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'License', url: 'https://github.com/Sahilll94/Travel-Book/blob/main/LICENSE' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Sahilll94/Travel-Book', color: '#333' },
    { name: 'LinkedIn', icon: FaLinkedin, url: '#', color: '#0077b5' },
    { name: 'X', icon: FaXTwitter, url: '#', color: '#000000' },
    { name: 'Website', icon: FaGlobe, url: '#', color: '#0891b2' }
  ];

  const stats = [
    { icon: FaUsers, label: 'Contributors', value: contributorsCount.toString() },
    { icon: FaCode, label: 'Commits', value: commitsCount },
    { icon: FaBook, label: 'Stories', value: storiesCount }
  ];

  return (
    <footer className="relative bg-slate-50 dark:bg-[#0b1120] border-t border-slate-200 dark:border-slate-800 transition-colors duration-500 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Identity & Stats */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"
                  />
                  <img src={logo} alt="Logo" className="relative w-10 h-10 object-contain bg-white rounded-full p-1" />
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                  Travel <span className="text-cyan-500">Book</span>
                </span>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Documenting the world, one story at a time. Join our open-source movement to preserve travel memories forever.
              </p>

              {/* Enhanced Stats Cards */}
              <div className="flex gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -5 }}
                    className="flex-1 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl shadow-sm text-center"
                  >
                    <stat.icon className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              { title: 'Platform', links: footerLinks.project, type: 'internal' },
              { title: 'Community', links: footerLinks.community, type: 'external' },
              { title: 'Resources', links: footerLinks.legal, type: 'mixed' }
            ].map((section, idx) => (
              <div key={section.title}>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => link.path ? navigate(link.path) : window.open(link.url, '_blank')}
                        className="group flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
                      >
                        <BiChevronRight className="mr-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Connect Section */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Connect With Us</h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-all duration-300"
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
              <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400 font-semibold mb-1">
                <FaRocket />
                <span className="text-sm">Join the Sprint</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Want to contribute code? Help us build the future of Travel Book.</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <BiCopyright className="mr-1" />
            <span>{currentYear} Travel Book. MIT Licensed.</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-500">Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FaHeart className="text-red-500" />
            </motion.div>
            <span className="text-slate-500">by</span>
            <a href="https://github.com/Sahilll94" className="text-slate-900 dark:text-white hover:text-cyan-500 underline decoration-cyan-500/30 underline-offset-4">Sahilll94</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContributorsFooter;