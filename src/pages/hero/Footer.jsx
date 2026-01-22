
import logo from "../../assets/images/logo.png";
import { Globe, MapPin, Phone, Shield, Heart, Send } from "lucide-react";
import { TbBrandTwitter, TbBrandGooglePlay, TbBrandApple } from "react-icons/tb";
import { LuLinkedin, LuGithub } from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { BiCopyright } from "react-icons/bi";
import { RiVisaLine, RiMastercardLine, RiPaypalLine } from "react-icons/ri";


const Footer = () => {
  const currentYear = new Date().getFullYear();


  const destinations = [
    { name: "Paris, France", flag: "🇫🇷", path: "/destinations/paris" },
    { name: "Tokyo, Japan", flag: "🇯🇵", path: "/destinations/tokyo" },
    { name: "New York, USA", flag: "🇺🇸", path: "/destinations/new-york" },
    { name: "London, UK", flag: "🇬🇧", path: "/destinations/london" },
    { name: "Dubai, UAE", flag: "🇦🇪", path: "/destinations/dubai" },
  ];

  const quickLinks = [
    { name: "About Us", path: "/#about" },
    { name: "Work With Us", path: "/#work-with-us" },
    { name: "Create Account", path: "/signup" },
    { name: "Login", path: "/login" },
  ];

  const support = [
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  const socialLinks = [
    { icon: Globe, url: "https://sahilfolio.live/", color: "hover:bg-cyan-600" },
    { icon: FaFacebookF, url: "https://facebook.com", color: "hover:bg-blue-600" },
    { icon: TbBrandTwitter, url: "https://x.com/Sa_hilll94", color: "hover:bg-black" },
    { icon: FaInstagram, url: "https://instagram.com", color: "hover:bg-pink-600" },
    { icon: LuLinkedin, url: "https://www.linkedin.com/in/sahilll94", color: "hover:bg-blue-700" },
    { icon: FaYoutube, url: "https://youtube.com", color: "hover:bg-red-600" },
    { icon: LuGithub, url: "https://github.com/Sahilll94", color: "hover:bg-gray-800" },
  ];

  return (
    <footer className="relative bg-white dark:bg-gray-900 pt-12 pb-6 overflow-hidden font-sans border-t border-gray-200 dark:border-gray-800">

      {/* Background Pattern - Subtle World Map */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 800 500">
          <path d="M100,200 Q150,150 200,200 T300,200 T400,200 T500,200 T600,200 T700,200" stroke="currentColor" strokeWidth="2" fill="none" />
          {/* Simplified abstract shapes representing continents */}
          <path d="M50,150 L100,100 L150,150 L100,200 Z" />
          <path d="M600,100 L650,50 L700,100 L650,150 Z" />
          <path d="M300,300 L350,250 L400,300 L350,350 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-8">

          {/* Brand & Contact Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-3">
              <a href="/" className="inline-flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img className="relative w-10 h-10 rounded-xl" src={logo} alt="Travel-Book Logo" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Travel-Book
                </span>
              </a>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your trusted travel companion. Discover, plan, and book unforgettable journeys around the world. Creating memories, one destination at a time.
              </p>
            </div>



            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:text-white hover:scale-110 hover:-translate-y-1 ${social.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Discover</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-cyan-500 transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Destinations */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Top Destinations</h4>
            <ul className="space-y-3">
              {destinations.map((dest, idx) => (
                <li key={idx}>
                  <a href={dest.path} className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-3 group">
                    <span className="text-lg leading-none grayscale group-hover:grayscale-0 transition-all">{dest.flag}</span>
                    <span className="text-sm">{dest.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Connect */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Connect With Us</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Join our global community of travelers and share your adventures with millions.
            </p>

            {/* Community Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-cyan-100 dark:border-cyan-900/30 transition-transform duration-300 hover:scale-105 hover:shadow-md cursor-default group">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform origin-left">10k+</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium mt-1">Travelers</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30 transition-transform duration-300 hover:scale-105 hover:shadow-md cursor-default group">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform origin-left">50k+</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium mt-1">Stories</div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="/contributors"
              className="relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <span className="relative z-10 font-semibold">Join Community</span>
              <Heart className="relative z-10 w-4 h-4 group-hover:scale-110 transition-transform group-hover:fill-white/20" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl"></div>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <BiCopyright /> {currentYear} Travel-Book
              </span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <div className="flex gap-4">
                {support.map((link, idx) => (
                  <a key={idx} href={link.path} className="hover:text-cyan-600 transition-colors">{link.name}</a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <a href="https://sahilfolio.live/" target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-600 hover:text-cyan-700">
                Sahil & Community
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;