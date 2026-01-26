import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast, Toaster } from 'sonner';
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaMapMarkerAlt, FaCalendarAlt, FaDownload, FaShare, FaArrowLeft, FaTimes } from "react-icons/fa";
import LocationMap from "../../components/Cards/LocationMap";
import logo from "../../assets/images/logo.png";
import StoryService from "../../services/storyService";

const StoryDetails = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInstagramPreview, setShowInstagramPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const instagramStoryRef = useRef();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const data = await StoryService.getPublicStoryById(id);

        if (!data) {
          throw new Error("Unable to fetch story details");
        }

        setStory(data);
        toast.success("Story loaded successfully");
      } catch (error) {
        console.error("Error fetching story:", error);
        setError("We couldn't load this travel story. Please try again later.");
        toast.error("Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShowInstagramPreview = () => {
    setShowInstagramPreview(true);
  };

  const downloadForInstagram = async () => {
    try {
      setIsDownloading(true);

      if (instagramStoryRef.current) {
        // Ensure all images are loaded
        const images = instagramStoryRef.current.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));

        const canvas = await html2canvas(instagramStoryRef.current, {
          allowTaint: true,
          useCORS: true,
          width: 1080,
          height: 1920,
          scale: 2,
          logging: false,
          backgroundColor: null
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${story.title}-instagram-story.png`;
        link.click();
        toast.success("Instagram Story image downloaded!");
        setShowInstagramPreview(false);
      }
    } catch (error) {
      console.error("Error generating Instagram Story image:", error);
      toast.error("Failed to generate Instagram Story image");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: "Check out this travel story!",
        url: window.location.href,
      })
        .then(() => toast.success("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-3xl text-red-500 mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">{error}</h1>
        <Link to="/" className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-3xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">Story not found</h1>
        <Link to="/" className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          Discover Other Stories
        </Link>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Toaster position="top-center" />

      {/* Meta tags for sharing */}
      <Helmet>
        <title>{story.title} | Travel Book</title>
        <meta property="og:title" content={story.title} />
        <meta property="og:image" content={story.imageUrl} />
        <meta property="og:description" content="A travel story has been shared with you" />
        <meta property="og:url" content={`${window.location.origin}/story/${id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={story.title} />
        <meta name="twitter:description" content="A travel story has been shared with you" />
        <meta name="twitter:image" content={story.imageUrl} />
      </Helmet>

      {/* Instagram Story Preview Modal */}
      <AnimatePresence>
        {showInstagramPreview && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium dark:text-white">Just take a quick screenshot and post it to your story!</h3>
                <button
                  onClick={() => setShowInstagramPreview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto">
                {/* Instagram Story Template */}
                <div
                  ref={instagramStoryRef}
                  className="w-[270px] h-[480px] mx-auto relative overflow-hidden rounded-xl"
                  style={{
                    background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
                  }}
                >
                  <div className="w-full h-full p-4 flex flex-col">
                    {/* Logo area */}
                    <div className="flex justify-center mb-2">
                      <img src={logo} alt="Travel Book Logo" className="h-10" />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 flex flex-col">
                      <h2 className="text-lg font-bold text-white mb-1 line-clamp-1">{story.title}</h2>
                      <p className="text-xs text-white opacity-90 mb-2">{formatDate(story.visitedDate)}</p>

                      <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden">
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-xs text-white leading-tight mb-2 line-clamp-3">
                        {story.story}
                      </p>

                      <div className="mt-auto">
                        <p className="text-xs font-medium text-white opacity-80 mb-0.5">Visited:</p>
                        <p className="text-xs text-white truncate">
                          {story.visitedLocation.join(" • ")}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-2 flex justify-center">
                      <p className="text-xs text-white text-center">
                        Create your travel story at travelbook.sahilfolio.live
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t dark:border-gray-700 flex gap-2">
                <button
                  onClick={() => setShowInstagramPreview(false)}
                  className="flex-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={downloadForInstagram}
                  disabled={isDownloading}
                  className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-70"
                >
                  {isDownloading ? 'Creating...' : 'Download Image'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full image modal */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullImage(false)}
          >
            <motion.button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FaTimes size={24} />
            </motion.button>
            <motion.img
              src={story.imageUrl}
              alt={story.title}
              className="max-h-[90vh] max-w-full object-contain rounded"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pb-16">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-cyan-500 hover:text-cyan-600 transition-colors">
              <FaArrowLeft />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <motion.button
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-3 py-1.5 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareStory}
              >
                <FaShare size={14} />
                <span>Share</span>
              </motion.button>
              <motion.button
                className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-3 py-1.5 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowInstagramPreview}
              >
                <FaInstagram size={14} />
                <span>Create Instagram Story</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Story header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                {story.title}
              </h1>

              <div className="flex flex-wrap gap-4 justify-center mb-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FaCalendarAlt />
                  <span>{formatDate(story.visitedDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt />
                  <span>{story.visitedLocation.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Story image */}
            <div className="mb-8">
              <div
                className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setShowFullImage(true)}
              >
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white bg-opacity-75 rounded-full p-3">
                    <FaDownload className="text-gray-700" size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Story content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">The Story</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {story.story}
                </p>
              </div>
            </div>

            {/* Location map */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Locations Visited</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <LocationMap
                  location={story.visitedLocation[0]}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Create your own travel story */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg p-8 text-center text-white">
              <img src={logo} alt="Travel Book" className="h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Create Your Own Travel Story</h2>
              <p className="text-white/90 mb-6">Document and share your travel memories with friends and family</p>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-cyan-500 font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default StoryDetails;

