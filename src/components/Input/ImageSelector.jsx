import React, { useEffect, useRef, useState } from "react";
import { FaRegFileImage, FaImage } from "react-icons/fa";
import { MdDeleteOutline, MdFileUpload, MdEdit } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const ImageSelector = ({ image, setImage, handleDeleteImg }) => {
    const inputRef = useRef(null);
    const dropAreaRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const handleRemoveImage = () => {
        setImage(null);
        if (handleDeleteImg) handleDeleteImg();
    };

    // Handle drag and drop functionality
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const imageFile = files[0];
            if (imageFile.type.startsWith("image/")) {
                setImage(imageFile);
            }
        }
    };

    // Set up preview URL
    useEffect(() => {
        if (typeof image === 'string') {
            setPreviewUrl(image);
        } else if (image) {
            const url = URL.createObjectURL(image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [image]);

    return (
        <div className="w-full">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            <AnimatePresence>
                {!image ? (
                    <motion.div
                        ref={dropAreaRef}
                        initial={{ opacity: 0.9 }}
                        animate={{ 
                            opacity: 1,
                            borderColor: isDragging ? "#06b6d4" : "",
                            backgroundColor: isDragging ? "rgba(6, 182, 212, 0.05)" : ""
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`w-full min-h-[220px] flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed ${
                            isDragging 
                                ? "border-cyan-500 dark:border-cyan-400" 
                                : "border-slate-300 dark:border-gray-600"
                        } transition-all cursor-pointer relative p-8`}
                        onClick={onChooseFile}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <div className="w-16 h-16 flex items-center justify-center bg-cyan-50 dark:bg-cyan-900/30 rounded-full border border-cyan-100 dark:border-cyan-800">
                            <MdFileUpload className="text-3xl text-cyan-500 dark:text-cyan-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                                Drag & Drop your image here
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                or click to browse
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg border border-cyan-100 dark:border-cyan-800 inline-flex items-center gap-2 text-sm font-medium"
                            >
                                <FaImage className="text-sm" /> Select Image
                            </motion.button>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                            Supported formats: JPG, PNG, GIF, WEBP
                        </p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full relative"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <img 
                            src={previewUrl} 
                            alt="Selected memory"
                            loading="lazy"
                            className="w-full h-[500px] object-cover rounded-lg shadow-sm border border-slate-200 dark:border-gray-700"
                        />
                        
                        <AnimatePresence>
                            {isHovering && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center gap-4"
                                >
                                    <motion.div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white"
                                            onClick={onChooseFile}
                                        >
                                            <MdEdit className="text-2xl" />
                                        </motion.button>
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-12 h-12 flex items-center justify-center bg-red-400/30 hover:bg-red-400/50 rounded-full text-white"
                                            onClick={handleRemoveImage}
                                        >
                                            <MdDeleteOutline className="text-2xl" />
                                        </motion.button>
                                    </motion.div>
                                    <p className="text-white/80 text-sm">Change or remove image</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-sm border border-slate-100 dark:border-gray-700"
                            onClick={handleRemoveImage}
                        >
                            <MdDeleteOutline className="text-xl text-red-500" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageSelector;