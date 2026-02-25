import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion } from 'framer-motion';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import logo from "../../assets/images/logo.png";
import Footer from "../hero/Footer"

const PrivacyPolicy = () => {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Helmet>
          <title>Privacy Policy | Travel Book</title>
        </Helmet>
        
        {/*Original Navbar */}
        <header className="py-4 md:py-6">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <Link
                                to="hero"
                                smooth={true}
                                duration={500}
                                offset={-50} // Adjust the scroll position a little
                                className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2"
                            >
                                {/* Replaced nested <a> with direct image to prevent nesting error */}
                                <img
                                    className="w-auto h-12 cursor-pointer"
                                    src={logo}
                                    alt="logo"
                                    loading="eager"
                                    onClick={() => navigate("/")}
                                />
                            </Link>
                        </div>

                        {/* Navbar items - Desktop */}
                        <div className="hidden lg:flex lg:ml-10 xl:ml-16 lg:items-center lg:justify-center lg:space-x-8 xl:space-x-16">
                            <Link
                                to="about"
                                smooth={true}
                                duration={500}
                                offset={-50}
                                className="cursor-pointer text-base font-medium text-gray-900 dark:text-gray-100 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2"
                            >
                                About Travel-Book
                            </Link>

                            <Link
                                to="how-it-works"
                                smooth={true}
                                duration={500}
                                offset={-50}
                                className="cursor-pointer text-base font-medium text-gray-900 dark:text-gray-100 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2"
                            >
                                How does it work?
                            </Link>

                            <Link
                                to="services"
                                smooth={true}
                                duration={500}
                                offset={-50}
                                className="cursor-pointer text-base font-medium text-gray-900 dark:text-gray-100 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2"
                            >
                                Our Services
                            </Link>

                            <a
                                href="/contributors"
                                className="text-base font-medium text-gray-900 dark:text-gray-100 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2"
                            >
                                Contributors
                            </a>
                        </div>

                        <div className="flex items-center">
                            <ThemeToggle /> {/* Added ThemeToggle component */}
                            
                            {/* Mobile Contributors Icon */}
                            <a
                                href="/contributors"
                                className="lg:hidden p-2 rounded-lg text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-3"
                                aria-label="View Contributors"
                            >
                                <MdGroup size={24} />
                            </a>
                           <div className="relative group ml-3">
                        <a
                            href="https://stats.uptimerobot.com/4klrGTjcP6"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Check Service Status"
                            className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                        >
                            <AiOutlineCloudServer className="w-8 h-8" />
                        </a>

                        {/* Tooltip below the icon, no background */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                           Server Status
                            </div>
                        </div>

                           {/* API Docs Icon */}
                            <div className="relative group ml-3">
                            <a
                                href="http://docs.travelbook.sahilfolio.live/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                            >
                                <i className="bi bi-journal-code"></i>
                            </a>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                           API Docs
                            </div>

                            </div>

                            {/* Medium Blog Icon */}
                            <div className="relative group ml-3">
                            <a
                                href="http://medium.travelbook.sahilfolio.live/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                            >
                                <i className="bi bi-journal-richtext"></i>
                            </a>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Blog
                            </div>

                            </div>

                          {/* GitHub Icon with Tooltip */}
                            <div className="relative group ml-3">
                            <a
                                href="https://github.com/Sahilll94/Travel-Book"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                            >
                                <i className="bi bi-github"></i>
                            </a>
                           <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            GitHub
                            </div>

                            </div>

                        </div>
                    </div>
                </div>
            </header>>
        
        {/* Main Content */}
        <motion.div 
          className="container mx-auto px-4 py-12 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Last Updated: May 1, 2025</p>
            
            <div className="space-y-8 text-gray-600 dark:text-gray-300">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">1. Introduction</h2>
                <p className="mb-3">
                  Welcome to Travel Book. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you how we look after your personal data when you visit our website and 
                  tell you about your privacy rights and how the law protects you.
                </p>
                <p>
                  This privacy policy applies to all users of Travel Book, including those who register to use our services, 
                  contribute content, or simply view our website.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2. Information We Collect</h2>
                <p className="mb-3">We collect several types of information from and about users of our website, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal identifiers, such as name and email address when you register for an account</li>
                  <li>Profile information that you provide for your user profile</li>
                  <li>Content you post, upload, or otherwise contribute to the platform</li>
                  <li>Usage data and analytics about how you interact with our service</li>
                  <li>Location data, when you share travel stories with location information</li>
                  <li>Device and connection information, including IP address, browser type, and operating system</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">3. How We Use Your Information</h2>
                <p className="mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Create and maintain your account</li>
                  <li>Process and fulfill your requests</li>
                  <li>Send you technical notices, updates, security alerts, and support messages</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                  <li>Personalize your experience by providing content tailored to your interests</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">4. Sharing Your Information</h2>
                <p className="mb-3">
                  We do not sell your personal information. However, we may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With service providers who perform services on our behalf</li>
                  <li>To comply with legal obligations or enforce our terms of service</li>
                  <li>To protect the rights, property, or safety of Travel Book, our users, or others</li>
                  <li>With your consent or at your direction</li>
                  <li>As part of a merger, acquisition, or other business transfer</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">5. Your Rights and Choices</h2>
                <p className="mb-3">Depending on your location, you may have certain rights regarding your personal information, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access to your personal data</li>
                  <li>Correction of inaccurate data</li>
                  <li>Deletion of your data</li>
                  <li>Restriction or objection to certain processing activities</li>
                  <li>Data portability</li>
                  <li>Withdrawal of consent</li>
                </ul>
                <p className="mt-3">
                  You can exercise many of these rights through your account settings. For other requests, please contact us using the information provided below.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">6. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against 
                  unauthorized access, accidental loss, or destruction. However, no internet transmission is ever completely secure, 
                  and we cannot guarantee the security of information transmitted through our platform.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">7. Children's Privacy</h2>
                <p>
                  Our services are not intended for children under 13 years of age, and we do not knowingly collect personal 
                  information from children under 13. If we learn we have collected personal information from a child under 13, 
                  we will delete that information.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">8. Changes to This Privacy Policy</h2>
                <p>
                  We may update this privacy policy from time to time to reflect changes in our practices or for other operational, 
                  legal, or regulatory reasons. We will notify you of any material changes through a notice on our website or by email.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">9. Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                  <br />
                  <a href="mailto:contact@sahilfolio.live" className="text-cyan-500 hover:underline">contact@sahilfolio.live</a>
                </p>
              </section>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link to="/" className="text-cyan-500 hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
        
        {/* Original Footer */}
         <section id="footer" className="bg-white dark:bg-gray-900">
                <Footer />
            </section>
      </div>
    </HelmetProvider>
  );
};

export default PrivacyPolicy;
