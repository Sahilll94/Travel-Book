import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate, MdShare, MdLocationOn, MdCalendarToday, MdTitle, MdDescription, MdImage, MdEdit, MdCheck, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdDone, MdInfoOutline, MdSave, MdWarning, MdInfo } from 'react-icons/md';
import { FiCheckCircle } from 'react-icons/fi';
import DataSelector from '../../components/Input/DataSelector';
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import { toast } from 'sonner'; // Import toast but not Toaster
import { motion, AnimatePresence } from 'framer-motion';

import 'sonner/dist/styles.css';

import uploadImage from '../../utils/uploadImage';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [formCompleted, setFormCompleted] = useState({
        title: !!storyInfo?.title,
        image: !!storyInfo?.imageUrl,
        story: !!storyInfo?.story,
        location: !!(storyInfo?.visitedLocation && storyInfo?.visitedLocation.length > 0),
        date: !!storyInfo?.visitedDate
    });
    
    // New state for confirmation modals
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    const [showMobileNav, setShowMobileNav] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 100) {
            if (activeStep < 5) setActiveStep(activeStep + 1);
        }

        if (touchEnd - touchStart > 100) {
            if (activeStep > 1) setActiveStep(activeStep - 1);
        }
    };

    const toggleMobileNav = () => {
        setShowMobileNav(!showMobileNav);
    };


    const autoAdvanceEnabled = false;
    useEffect(() => {
        if (!autoAdvanceEnabled) return;
        const isMobile = window.innerWidth < 768;
        
        // Only auto-advance for new stories (type === "add"), not when editing
        if (isMobile && type === "add") {
            if (formCompleted.title && activeStep === 1) {
                setTimeout(() => setActiveStep(2), 800);
            } else if (formCompleted.date && activeStep === 2) {
                setTimeout(() => setActiveStep(3), 800);
            } else if (formCompleted.image && activeStep === 3) {
                setTimeout(() => setActiveStep(4), 800);
            } else if (formCompleted.story && activeStep === 4) {
                setTimeout(() => setActiveStep(5), 800);
            }
        }
    }, [formCompleted, activeStep, type]);

    useEffect(() => {
        setFormCompleted({
            title: !!title,
            image: !!storyImg,
            story: !!story,
            location: visitedLocation.length > 0,
            date: !!visitedDate
        });
    }, [title, storyImg, story, visitedLocation, visitedDate]);

    const completionPercentage = () => {
        const totalSteps = 5;
        const completedSteps = Object.values(formCompleted).filter(val => val).length;
        return Math.round((completedSteps / totalSteps) * 100);
    };

    const addNewTravelStory = async () => {
        setLoading(true);
        try {
            let imageUrl = "";
            if (storyImg) {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("Story Added Successfully!");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            toast.error(error.response?.data?.message || "Failed to add story");
        } finally {
            setLoading(false);
        }
    };

    const updateTravelStory = async () => {
        setLoading(true);
        const storyId = storyInfo._id;
        try {
            let imageUrl = storyInfo.imageUrl || "";
            let postData = { title, story, imageUrl, visitedLocation, visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf() };

            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";
                postData.imageUrl = imageUrl;
            }

            const response = await axiosInstance.put(`/edit-story/${storyId}`, postData);

            if (response.data && response.data.story) {
                toast.success("Story Updated Successfully!");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            toast.error(error.response?.data?.message || "Failed to update story");
        } finally {
            setLoading(false);
        }
    };

    // Modify the handleAddOrUpdateClick function to show confirmation dialog
    const handleAddOrUpdateClick = () => {
        if (!title) {
            setError("Please enter the title of your story!");
            toast.error("Please enter the title of your story!");
            return;
        }
        if (!story) {
            setError("Please enter the descriptive story.");
            toast.error("Please enter the descriptive story.");
            return;
        }

        setError("");

        // Show appropriate confirmation dialog based on operation type
        if (type === "edit") {
            setShowEditConfirmation(true);
        } else {
            setShowSaveConfirmation(true);
        }
    };

    // Function to proceed with update after confirmation
    const proceedWithUpdate = () => {
        setShowEditConfirmation(false);
        updateTravelStory();
    };

    // Function to proceed with adding after confirmation
    const proceedWithAdd = () => {
        setShowSaveConfirmation(false);
        addNewTravelStory();
    };

    const handleDeleteStoryImg = async () => {
        try {
            setLoading(true);
            const deleteImgRes = await axiosInstance.delete('/delete-image', { params: { imageUrl: storyInfo.imageUrl } });

            if (deleteImgRes.data) {
                const storyId = storyInfo._id;
                const postData = { title, story, visitedLocation, visitedDate: moment().valueOf(), imageUrl: "" };

                await axiosInstance.put(`/edit-story/${storyId}`, postData);
                setStoryImg(null);
                toast.success("Image deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete the image");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = (storyId) => {
        const shareUrl = `${window.location.origin}/story/${storyId}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast.success('Link copied to your clipboard! 🎉 Now you can share it with your friends! 😎✨');
            })
            .catch(() => {
                toast.error('Failed to copy the link. Please try again.');
            });
    };

    const getStepClass = (step) => {
        if (activeStep === step) {
            return 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm';
        }
        return 'border-slate-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-300';
    };

    return (
        <motion.div 
            className='relative bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/60 p-3 sm:p-6 transition-all duration-300 max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className='mb-4 flex flex-col sm:hidden'>
                <div className='flex justify-between items-center'>
                    <h5 className='text-xl font-bold text-slate-800 dark:text-white flex items-center'>
                        {type === "add" ? 
                            <><MdAdd className='text-cyan-500 mr-2' /> Create Memory</> : 
                            <><MdEdit className='text-cyan-500 mr-2' /> Edit Memory</>
                        }
                    </h5>
                    <div className='flex gap-2'>
                        <motion.button 
                            className='p-2 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-300' 
                            onClick={toggleMobileNav}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {showMobileNav ? <MdClose className='text-xl' /> : <MdEdit className='text-xl' />}
                        </motion.button>
                        <motion.button 
                            className='p-2 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-300' 
                            onClick={onClose}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <MdClose className='text-xl' />
                        </motion.button>
                    </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div 
                            key={step} 
                            className={`flex-1 ${step < activeStep ? 'bg-cyan-500' : step === activeStep ? 'bg-cyan-400' : 'bg-gray-200 dark:bg-gray-700'} 
                                        h-2 rounded-full mx-0.5 transition-all duration-300`}
                        />
                    ))}
                </div>
                
                <div className="mt-3 mb-1 text-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Step {activeStep} of 5: 
                        {activeStep === 1 && " Title"}
                        {activeStep === 2 && " Date"}
                        {activeStep === 3 && " Image"}
                        {activeStep === 4 && " Story"}
                        {activeStep === 5 && " Locations"}
                    </span>
                </div>
                
                <AnimatePresence>
                    {showMobileNav && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-50 flex items-end"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    setShowMobileNav(false);
                                }
                            }}
                        >
                            <motion.div
                                className="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 pb-8"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            >
                                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
                                
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
                                    Navigate Steps
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { step: 1, icon: <MdTitle />, title: "Title", completed: formCompleted.title },
                                        { step: 2, icon: <MdCalendarToday />, title: "Date", completed: formCompleted.date },
                                        { step: 3, icon: <MdImage />, title: "Image", completed: formCompleted.image },
                                        { step: 4, icon: <MdDescription />, title: "Story", completed: formCompleted.story },
                                        { step: 5, icon: <MdLocationOn />, title: "Locations", completed: formCompleted.location }
                                    ].map(item => (
                                        <motion.button
                                            key={item.step}
                                            className={`flex items-center p-3 rounded-lg ${
                                                activeStep === item.step 
                                                    ? 'bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800' 
                                                    : 'bg-white dark:bg-gray-700'
                                            } ${
                                                item.completed ? 'border-l-4 border-l-green-500' : ''
                                            }`}
                                            onClick={() => {
                                                setActiveStep(item.step);
                                                setShowMobileNav(false);
                                            }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                                item.completed ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-600'
                                            }`}>
                                                {item.completed ? <MdDone /> : item.icon}
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-white">{item.title}</span>
                                            {activeStep === item.step && (
                                                <div className="ml-auto bg-cyan-500 text-white p-1 rounded-full">
                                                    <MdCheck size={16} />
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                                
                                <div className="mt-6 flex justify-center">
                                    <motion.button
                                        className="bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg"
                                        onClick={() => setShowMobileNav(false)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className='mb-6 hidden sm:block'>
                <div className='flex justify-between items-center mb-4'>
                    <h5 className='text-2xl font-bold text-slate-800 dark:text-white flex items-center'>
                        {type === "add" ? 
                            <><MdAdd className='text-cyan-500 mr-2' /> Create New Memory</> : 
                            <><MdEdit className='text-cyan-500 mr-2' /> Update Your Memory</>
                        }
                    </h5>
                    <motion.button 
                        className='p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-all text-slate-500 dark:text-slate-300' 
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <MdClose className='text-xl' />
                    </motion.button>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-2.5 mb-3 overflow-hidden">
                    <motion.div 
                        className="bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-700 h-2.5 rounded-full"
                        style={{ width: `${completionPercentage()}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage()}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    ></motion.div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 flex justify-between items-center">
                    <div className="flex items-center">
                        <span>Progress: {completionPercentage()}% completed</span>
                        {completionPercentage() === 100 && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="ml-2 flex items-center text-green-500"
                            >
                                <MdCheck className="mr-1" /> Ready to submit
                            </motion.span>
                        )}
                    </div>
                    {error && <span className='text-red-500 dark:text-red-400'>{error}</span>}
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='md:col-span-1 hidden md:block'>
                    <div className='flex flex-col gap-3'>
                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(1)} ${formCompleted.title ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(1)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.title ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.title ? <FiCheckCircle /> : <MdTitle />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Title</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.title ? 'Completed' : 'Name your adventure'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(2)} ${formCompleted.date ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(2)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.date ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.date ? <FiCheckCircle /> : <MdCalendarToday />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Date</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.date ? 'Completed' : 'When did you visit?'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(3)} ${formCompleted.image ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(3)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.image ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.image ? <FiCheckCircle /> : <MdImage />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Image</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.image ? 'Completed' : 'Add a memorable photo'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(4)} ${formCompleted.story ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(4)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.story ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.story ? <FiCheckCircle /> : <MdDescription />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Story</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.story ? 'Completed' : 'Tell your tale'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(5)} ${formCompleted.location ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(5)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.location ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.location ? <FiCheckCircle /> : <MdLocationOn />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Locations</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.location ? 'Completed' : 'Where did you go?'}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-cyan-100 dark:border-gray-600">
                        <h3 className="font-medium text-gray-800 dark:text-white text-md mb-2">Travel Story Tips</h3>
                        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
                            <li className="flex items-start">
                                <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                                <span>Add specific details to make your story vivid</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                                <span>Include your favorite moments and discoveries</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                                <span>Photos bring your travel story to life</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='md:col-span-2 p-4 sm:p-5 border rounded-lg bg-white/50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 shadow-sm'>
                    <AnimatePresence mode="wait">
                        {activeStep === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdTitle className='mr-2 text-cyan-500' /> Title your memory
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <input
                                        type="text"
                                        className='text-2xl w-full text-slate-800 dark:text-white outline-none border-b-2 border-slate-200 dark:border-gray-600 focus:border-cyan-400 dark:focus:border-cyan-600 pb-2 transition-all bg-transparent'
                                        placeholder='A memorable day at...'
                                        value={title}
                                        onChange={({ target }) => setTitle(target.value)}
                                    />
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Give your travel memory a catchy title that captures the essence of your experience.</p>
                                    
                                    {formCompleted.title && window.innerWidth < 768 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800 flex items-center"
                                        >
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span className="text-green-700 dark:text-green-400 text-sm">Title completed! Swipe left or use the navigation to continue.</span>
                                        </motion.div>
                                    )}
                                    
                                    <div className="md:hidden mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                                        <span>Swipe left/right to navigate between steps</span>
                                    </div>
                                    
                                    <div className='mt-6 flex justify-between'>
                                        <div></div>
                                        <motion.button 
                                            className='bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm'
                                            onClick={() => setActiveStep(2)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Next <MdKeyboardArrowRight className="ml-1 text-xl" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeStep === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdCalendarToday className='mr-2 text-cyan-500' /> When did this happen?
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <DataSelector date={visitedDate} setDate={setVisitedDate} />
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Select the date when you visited this location.</p>
                                    
                                    {formCompleted.date && window.innerWidth < 768 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800 flex items-center"
                                        >
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span className="text-green-700 dark:text-green-400 text-sm">Date selected! Swipe left or use the navigation to continue.</span>
                                        </motion.div>
                                    )}
                                    
                                    <div className="md:hidden mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                                        <span>Swipe left/right to navigate between steps</span>
                                    </div>
                                    
                                    <div className='mt-6 flex justify-between'>
                                        <motion.button 
                                            className='border border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg transition-colors flex items-center'
                                            onClick={() => setActiveStep(1)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <MdKeyboardArrowLeft className="mr-1 text-xl" /> Previous
                                        </motion.button>
                                        <motion.button 
                                            className='bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm'
                                            onClick={() => setActiveStep(3)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Next <MdKeyboardArrowRight className="ml-1 text-xl" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeStep === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdImage className='mr-2 text-cyan-500' /> Add a photo
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Upload a photo that best captures your travel experience.</p>
                                    
                                    {formCompleted.image && window.innerWidth < 768 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800 flex items-center"
                                        >
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span className="text-green-700 dark:text-green-400 text-sm">Image added! Swipe left or use the navigation to continue.</span>
                                        </motion.div>
                                    )}
                                    
                                    <div className="md:hidden mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                                        <span>Swipe left/right to navigate between steps</span>
                                    </div>
                                    
                                    <div className='mt-6 flex justify-between'>
                                        <motion.button 
                                            className='border border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg transition-colors flex items-center'
                                            onClick={() => setActiveStep(2)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <MdKeyboardArrowLeft className="mr-1 text-xl" /> Previous
                                        </motion.button>
                                        <motion.button 
                                            className='bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm'
                                            onClick={() => setActiveStep(4)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Next <MdKeyboardArrowRight className="ml-1 text-xl" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeStep === 4 && (
                            <motion.div 
                                key="step4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdDescription className='mr-2 text-cyan-500' /> Tell your story
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <textarea
                                        className='w-full text-slate-800 dark:text-white outline-none border border-slate-200 dark:border-gray-600 rounded-lg p-3 focus:border-cyan-400 dark:focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/30 transition-all min-h-[150px] sm:min-h-[200px] bg-transparent text-base sm:text-sm'
                                        placeholder='Start writing your travel story here...'
                                        value={story}
                                        onChange={({ target }) => setStory(target.value)}
                                    ></textarea>
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Describe your experience, include interesting details and memorable moments.</p>
                                    
                                    {formCompleted.story && window.innerWidth < 768 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800 flex items-center"
                                        >
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span className="text-green-700 dark:text-green-400 text-sm">Story written! Swipe left or use the navigation to continue.</span>
                                        </motion.div>
                                    )}
                                    
                                    <div className="md:hidden mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                                        <span>Swipe left/right to navigate between steps</span>
                                    </div>
                                    
                                    <div className='mt-6 flex justify-between'>
                                        <motion.button 
                                            className='border border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg transition-colors flex items-center'
                                            onClick={() => setActiveStep(3)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <MdKeyboardArrowLeft className="mr-1 text-xl" /> Previous
                                        </motion.button>
                                        <motion.button 
                                            className='bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm'
                                            onClick={() => setActiveStep(5)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Next <MdKeyboardArrowRight className="ml-1 text-xl" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeStep === 5 && (
                            <motion.div 
                                key="step5"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdLocationOn className='mr-2 text-cyan-500' /> Add locations
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Add all the places you visited during this trip.</p>
                                    
                                    {formCompleted.location && window.innerWidth < 768 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800 flex items-center"
                                        >
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span className="text-green-700 dark:text-green-400 text-sm">Locations added! Ready to save your memory.</span>
                                        </motion.div>
                                    )}
                                    
                                    {completionPercentage() === 100 && window.innerWidth < 768 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-green-50 dark:from-cyan-900/20 dark:to-green-900/20 border border-cyan-100 dark:border-cyan-800 text-center"
                                        >
                                            <div className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center justify-center">
                                                <FiCheckCircle className="mr-2" />
                                                All steps completed! Ready to save.
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    <div className="md:hidden mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                                        <span>Swipe left/right to navigate between steps</span>
                                    </div>
                                    
                                    <div className='mt-6 flex justify-between'>
                                        <motion.button 
                                            className='border border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg transition-colors flex items-center'
                                            onClick={() => setActiveStep(4)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <MdKeyboardArrowLeft className="mr-1 text-xl" /> Previous
                                        </motion.button>
                                        <motion.button 
                                            className={`px-6 py-3 rounded-lg text-white flex items-center justify-center font-medium transition-all shadow-sm ${loading ? 'bg-cyan-400 dark:bg-cyan-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700 hover:from-cyan-600 hover:to-cyan-700 dark:hover:from-cyan-500 dark:hover:to-cyan-600'}`}
                                            onClick={handleAddOrUpdateClick}
                                            disabled={loading}
                                            whileHover={!loading ? { scale: 1.05 } : {}}
                                            whileTap={!loading ? { scale: 0.95 } : {}}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    {type === 'add' ? (
                                                        <>
                                                            <MdAdd className='mr-2 text-xl' /> 
                                                            Save Memory
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MdUpdate className='mr-2 text-xl' /> 
                                                            Update Memory
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Edit Confirmation Dialog */}
            <AnimatePresence>
                {showEditConfirmation && (
                    <motion.div 
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowEditConfirmation(false);
                            }
                        }}
                    >
                        <motion.div 
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl max-w-md aspect-square w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="p-6 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mr-4">
                                            <MdEdit className="text-2xl text-cyan-500 dark:text-cyan-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Save Changes?</h3>
                                    </div>
                                    
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            You're about to update "<span className="font-semibold text-gray-900 dark:text-white">{title}</span>". 
                                        </p>
                                        
                                        <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3 mb-3">
                                            <p className="text-cyan-700 dark:text-cyan-300 text-sm flex items-start">
                                                <MdInfo className="text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                                                Updated content:
                                            </p>
                                            <ul className="mt-2 ml-6 text-sm text-cyan-700 dark:text-cyan-300 space-y-1 list-disc">
                                                <li>Title and date</li>
                                                <li>Story content</li>
                                                {typeof storyImg === "object" && <li>Image</li>}
                                                <li>Locations</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-3 mt-auto">
                                    <motion.button 
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600"
                                        onClick={() => setShowEditConfirmation(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button 
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg flex items-center shadow-sm"
                                        onClick={proceedWithUpdate}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <MdUpdate className="mr-1" /> Save
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Confirmation Dialog */}
            <AnimatePresence>
                {showSaveConfirmation && (
                    <motion.div 
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowSaveConfirmation(false);
                            }
                        }}
                    >
                        <motion.div 
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl max-w-md aspect-square w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="p-6 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mr-4">
                                            <MdSave className="text-2xl text-cyan-500 dark:text-cyan-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Save Memory?</h3>
                                    </div>
                                    
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            You're about to save "<span className="font-semibold text-gray-900 dark:text-white">{title}</span>" to your travel collection.
                                        </p>
                                        
                                        <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3">
                                            <div className="flex items-start">
                                                <MdInfo className="text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <p className="text-cyan-700 dark:text-cyan-300 text-sm">
                                                    You can edit or delete this memory later from your dashboard.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-3 mt-auto">
                                    <motion.button 
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600"
                                        onClick={() => setShowSaveConfirmation(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button 
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg flex items-center shadow-sm"
                                        onClick={proceedWithAdd}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <MdAdd className="mr-1" /> Create
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default AddEditTravelStory;
