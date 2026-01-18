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
import { MdGroup } from "react-icons/md";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

const Hero = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Function to handle navigation to dashboard
    const goToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
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
            </header>

            <section id="hero" className="pt-12 pb-12 sm:pb-16 lg:pt-8">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
                        <div>
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj">
                                    Share Your Journey Today with <b>TravelBook</b>, Where
                                    Adventures are preserved!
                                </h1>
                                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:mt-6 font-inter">
                                    Record your travels with TravelBook: where each place, image,
                                    and story is preserved forever.
                                </p>

                                <div className="mt-6 sm:mt-6">
                                    <div className="flex flex-col sm:flex-row sm:relative items-center justify-center gap-3 sm:gap-0 sm:h-14">
                                        {!loading && isAuthenticated ? (
                                            <div className="w-full sm:w-auto sm:flex sm:items-center">
                                                <motion.button
                                                    onClick={goToDashboard}
                                                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3.5 text-lg font-bold 
                                                    bg-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-600 dark:text-white
                                                    border-2 border-cyan-500 hover:border-transparent
                                                    rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
                                                    font-pj transition-all duration-300"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 10,
                                                    }}
                                                >
                                                    <motion.div
                                                        className="flex items-center"
                                                        initial={{
                                                            gap: "0.5rem",
                                                        }}
                                                        whileHover={{
                                                            gap: "0.75rem",
                                                        }}
                                                    >
                                                        <i className="bi bi-speedometer2 text-xl"></i>
                                                        <span>
                                                            Go to Your Dashboard
                                                        </span>
                                                        <FiArrowRight className="ml-1" />
                                                    </motion.div>
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-full sm:w-auto sm:absolute sm:inset-y-0 sm:left-0 sm:flex sm:items-center sm:pl-2 z-20">
                                                    <a
                                                        href="/signUp"
                                                        className="w-full sm:w-auto inline-flex justify-center px-6 py-3 text-lg font-bold text-white transition-all duration-200 
             bg-gray-900 rounded-lg focus:outline-none focus:bg-gray-600 font-pj hover:bg-gray-600
             dark:bg-cyan-500 dark:hover:bg-cyan-800 dark:focus:bg-cyan-500"
                                                    >
                                                        Create Free Account
                                                    </a>
                                                </div>

                                                <div className="sm:absolute sm:inset-y-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 flex items-center text-gray-600 dark:text-gray-300 font-inter sm:mt-0 z-20">
                                                    <span className="mx-2">OR</span>
                                                </div>

                                                <div className="w-full sm:w-auto sm:absolute sm:inset-y-0 sm:right-0 sm:flex sm:items-center sm:pr-36 z-20">
                                                    <a
                                                        href="/login"
                                                        className="w-full sm:w-auto inline-flex justify-center px-6 py-3 text-lg font-bold text-white transition-all duration-200 
             bg-gray-900 rounded-lg focus:outline-none focus:bg-gray-600 font-pj hover:bg-gray-600
             dark:bg-cyan-500 dark:hover:bg-cyan-800 dark:focus:bg-cyan-500"
                                                    >
                                                        Log In
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center mt-16 space-x-6 lg:justify-start sm:space-x-8">
                                <div className="flex items-center">
                                    <p className="text-3xl font-medium text-gray-900 dark:text-gray-100 sm:text-4xl font-pj">
                                        100
                                    </p>
                                    <p className="ml-3 text-sm text-gray-900 dark:text-gray-100 font-pj">
                                        Memories
                                        <br /> Delivered
                                    </p>
                                </div>

                                <div className="hidden sm:block">
                                    <svg
                                        className="text-gray-400 dark:text-gray-600"
                                        width="16"
                                        height="39"
                                        viewBox="0 0 16 39"
                                        fill="none"
                                        stroke="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <line
                                            x1="0.72265"
                                            y1="10.584"
                                            x2="15.7226"
                                            y2="0.583975"
                                        ></line>
                                        <line
                                            x1="0.72265"
                                            y1="17.584"
                                            x2="15.7226"
                                            y2="7.58398"
                                        ></line>
                                        <line
                                            x1="0.72265"
                                            y1="24.584"
                                            x2="15.7226"
                                            y2="14.584"
                                        ></line>
                                        <line
                                            x1="0.72265"
                                            y1="31.584"
                                            x2="15.7226"
                                            y2="21.584"
                                        ></line>
                                        <line
                                            x1="0.72265"
                                            y1="38.584"
                                            x2="15.7226"
                                            y2="28.584"
                                        ></line>
                                    </svg>
                                </div>

                                <div className="flex items-center">
                                    <p className="text-3xl font-medium text-gray-900 dark:text-gray-100 sm:text-4xl font-pj">
                                        120+
                                    </p>
                                    <p className="ml-3 text-sm text-gray-900 dark:text-gray-100 font-pj">
                                        Happy
                                        <br /> Traveller
                                    </p>
                                </div>
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

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">Welcome to Your Adventure!</span>
            </span>

            <section id="about" className="bg-white dark:bg-gray-900">
                <About />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">Here's How It Works</span>
            </span>

            <section id="how-it-works" className="bg-white dark:bg-gray-900">
                <HowItWorks />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">Why TravelBook?</span>
            </span>

            <section id="services" className="bg-white dark:bg-gray-900">
                <div className="py-12">
                    <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Our Services</h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                TravelBook offers a range of services to make documenting your
                                travels easy and enjoyable:
                            </p>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
                                <img
                                    alt="Travel Logging"
                                    src="https://images.pexels.com/photos/2108813/pexels-photo-2108813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Travel Logging
                                    </h3>
                                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                                        Record each step of your journey with rich media and
                                        detailed entries.
                                    </p>
                                </div>
                            </article>
                            <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
                                <img
                                    alt="Travel Sharing"
                                    src="https://images.pexels.com/photos/1194233/pexels-photo-1194233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Travel Sharing
                                    </h3>
                                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                                        Share your journeys with friends and family instantly with
                                        TravelBook.
                                    </p>
                                </div>
                            </article>
                            <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
                                <img
                                    alt="Travel Collaboration"
                                    src="https://images.pexels.com/photos/1255062/pexels-photo-1255062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Travel Collaboration
                                    </h3>
                                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                                        Collaborate on travel logs with fellow travelers to share
                                        your experiences.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">
                    See Our Community in Action
                </span>
            </span>

            <section id="stats" className="bg-white dark:bg-gray-900">
                <Stats />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-gray-900 px-6">
                    Ready to Start Your Journey?
                </span>
            </span>

            <section id="footer" className="bg-white dark:bg-gray-900">
                <Footer />
            </section>
        </div>
    );
};

export default Hero;
