import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaGithub, FaLinkedin, FaHeart, FaCode, 
  FaUsers, FaBook, FaGlobe, FaRocket 
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { BiCopyright, BiChevronRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/images/logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

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
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'License', url: 'https://github.com/Sahilll94/Travel-Book/blob/main/LICENSE' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Sahilll94/Travel-Book' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://www.linkedin.com/in/sahilll94' },
    { name: 'X', icon: FaXTwitter, url: 'https://x.com/Sa_hilll94' },
    { name: 'Portfolio', icon: FaGlobe, url: 'https://sahilfolio.live/' }
  ];

  return (
    <footer className="bg-white dark:bg-[#0b1120] border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">
                Travel <span className="text-cyan-500">Book</span>
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              Documenting the world, one story at a time. Join our open-source movement to preserve travel memories forever.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-500 hover:text-white transition-all shadow-sm"
                >
                  <social.icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Correctly Aligned Navigation Links */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              { title: 'Platform', links: footerLinks.project },
              { title: 'Community', links: footerLinks.community },
              { title: 'Resources', links: footerLinks.legal }
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name} className="flex items-center group">
                      <BiChevronRight className="w-4 h-4 text-cyan-500 -ml-5 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      <a
                        href={link.url || '#'}
                        onClick={(e) => { if(link.path) { e.preventDefault(); navigate(link.path); }}}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors truncate"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Contribute</h4>
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm mb-2">
                <FaRocket />
                <span>Join the Sprint</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Want to contribute code? Help us build the future of Travel Book.</p>
              <button 
                onClick={() => window.open('https://github.com/Sahilll94/Travel-Book', '_blank')}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-lg transition-colors shadow-md shadow-cyan-600/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tighter Spacing */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center">
            <BiCopyright className="mr-1" />
            <span>{currentYear} Travel Book. MIT Licensed.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <FaHeart className="text-red-500" />
            </motion.div>
            <span>by</span>
            <a href="https://github.com/Sahilll94" className="text-slate-900 dark:text-white hover:text-cyan-500 transition-colors">Sahilll94</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;