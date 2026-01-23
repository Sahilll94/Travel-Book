
import logo from "../../assets/images/logo.png";

import { Globe } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { LuLinkedin, LuGithub } from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-0">
              <a href="/">
                <img className="w-20 h-20" src={logo} alt="" />
              </a>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              The Travel-Book was developed by{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                SAHIL
              </span>
              , a dedicated developer and accomplished leader. Connect with him
              through the social links provided below.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a
                href="https://sahilfolio.live/"
                title="Visit Sahil's Portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-110 hover:-translate-y-1 focus:bg-blue-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Globe className="w-4 h-4" />
              </a>

              <a
                href="https://x.com/Sa_hilll94"
                title="Visit my profile on X"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-110 hover:-translate-y-1 focus:bg-blue-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/in/sahilll94"
                title="Visit my profile on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-110 hover:-translate-y-1 focus:bg-blue-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <LuLinkedin className="w-4 h-4" />
              </a>

              <a
                href="https://github.com/Sahilll94"
                title="Visit my profile on GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-110 hover:-translate-y-1 focus:bg-blue-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <LuGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/signUp"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 group-hover:bg-blue-600 transition-colors duration-200"></span>
                  Create Account
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 group-hover:bg-blue-600 transition-colors duration-200"></span>
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 group-hover:bg-blue-600 transition-colors duration-200"></span>
                  Terms of Services
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 group-hover:bg-blue-600 transition-colors duration-200"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="lg:col-span-5">
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
              About Travel-Book
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover our innovative platform designed to streamline your
              travel experiences. From creating and sharing captivating travel
              stories to managing your favorite destinations, our user-friendly
              tools help you document every journey seamlessly. Stay connected
              and inspired, whether you're planning your next adventure or
              reminiscing past trips. Join our community and make your travel
              memories unforgettable.
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            © Copyright {new Date().getFullYear()}, All Rights Reserved by Travel-Book
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
