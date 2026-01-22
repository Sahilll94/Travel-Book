import React, { useState, useRef, useEffect } from 'react'
import logo from "../../src/assets/images/logo.png"
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './Input/SearchBar'
import ThemeToggle from './ThemeToggle/ThemeToggle'
import { motion } from 'framer-motion'
import { MdMenu, MdClose } from 'react-icons/md'

const Navbar = ({
    userInfo,
    searchQuery,    
    setSearchQuery,
    onSearchNote,
    handleClearSearch,
    onAdvancedSearch
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);
    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();
    
    const onLogout = () => {
        localStorage.clear();
        navigate("/login")
    };

    const handleSearch = () => {
        if(searchQuery)
        {
            onSearchNote(searchQuery);
            if (window.innerWidth < 768) {
                setMobileMenuOpen(false);
            }
        }
    };

    const onClearSearch = () => {
        handleClearSearch();
        setSearchQuery("");
    };

    const handleAdvancedSearch = (filters) => {
        if (onAdvancedSearch) {
            onAdvancedSearch(filters);
            if (window.innerWidth < 768) {
                setMobileMenuOpen(false);
            }
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
        <div className='bg-white dark:bg-gray-800 flex items-center justify-between px-4 sm:px-6 py-2 drop-shadow sticky top-0 z-30'>
            <motion.a 
                href="/"
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img src={logo} loading="eager" alt="Travel Book Logo" className='h-12 sm:h-16' />
            </motion.a>

            {isToken && (
                <>
                    {/* Desktop view with centered search */}
                    <div className="hidden md:flex flex-1 justify-center max-w-3xl mx-auto px-4">
                        <div className="w-full max-w-xl">
                            <SearchBar 
                                value={searchQuery}
                                onChange={({ target }) => {
                                    setSearchQuery(target.value);
                                }}
                                handleSearch={handleSearch}
                                onClearSearch={onClearSearch}
                                onAdvancedSearch={handleAdvancedSearch}
                            />
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                        <ThemeToggle />
                        <ProfileInfo userInfo={userInfo} onLogout={onLogout} /> 
                    </div>
                    
                    {/* Mobile hamburger */}
                    <button 
                        className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <MdClose size={24} className="text-gray-700 dark:text-white" /> : <MdMenu size={24} className="text-gray-700 dark:text-white" />}
                    </button>
                    
                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <motion.div 
                            ref={mobileMenuRef}
                            className="md:hidden absolute top-16 right-0 left-0 bg-white dark:bg-gray-800 shadow-lg z-50 p-4 flex flex-col gap-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <SearchBar 
                                value={searchQuery}
                                onChange={({ target }) => {
                                    setSearchQuery(target.value);
                                }}
                                handleSearch={handleSearch}
                                onClearSearch={onClearSearch}
                                onAdvancedSearch={handleAdvancedSearch}
                            />
                            <div className="flex items-center justify-between">
                                <ThemeToggle />
                                <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
                            </div>
                        </motion.div>
                    )}
                </>
            )}
            
            {!isToken && (
                <ThemeToggle />
            )}
        </div>
    )
}

export default Navbar
