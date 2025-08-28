import React, { useEffect } from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";
import heroimg from "../../assets/images/heroimg.png";
import HowItWorks from "./HowItWorks";
import Stats from "./Stats";
import About from "./About";
import Footer from "./Footer";
import { AiOutlineCloudServer } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
 import { Typewriter } from "react-simple-typewriter";

const Hero = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Function to handle navigation to dashboard
    const goToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
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
                           <div className="relative group ml-6">
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
                            <div className="relative group ml-6">
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
                            <div className="relative group ml-6">
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
                            <div className="relative group ml-6">
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
            </header>

           

<section id="hero" className="pt-12 pb-12 sm:pb-16 lg:pt-8">
  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
      <div>
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj">
            <Typewriter
              words={[
                "Share Your Journey Today with TravelBook",
                "Where Adventures are Preserved!",
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:mt-6 font-inter">
            Record your travels with TravelBook: where each place, image, and story is preserved forever.
          </p>

          {/* Buttons and stats here */}
        </div>
      </div>

      <div>
        <img
          className="w-4/4 mx-auto no-drag"
          src={heroimg}
          alt="Preview of the Travel-Book"
          draggable="false"
        />
      </div>
    </div>
  </div>
</section>


            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">Hey Travellers!</span>
            </span>

            <section id="about">
                <About />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">How is it going?</span>
            </span>

            <section id="how-it-works">
                <HowItWorks />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">How have you been?</span>
            </span>

          <section id="services" className="py-16 bg-gray-50 dark:bg-gray-900">
  <div className="container px-4 mx-auto sm:px-6 lg:px-8">
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Our Services</h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        TravelBook offers a range of services to make documenting your travels easy and enjoyable:
      </p>
    </div>

    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      {/* Card 1 */}
      <article className="group relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-transform transform hover:scale-105 hover:shadow-2xl">
        <img
          src="https://images.pexels.com/photos/2108813/pexels-photo-2108813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Travel Logging"
          className="w-full h-72 object-cover brightness-90 group-hover:brightness-75 transition-all duration-500"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">📖 Travel Logging</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Record each step of your journey with rich media and detailed entries.
          </p>
        </div>
      </article>

      {/* Card 2 */}
      <article className="group relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-transform transform hover:scale-105 hover:shadow-2xl">
        <img
          src="https://images.pexels.com/photos/1194233/pexels-photo-1194233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Travel Sharing"
          className="w-full h-72 object-cover brightness-90 group-hover:brightness-75 transition-all duration-500"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">📤 Travel Sharing</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Share your journeys with friends and family instantly with TravelBook.
          </p>
        </div>
      </article>

      {/* Card 3 */}
      <article className="group relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-transform transform hover:scale-105 hover:shadow-2xl">
        <img
          src="https://images.pexels.com/photos/1255062/pexels-photo-1255062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Travel Collaboration"
          className="w-full h-72 object-cover brightness-90 group-hover:brightness-75 transition-all duration-500"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">🤝 Travel Collaboration</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Collaborate on travel logs with fellow travelers to share your experiences.
          </p>
        </div>
      </article>

    </div>
  </div>
</section>


            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">
                    Oh, So do you like the design?
                </span>
            </span>

            <section id="stats">
                <Stats />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">
                    Sign in to save your memories!
                </span>
            </span>

            <section id="footer">
                <Footer />
            </section>
        </div>
    );
};

export default Hero;
