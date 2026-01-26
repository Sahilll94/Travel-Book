import moment from 'moment/moment';
import React, { useState } from 'react'
import {FaHeart, FaRegCalendarAlt} from "react-icons/fa";
import {GrMapLocation} from "react-icons/gr"
import { MdOutlineLocationOn, MdShare, MdPersonPin } from "react-icons/md"
import { motion, AnimatePresence } from 'framer-motion';

const TravelStoryCard = ({
    imgUrl,
    title,
    date,
    story,  
    visitedLocation,
    isFavourite,
    showOnProfile,
    onFavouriteClick,
    onProfileToggleClick,
    onClick,
    onShareClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasLocation = visitedLocation && visitedLocation.length > 0;

  return (
    <motion.div 
      className='border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-gray-900/60 transition-all duration-300 relative cursor-pointer h-full flex flex-col'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
        <div className="relative">
            <motion.div 
                className="w-full h-48 sm:h-56 overflow-hidden"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
            >
                <img 
                    src={imgUrl} 
                    alt={`Travel story image: ${title}`}
                    className='w-full h-full object-cover transition-transform duration-300' 
                    onClick={onClick} 
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Travel+Memory';
                    }}
                />
            </motion.div>

            <motion.button 
                className='w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-full border border-white/30 absolute top-3 right-3 z-10 shadow-md' 
                onClick={(e) => {
                    e.stopPropagation();
                    onFavouriteClick();
                }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                whileTap={{ scale: 0.9 }}
                aria-label={isFavourite ? "Remove from favorites" : "Add to favorites"}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isFavourite ? 'favorite' : 'notFavorite'}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FaHeart className={`text-lg ${isFavourite ? "text-red-500" : "text-gray-400"}`}/>
                    </motion.div>
                </AnimatePresence>
            </motion.button>

            {/* Profile showcase toggle button */}
            {onProfileToggleClick && (
                <motion.button 
                    className='w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-full border border-white/30 absolute top-16 right-3 z-10 shadow-md' 
                    onClick={(e) => {
                        e.stopPropagation();
                        onProfileToggleClick();
                    }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={showOnProfile ? "Remove from public profile" : "Add to public profile"}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={showOnProfile ? 'profileShow' : 'profileHide'}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MdPersonPin className={`text-xl ${showOnProfile ? "text-green-500" : "text-gray-400"}`}/>
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
            )}

            {/* Share button */}
            {onShareClick && (
                <motion.button 
                    className='w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-full border border-white/30 absolute top-3 left-3 z-10 shadow-md' 
                    onClick={(e) => {
                        e.stopPropagation();
                        onShareClick();
                    }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Share this story"
                >
                    <MdShare className="text-lg text-gray-600 dark:text-gray-800" />
                </motion.button>
            )}

            {date && (
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent py-1.5 px-3 w-full transform translate-y-0">
                    <div className="flex items-center text-white text-xs gap-1 opacity-80">
                        <FaRegCalendarAlt className="text-xs" />
                        <span>{moment(date).format("Do MMM YYYY")}</span>
                    </div>
                </div>
            )}
        </div>

        <div className='p-4 dark:text-white flex-grow flex flex-col' onClick={onClick}>
            <div className='flex items-center gap-3 mb-2'>
                <div className='flex-1'>
                    <h3 className='text-base font-semibold line-clamp-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors'>{title}</h3>
                </div>
            </div>

            <p className='text-sm text-slate-600 dark:text-slate-300 mt-1 mb-3 line-clamp-2 flex-grow'>
                {story || "No description provided"}
            </p>

            <div className='flex gap-2 mt-auto'>
                {hasLocation ? (
                    <div className='inline-flex items-center gap-2 text-xs bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 rounded-full px-3 py-1.5'>
                        <MdOutlineLocationOn className='text-sm'/>
                        <span className="truncate max-w-[200px]">
                            {visitedLocation.join(', ')}
                        </span>
                    </div>
                ) : (
                    <div className='inline-flex items-center gap-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full px-3 py-1.5'>
                        <MdOutlineLocationOn className='text-sm'/>
                        <span>No location specified</span>
                    </div>
                )}
                
                {showOnProfile && (
                    <div className='inline-flex items-center gap-2 text-xs bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full px-3 py-1.5'>
                        <MdPersonPin className='text-sm'/>
                        <span>Public</span>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
  )
}

export default TravelStoryCard