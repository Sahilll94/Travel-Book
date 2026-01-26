
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import StoryService from '../../services/storyService';
import AuthService from '../../services/authService';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import {
  MdAdd, MdQueryStats, MdFilterAlt, MdClose, MdCalendarMonth, MdWavingHand, MdOutlineExplore, MdFavorite, MdSort,
  MdOfflinePin, MdRefresh, MdCloudOff, MdEdit, MdDeleteOutline, MdWarning, MdInfo, MdMap, MdGridView, MdShare, MdDownload, MdBookmark, MdNotifications, MdTimeline
} from 'react-icons/md';
import Modal from 'react-modal';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/Cards/EmptyCard';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import { getEmptyCardMessage, getEmptyImg } from '../../utils/helper';
import { toast } from 'sonner';
import Toaster from '../../components/Toaster';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import jsPDF from 'jspdf';
import TravelAnalytics from '../../components/Cards/TravelAnalytics';

// Import the Map component dynamically to improve initial loading performance
const TravelMap = lazy(() => import('../../components/Cards/LocationMap'));

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dataRange, setDataRange] = useState({ from: null, to: null });
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // New state variables for confirmation dialogs
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    story: null
  });
  const [editConfirmation, setEditConfirmation] = useState({
    isOpen: false,
    story: null
  });

  // Add state for view type (grid/map)
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'map'
  const [mapLoaded, setMapLoaded] = useState(false);

  // State for share modal
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    story: null
  });

  // State for export options
  const [exportOptions, setExportOptions] = useState({
    isOpen: false,
    format: 'pdf'
  });

  const calendarRef = useRef(null);
  const sortRef = useRef(null);
  const filterMenuRef = useRef(null);

  // Handle online/offline status
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      toast.success('You are back online');
      syncOfflineData();
    }

    function handleOffline() {
      setIsOnline(false);
      toast.error('You are currently offline. Limited functionality available.');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if we have cached data
    const checkOfflineData = async () => {
      try {
        if ('indexedDB' in window) {
          const openRequest = indexedDB.open('TravelBookOfflineDB', 1);

          openRequest.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('stories')) {
              db.createObjectStore('stories', { keyPath: '_id' });
            }
          };

          openRequest.onsuccess = function (e) {
            const db = e.target.result;
            // Only try to check the store if it exists
            if (db.objectStoreNames.contains('stories')) {
              const transaction = db.transaction('stories', 'readonly');
              const store = transaction.objectStore('stories');
              const countRequest = store.count();

              countRequest.onsuccess = function () {
                setHasOfflineData(countRequest.result > 0);
              };
            } else {
              setHasOfflineData(false);
            }
          };
        }
      } catch (err) {
        console.error('Error checking offline data', err);
        setHasOfflineData(false);
      }
    };

    checkOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to get user info
  const getUserInfo = async () => {
    try {
      const data = await AuthService.getUser();
      setUserInfo(data.user);
    } catch (error) {
      localStorage.clear();
      navigate('/login');
    }
  };

  // Function to save stories to IndexedDB for offline access
  const saveStoriesToIndexedDB = (stories) => {
    if (!('indexedDB' in window)) {
      console.log('IndexedDB not supported');
      return;
    }

    const openRequest = indexedDB.open('TravelBookOfflineDB', 1);

    openRequest.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('stories')) {
        db.createObjectStore('stories', { keyPath: '_id' });
      }
    };

    openRequest.onsuccess = function (e) {
      const db = e.target.result;
      try {
        // Check if the object store exists before proceeding
        if (!db.objectStoreNames.contains('stories')) {
          // Close the current database connection
          db.close();

          // Increment the database version to trigger onupgradeneeded
          const reopenRequest = indexedDB.open('TravelBookOfflineDB', 2);

          reopenRequest.onupgradeneeded = function (event) {
            const newDb = event.target.result;
            if (!newDb.objectStoreNames.contains('stories')) {
              newDb.createObjectStore('stories', { keyPath: '_id' });
            }
          };

          reopenRequest.onsuccess = function (event) {
            const newDb = event.target.result;
            // Now we know the store exists, proceed with saving
            const transaction = newDb.transaction('stories', 'readwrite');
            const store = transaction.objectStore('stories');

            // Clear existing data then add all stories
            store.clear();

            stories.forEach(story => {
              store.add(story);
            });

            // Update state after transaction is complete
            transaction.oncomplete = function () {
              setHasOfflineData(stories.length > 0);
            };
          };

          return;
        }

        // If store exists, proceed normally
        const transaction = db.transaction('stories', 'readwrite');
        const store = transaction.objectStore('stories');

        // Clear existing data then add all stories
        store.clear();

        stories.forEach(story => {
          store.add(story);
        });

        // Update state after transaction is complete
        transaction.oncomplete = function () {
          setHasOfflineData(stories.length > 0);
        };
      } catch (err) {
        console.error('IndexedDB transaction error:', err);
      }
    };

    openRequest.onerror = function (e) {
      console.error('IndexedDB error:', e.target.error);
    };
  };

  // Function to get stories from IndexedDB when offline
  const getStoriesFromIndexedDB = () => {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject('IndexedDB not supported');
        return;
      }

      const openRequest = indexedDB.open('TravelBookOfflineDB', 1);

      // Add the onupgradeneeded handler to ensure store exists
      openRequest.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('stories')) {
          db.createObjectStore('stories', { keyPath: '_id' });
        }
      };

      openRequest.onsuccess = function (e) {
        const db = e.target.result;
        try {
          // Check if the store exists before trying to access it
          if (!db.objectStoreNames.contains('stories')) {
            return resolve([]); // Return empty array if store doesn't exist
          }

          const transaction = db.transaction('stories', 'readonly');
          const store = transaction.objectStore('stories');
          const request = store.getAll();

          request.onsuccess = function () {
            resolve(request.result);
          };

          request.onerror = function (e) {
            reject(e.target.error);
          };
        } catch (err) {
          console.error('Error accessing IndexedDB:', err);
          resolve([]); // Resolve with empty array on error
        }
      };

      openRequest.onerror = function (e) {
        reject(e.target.error);
      };
    });
  };

  // Function to sync offline changes when back online
  const syncOfflineData = async () => {
    // In a real implementation, you would sync any offline changes 
    // that were made while the user was offline
    await getAllTravelStories();
  };

  // Function to get all travel stories
  const getAllTravelStories = async () => {
    setIsLoading(true);
    try {
      if (isOnline) {
        const data = await StoryService.getAllStories();
        setAllStories(data.stories);
        setFilterType('');

        // Cache stories for offline use
        saveStoriesToIndexedDB(data.stories);
      } else {
        // Use cached data when offline
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          setAllStories(offlineStories);
          setFilterType('offline');
        } catch (err) {
          console.error('Error retrieving offline stories:', err);
          setAllStories([]);
        }
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating favorite status
  const updateIsFavourite = async (story) => {
    try {
      const data = await StoryService.updateIsFavourite(story._id, !story.isFavourite);

      if (data.story) {
        // Update the story in the local state
        setAllStories(prevStories =>
          prevStories.map(s =>
            s._id === story._id ? { ...s, isFavourite: !s.isFavourite } : s
          )
        );

        // Also update in IndexedDB for offline access
        if ('indexedDB' in window) {
          const openRequest = indexedDB.open('TravelBookOfflineDB', 1);

          openRequest.onsuccess = function (e) {
            const db = e.target.result;
            if (db.objectStoreNames.contains('stories')) {
              const transaction = db.transaction('stories', 'readwrite');
              const store = transaction.objectStore('stories');

              // Get the current story from IndexedDB
              const getRequest = store.get(story._id);

              getRequest.onsuccess = function () {
                if (getRequest.result) {
                  // Update the story
                  const updatedStory = { ...getRequest.result, isFavourite: !story.isFavourite };
                  store.put(updatedStory);
                }
              };
            }
          };
        }

        toast.success(story.isFavourite ? 'Removed from favorites' : 'Added to favorites');
      } else {
        toast.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Failed to update favorite status');
    }
  };

  // Handle updating showOnProfile status
  const updateShowOnProfile = async (story) => {
    try {
      const data = await StoryService.updateShowOnProfile(story._id, !story.showOnProfile);

      if (data.story) {
        // Update the story in the local state
        setAllStories(prevStories =>
          prevStories.map(s =>
            s._id === story._id ? { ...s, showOnProfile: !s.showOnProfile } : s
          )
        );

        // Also update in IndexedDB for offline access
        if ('indexedDB' in window) {
          const openRequest = indexedDB.open('TravelBookOfflineDB', 1);

          openRequest.onsuccess = function (e) {
            const db = e.target.result;
            if (db.objectStoreNames.contains('stories')) {
              const transaction = db.transaction('stories', 'readwrite');
              const store = transaction.objectStore('stories');

              // Get the current story from IndexedDB
              const getRequest = store.get(story._id);

              getRequest.onsuccess = function () {
                if (getRequest.result) {
                  // Update the story
                  const updatedStory = { ...getRequest.result, showOnProfile: !story.showOnProfile };
                  store.put(updatedStory);
                }
              };
            }
          };
        }

        toast.success(story.showOnProfile ?
          'Story removed from your public profile' :
          'Story will now appear on your public profile');
      } else {
        toast.error('Failed to update profile visibility');
      }
    } catch (error) {
      console.error('Error updating profile visibility:', error);
      toast.error('Failed to update profile visibility');
    }
  };

  // On search
  const onSearchNote = async (query) => {
    setIsLoading(true);
    if (!query) {
      await getAllTravelStories();
      return;
    }

    try {
      if (isOnline) {
        const data = await StoryService.searchStories(query);
        setAllStories(data.stories);
        setFilterType('search');
      } else {
        // Search in cached data
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          const searchResults = offlineStories.filter(story =>
            story.title.toLowerCase().includes(query.toLowerCase()) ||
            story.story.toLowerCase().includes(query.toLowerCase()) ||
            story.visitedLocation.some(loc => loc.toLowerCase().includes(query.toLowerCase()))
          );
          setAllStories(searchResults);
          setFilterType(searchResults.length > 0 ? 'search' : 'no-results');
        } catch (err) {
          console.error('Error searching offline stories:', err);
        }
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = async (filters) => {
    setIsLoading(true);

    try {
      if (isOnline) {
        // Prepare data for our new advanced search API
        const searchData = {
          title: filters.title || '',
          location: filters.location || '',
          dateRange: {
            startDate: filters.dateRange.start ? filters.dateRange.start : null,
            endDate: filters.dateRange.end ? filters.dateRange.end : null
          },
          isFavourite: filters.isFavourite,
          sortBy: filters.sortBy || 'newest'
        };

        // Use our new advanced search API endpoint
        const data = await StoryService.advancedSearch(searchData);

        if (data.stories && data.stories.length > 0) {
          setAllStories(data.stories);
          setFilterType('advanced');
          toast.success(`Found ${data.stories.length} matching stories`);
        } else {
          setAllStories([]);
          setFilterType('no-results');
          toast.info('No stories found matching your filters');
        }
      } else {
        // Offline implementation using IndexedDB
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          let filteredStories = [...offlineStories];

          // Apply title filter if provided
          if (filters.title && filters.title.trim() !== '') {
            const titleLower = filters.title.toLowerCase();
            filteredStories = filteredStories.filter(story =>
              story.title.toLowerCase().includes(titleLower)
            );
          }

          // Apply location filter if provided
          if (filters.location && filters.location.trim() !== '') {
            const locationLower = filters.location.toLowerCase();
            filteredStories = filteredStories.filter(story =>
              story.visitedLocation.some(loc => loc.toLowerCase().includes(locationLower))
            );
          }

          // Apply favorite filter if provided
          if (filters.isFavourite !== null && filters.isFavourite !== undefined) {
            filteredStories = filteredStories.filter(story =>
              story.isFavourite === filters.isFavourite
            );
          }

          // Apply date range filter if provided
          if (filters.dateRange.start || filters.dateRange.end) {
            if (filters.dateRange.start) {
              const startDate = new Date(filters.dateRange.start);
              filteredStories = filteredStories.filter(story => {
                const storyDate = new Date(story.visitedDate);
                return storyDate >= startDate;
              });
            }

            if (filters.dateRange.end) {
              const endDate = new Date(filters.dateRange.end);
              // Set time to end of day for inclusive filtering
              endDate.setHours(23, 59, 59, 999);
              filteredStories = filteredStories.filter(story => {
                const storyDate = new Date(story.visitedDate);
                return storyDate <= endDate;
              });
            }
          }

          // Apply sorting
          switch (filters.sortBy) {
            case 'newest':
              filteredStories.sort((a, b) => new Date(b.visitedDate) - new Date(a.visitedDate));
              break;
            case 'oldest':
              filteredStories.sort((a, b) => new Date(a.visitedDate) - new Date(b.visitedDate));
              break;
            case 'a-z':
              filteredStories.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case 'z-a':
              filteredStories.sort((a, b) => b.title.localeCompare(a.title));
              break;
            // Default sorting - by favorite status and then by date
            default:
              filteredStories.sort((a, b) => {
                if (a.isFavourite !== b.isFavourite) {
                  return b.isFavourite ? 1 : -1;
                }
                return new Date(b.visitedDate) - new Date(a.visitedDate);
              });
          }

          if (filteredStories.length > 0) {
            setAllStories(filteredStories);
            setFilterType('advanced');
            toast.success(`Found ${filteredStories.length} matching stories(offline)`);
          } else {
            setAllStories([]);
            setFilterType('no-results');
            toast.info('No stories found matching your filters');
          }
        } catch (err) {
          console.error('Error filtering offline stories with advanced search:', err);
          toast.error('Failed to apply filters');
        }
      }
    } catch (error) {
      console.error('Error with advanced search:', error);
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter travel stories by date range
  const filterStoriesByDateRange = async () => {
    if (!dataRange.from || !dataRange.to) {
      toast.error('Please select a date range');
      return;
    }

    setIsLoading(true);

    try {
      if (isOnline) {
        // Make sure we're sending dates in a consistent format for the API
        // When converting to ISO string, set the time to start of day for from date and end of day for to date
        const fromDate = new Date(dataRange.from);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(dataRange.to);
        toDate.setHours(23, 59, 59, 999);

        // Format the dates consistently (ISO string is safest for API calls)
        const formattedFromDate = fromDate.toISOString();
        const formattedToDate = toDate.toISOString();

        const data = await StoryService.filterStories(formattedFromDate, formattedToDate);

        if (data.stories && data.stories.length > 0) {
          setAllStories(data.stories);
          setFilterType('date');
          setShowCalendar(false);
        } else {
          setAllStories([]);
          setFilterType('no-results');
          toast.info('No stories found in the selected date range');
        }
      } else {
        // Offline implementation
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          const filteredStories = offlineStories.filter(story => {
            const storyDate = new Date(story.visitedDate);
            // Set story date to midnight for date-only comparison
            storyDate.setHours(0, 0, 0, 0);

            // Set time boundaries for comparison
            const fromDate = new Date(dataRange.from);
            fromDate.setHours(0, 0, 0, 0);

            const toDate = new Date(dataRange.to);
            toDate.setHours(23, 59, 59, 999);

            return storyDate >= fromDate && storyDate <= toDate;
          });

          if (filteredStories.length > 0) {
            setAllStories(filteredStories);
            setFilterType('date');
            setShowCalendar(false);
          } else {
            setAllStories([]);
            setFilterType('no-results');
            toast.info('No stories found in the selected date range');
          }
        } catch (err) {
          console.error('Error filtering offline stories by date:', err);
          toast.error('Failed to filter stories by date');
        }
      }
    } catch (error) {
      console.error('Error filtering by date range:', error);
      toast.error('Failed to filter stories by date');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle showing favorite stories
  const handleFavoriteFilter = () => {
    if (activeFilter === 'favorites') {
      setActiveFilter('all');
    } else {
      setActiveFilter('favorites');
    }
  };

  // Handle mobile swipe for traveling between tabs
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeFilter === 'all') setActiveFilter('favorites');
      else if (activeFilter === 'favorites') setActiveFilter('recent');
    },
    onSwipedRight: () => {
      if (activeFilter === 'recent') setActiveFilter('favorites');
      else if (activeFilter === 'favorites') setActiveFilter('all');
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  // Function to handle add/edit travel story
  const handleAddOrEditStory = () => {
    if (!isOnline) {
      toast.error('You need to be online to add or edit stories');
      return;
    }

    setOpenAddEditModal({
      isShown: true,
      type: 'add',
      data: null,
    });
  };

  // Get displayed stories based on current filters and sorting
  const getDisplayedStories = () => {
    let stories = [...allStories];

    // Filter by favorites if active
    if (activeFilter === 'favorites') {
      stories = stories.filter(story => story.isFavourite);
    } else if (activeFilter === 'recent') {
      // Show only recent stories (last 30 days)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      stories = stories.filter(story => {
        const storyDate = new Date(story.visitedDate);
        storyDate.setHours(0, 0, 0, 0); // Compare only dates, not times
        return storyDate >= thirtyDaysAgo;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        return stories.sort((a, b) => new Date(b.visitedDate) - new Date(a.visitedDate));
      case 'oldest':
        return stories.sort((a, b) => new Date(a.visitedDate) - new Date(b.visitedDate));
      case 'az':
        return stories.sort((a, b) => a.title.localeCompare(b.title));
      case 'za':
        return stories.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return stories;
    }
  };

  // Handle day selection in the calendar
  const handleDayClick = (selectedDay) => {
    setDataRange(selectedDay);
  };

  // Handle view story
  const handleViewStory = (story) => {
    setOpenViewModal({
      isShown: true,
      data: story,
    });
  };

  // Handle edit story confirmation
  const handleEditClick = (story) => {
    if (!isOnline) {
      toast.error('You need to be online to edit stories');
      return;
    }

    // Show confirmation dialog
    setEditConfirmation({
      isOpen: true,
      story: story
    });
  };

  // Proceed with edit after confirmation
  const confirmEdit = () => {
    setOpenViewModal({
      isShown: false,
      data: null,
    });

    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: editConfirmation.story,
    });

    // Close the confirmation dialog
    setEditConfirmation({
      isOpen: false,
      story: null
    });
  };

  // Handle delete story confirmation
  const handleDeleteClick = (story) => {
    if (!isOnline) {
      toast.error('You need to be online to delete stories');
      return;
    }

    // Show confirmation dialog
    setDeleteConfirmation({
      isOpen: true,
      story: story
    });
  };

  // Proceed with delete after confirmation
  const confirmDelete = async () => {
    try {
      const data = await StoryService.deleteStory(deleteConfirmation.story._id);

      setOpenViewModal({
        isShown: false,
        data: null,
      });

      // Close the confirmation dialog
      setDeleteConfirmation({
        isOpen: false,
        story: null
      });

      getAllTravelStories();
      toast.success("Travel Story deleted successfully!");
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete the story');

      // Close the confirmation dialog even on error
      setDeleteConfirmation({
        isOpen: false,
        story: null
      });
    }
  };

  // Handle export story
  const handleExportStory = (story, format) => {
    const fileName = `${story.title.replace(/\s+/g, '_')}.${format} `;
    let fileContent = '';

    switch (format) {
      case 'pdf':
        try {
          const doc = new jsPDF();
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const pageMargins = 20;
          const textWidth = pageWidth - (pageMargins * 2);

          let currentY = 20; // Starting Y position

          // Add title
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          const titleLines = doc.splitTextToSize(story.title, textWidth);
          doc.text(titleLines, pageMargins, currentY);
          currentY += 10 + (titleLines.length * 10); // Add spacing after title

          // Add metadata
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.text(`Location: ${story.visitedLocation.join(', ')} `, pageMargins, currentY);
          currentY += 10;
          doc.text(`Visit Date: ${moment(story.visitedDate).format("MMMM Do YYYY")} `, pageMargins, currentY);
          currentY += 20;

          // Add image
          const imageWidth = textWidth;
          const imageHeight = 100;
          try {
            doc.addImage(
              story.imageUrl,
              'JPEG',
              pageMargins,
              currentY,
              imageWidth,
              imageHeight,
              undefined,
              'FAST'
            );
            currentY += imageHeight + 20; // Add spacing after image
          } catch (imgError) {
            console.error('Error adding image to PDF:', imgError);
            // Continue without image if there's an error
            currentY += 10;
          }

          // Add story content
          doc.setFontSize(12);
          const storyLines = doc.splitTextToSize(story.story, textWidth);

          // Check if we need a new page for the content
          if (currentY + (storyLines.length * 5) > pageHeight - pageMargins) {
            doc.addPage();
            currentY = pageMargins;
          }

          doc.text(storyLines, pageMargins, currentY);

          // Save the PDF
          const fileName = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()} _travel_story.pdf`;
          doc.save(fileName);
          toast.success('Travel story exported as PDF! 📄✨');
        } catch (error) {
          console.error('Error generating PDF:', error);
          toast.error('Failed to export PDF. Please try again.');
        }
        return;
      case 'txt':
        fileContent = `Title: ${story.title} \nDate: ${moment(story.visitedDate).format('MMMM D, YYYY')} \n\n${story.story} `;
        break;
      case 'json':
        fileContent = JSON.stringify(story, null, 2);
        break;
      default:
        toast.error('Unsupported export format');
        return;
    }

    const blob = new Blob([fileContent], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    toast.success(`Story exported as ${format.toUpperCase()} `);
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  // Handle clicks outside of menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }

      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }

      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Your Travel Book</title>
        <meta name="description" content="Your personal collection of travel memories" />
      </Helmet>

      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchNote}
        handleClearSearch={() => {
          getAllTravelStories();
        }}
        onAdvancedSearch={handleAdvancedSearch}
      />

      {/* Offline banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="bg-amber-500 text-white p-2 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <div className="flex items-center justify-center gap-2">
              <MdCloudOff />
              <span>You are offline. Some features may be limited.</span>
              {hasOfflineData && (
                <span className="ml-2 inline-flex items-center text-xs bg-amber-600 px-2 py-1 rounded-full">
                  <MdOfflinePin className="mr-1" /> Using cached data
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome message for new users */}
      <AnimatePresence>
        {showWelcomeMessage && userInfo && (
          <motion.div
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mx-4 mt-4 shadow-sm"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start">
              <div className="mr-3 bg-cyan-100 dark:bg-cyan-900 p-2 rounded-full">
                <MdWavingHand className="text-cyan-500 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Welcome, {userInfo.fullName}!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ready to document your travel memories? Create a new story by clicking the "+" button.</p>
              </div>
              <button
                onClick={() => setShowWelcomeMessage(false)}
                className="ml-auto text-gray-400 hover:text-gray-500"
                aria-label="Close welcome message"
              >
                <MdClose />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <AnimatePresence>
          {filterType !== '' && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FilterInfoTitle
                type={filterType}
                searchQuery={searchQuery}
                onHandleClear={() => {
                  getAllTravelStories();
                  setDataRange({ from: null, to: null });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Filters Button */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg flex items-center justify-between"
            aria-expanded={showMobileFilters}
            aria-controls="mobile-filters"
          >
            <span className="flex items-center">
              <MdFilterAlt className="mr-2" />
              Filters & Sort
            </span>
            <span>{showMobileFilters ? '−' : '+'}</span>
          </button>

          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                id="mobile-filters"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
                {...swipeHandlers}
              >
                {/* Filter Tabs */}
                <div className="flex flex-nowrap overflow-x-auto hide-scrollbar mb-4 pb-2">
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => {
                        setActiveFilter('all');
                        getAllTravelStories();
                      }}
                      className={`whitespace - nowrap px - 4 py - 2 rounded - full text - sm font - medium transition - colors flex items - center gap - 1 flex - shrink - 0 ${activeFilter === 'all'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                        } `}
                    >
                      All Stories
                    </button>
                    <button
                      onClick={handleFavoriteFilter}
                      className={`whitespace - nowrap px - 4 py - 2 rounded - full text - sm font - medium transition - colors flex items - center gap - 1 flex - shrink - 0 ${activeFilter === 'favorites'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                        } `}
                    >
                      <MdFavorite className={activeFilter === 'favorites' ? "text-sm text-white" : "text-sm text-red-500"} />
                      Favorites
                    </button>
                    <button
                      onClick={() => setActiveFilter('recent')}
                      className={`whitespace - nowrap px - 4 py - 2 rounded - full text - sm font - medium transition - colors flex items - center gap - 1 flex - shrink - 0 ${activeFilter === 'recent'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                        } `}
                    >
                      <MdOutlineExplore className={activeFilter === 'recent' ? "text-sm text-white" : "text-sm text-cyan-500"} />
                      Recent Visits
                    </button>
                  </div>
                </div>

                {/* Date Range and Sort */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="flex items-center justify-center gap-2 text-sm font-medium p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <MdCalendarMonth className="text-cyan-500" />
                    <span>Date Range</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowSortOptions(!showSortOptions)}
                      className="w-full flex items-center justify-center gap-2 text-sm font-medium p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <MdSort className="text-cyan-500" />
                      <span>Sort By</span>
                    </button>
                  </div>
                </div>

                {/* Swipe hint */}
                <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                  <span>← Swipe to switch between filters →</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Calendar Popup */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              ref={calendarRef}
              className="mb-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-lg rounded-lg p-3 z-30 absolute lg:relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium dark:text-white">Select Date Range</h3>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Close calendar"
                >
                  <MdClose size={20} />
                </button>
              </div>
              <DayPicker
                captionLayout="dropdown-buttons"
                mode="range"
                selected={dataRange}
                onSelect={handleDayClick}
                pagedNavigation
              />

              <div className="mt-3 flex justify-end">
                <button
                  onClick={filterStoriesByDateRange}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
                  disabled={!dataRange.from || !dataRange.to}
                >
                  Apply Filter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <div className="hidden sm:flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="text-sm text-gray-500 dark:text-gray-300 mr-4">
                  {getDisplayedStories().length} {getDisplayedStories().length === 1 ? 'story' : 'stories'}
                  {activeFilter === 'favorites' ? ' in favorites' : ''}
                  {activeFilter === 'recent' ? ' from recent visits' : ''}
                </div>

                {/* View Type Toggle (Grid/Map) */}
                {getDisplayedStories().length > 0 && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-1 flex">
                    <button
                      className={`px - 3 py - 1 rounded flex items - center text - xs font - medium ${viewType === 'grid'
                          ? 'bg-white dark:bg-gray-600 shadow-sm text-cyan-600 dark:text-cyan-400'
                          : 'text-gray-500 dark:text-gray-300'
                        } `}
                      onClick={() => setViewType('grid')}
                      aria-label="Grid view"
                    >
                      <MdGridView className={`mr - 1 ${viewType === 'grid' ? 'text-cyan-500' : ''} `} />
                      Grid
                    </button>
                    <button
                      className={`px - 3 py - 1 rounded flex items - center text - xs font - medium ${viewType === 'map'
                          ? 'bg-white dark:bg-gray-600 shadow-sm text-cyan-600 dark:text-cyan-400'
                          : 'text-gray-500 dark:text-gray-300'
                        } `}
                      onClick={() => {
                        if (!isOnline) {
                          toast.error('Map view requires an internet connection');
                          return;
                        }
                        setViewType('map');
                        setMapLoaded(true);
                      }}
                      disabled={!isOnline}
                      aria-label="Map view"
                    >
                      <MdMap className={`mr - 1 ${viewType === 'map' ? 'text-cyan-500' : ''} `} />
                      Map
                    </button>
                  </div>
                )}
              </div>

              <div className="hidden lg:flex items-center space-x-2">
                <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-x divide-gray-200 dark:divide-gray-700">
                  <button
                    onClick={() => {
                      setActiveFilter('all');
                      getAllTravelStories();
                    }}
                    className={`px - 3 py - 1.5 text - sm font - medium ${activeFilter === 'all' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-300'} `}
                  >
                    All
                  </button>
                  <button
                    onClick={handleFavoriteFilter}
                    className={`px - 3 py - 1.5 text - sm font - medium flex items - center ${activeFilter === 'favorites' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-300'} `}
                  >
                    <MdFavorite className="mr-1 text-red-500" /> Favorites
                  </button>
                  <button
                    onClick={() => setActiveFilter('recent')}
                    className={`px - 3 py - 1.5 text - sm font - medium flex items - center ${activeFilter === 'recent' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-300'} `}
                  >
                    <MdOutlineExplore className="mr-1 text-cyan-500" /> Recent
                  </button>
                </div>

                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setShowSortOptions(!showSortOptions)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <MdSort className="text-gray-500" />
                    <span>Sort</span>
                  </button>

                  {showSortOptions && (
                    <div
                      className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-20 border border-gray-200 dark:border-gray-700"
                    >
                      <button
                        onClick={() => { setSortBy('newest'); setShowSortOptions(false); }}
                        className={`w - full text - left px - 4 py - 2 text - sm ${sortBy === 'newest' ? 'bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} `}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => { setSortBy('oldest'); setShowSortOptions(false); }}
                        className={`w - full text - left px - 4 py - 2 text - sm ${sortBy === 'oldest' ? 'bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} `}
                      >
                        Oldest First
                      </button>
                      <button
                        onClick={() => { setSortBy('az'); setShowSortOptions(false); }}
                        className={`w - full text - left px - 4 py - 2 text - sm ${sortBy === 'az' ? 'bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} `}
                      >
                        A-Z
                      </button>
                      <button
                        onClick={() => { setSortBy('za'); setShowSortOptions(false); }}
                        className={`w - full text - left px - 4 py - 2 text - sm ${sortBy === 'za' ? 'bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} `}
                      >
                        Z-A
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : getDisplayedStories().length > 0 ? (
              viewType === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {getDisplayedStories().map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TravelStoryCard
                        imgUrl={item.imageUrl}
                        title={item.title}
                        story={item.story}
                        date={item.visitedDate}
                        visitedLocation={item.visitedLocation}
                        isFavourite={item.isFavourite}
                        showOnProfile={item.showOnProfile}
                        onClick={() => handleViewStory(item)}
                        onFavouriteClick={() => isOnline ? updateIsFavourite(item) : toast.error('You need to be online to update favorites')}
                        onProfileToggleClick={() => isOnline ? updateShowOnProfile(item) : toast.error('You need to be online to update profile visibility')}
                        onShareClick={() => setShareModal({ isOpen: true, story: item })}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Suspense fallback={<div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
                  <TravelMap
                    stories={getDisplayedStories()}
                    onViewStory={(story) => handleViewStory(story)}
                  />
                </Suspense>
              )
            ) : (
              <div className="flex justify-center">
                <EmptyCard
                  imgSrc={getEmptyImg(filterType)}
                  message={
                    activeFilter === 'favorites' && allStories.length > 0
                      ? "You haven't marked any stories as favorites yet."
                      : activeFilter === 'recent' && allStories.length > 0
                        ? "No travel stories from the last 30 days."
                        : getEmptyCardMessage(filterType)
                  }
                  onAddClick={isOnline ? () => handleAddOrEditStory() : null}
                />
              </div>
            )}
          </div>

          <div className="hidden lg:block w-full lg:w-[320px] order-1 lg:order-2 sticky top-24 self-start">
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-lg shadow-slate-200/60 dark:shadow-none rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dataRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>

            {allStories.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => isOnline ? setShowAnalytics(true) : toast.error('Analytics require an internet connection')}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-lg shadow-sm w-full"
                >
                  <MdQueryStats className="text-lg text-cyan-500" />
                  <span>View Analytics</span>
                </button>
              </div>
            )}

            {!isOnline && hasOfflineData && (
              <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 dark:text-amber-400 flex items-center">
                  <MdOfflinePin className="mr-2" />
                  Offline Mode
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  You're viewing cached data. Some features are limited while offline.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 flex items-center text-xs text-amber-800 dark:text-amber-300"
                >
                  <MdRefresh className="mr-1" /> Try reconnecting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
            backdropFilter: 'blur(10px)',
          },
        }}
        appElement={document.getElementById('root')}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: 'add', data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
            backdropFilter: 'blur(10px)',
          },
        }}
        appElement={document.getElementById('root')}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => handleEditClick(openViewModal.data || null)}
          onDeleteClick={() => handleDeleteClick(openViewModal.data || null)}
        />
      </Modal>

      <Modal
        isOpen={showAnalytics}
        onRequestClose={() => setShowAnalytics(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
            backdropFilter: 'blur(10px)',
          },
        }}
        appElement={document.getElementById('root')}
        className="model-box max-w-3xl mx-auto"
      >
        <TravelAnalytics onClose={() => setShowAnalytics(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onRequestClose={() => setDeleteConfirmation({ isOpen: false, story: null })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            maxWidth: '420px',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'transparent',
            overflow: 'visible'
          }
        }}
        appElement={document.getElementById('root')}
        className="model-box max-w-md mx-auto"
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                <MdDeleteOutline className="text-lg text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Story</h3>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Are you sure you want to delete <span className="font-medium text-gray-800 dark:text-white">"{deleteConfirmation.story?.title}"</span>?
              </p>
              <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3">
                <div className="flex items-start">
                  <MdWarning className="text-red-500 mr-2 mt-0.5 flex-shrink-0 text-sm" />
                  <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <motion.button
                onClick={() => setDeleteConfirmation({ isOpen: false, story: null })}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center shadow-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdDeleteOutline className="mr-1.5 text-sm" /> Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Modal>

      {/* Edit Confirmation Modal */}
      <Modal
        isOpen={editConfirmation.isOpen}
        onRequestClose={() => setEditConfirmation({ isOpen: false, story: null })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            maxWidth: '420px',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'transparent',
            overflow: 'visible'
          }
        }}
        appElement={document.getElementById('root')}
        className="model-box max-w-md mx-auto"
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mr-3">
                <MdEdit className="text-lg text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Story</h3>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                You're about to edit <span className="font-medium text-gray-800 dark:text-white">"{editConfirmation.story?.title}"</span>
              </p>
              <div className="mt-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/50 rounded-lg p-3">
                <div className="flex items-start">
                  <MdInfo className="text-cyan-500 mr-2 mt-0.5 flex-shrink-0 text-sm" />
                  <p className="text-xs text-cyan-700 dark:text-cyan-300 leading-relaxed">
                    You'll be able to modify all aspects of your travel story.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <motion.button
                onClick={() => setEditConfirmation({ isOpen: false, story: null })}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={confirmEdit}
                className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg flex items-center shadow-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdEdit className="mr-1.5 text-sm" /> Edit
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={shareModal.isOpen}
        onRequestClose={() => setShareModal({ isOpen: false, story: null })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            maxWidth: '500px',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'transparent',
            overflow: 'visible'
          }
        }}
        appElement={document.getElementById('root')}
        className="model-box max-w-lg mx-auto"
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mr-4">
                  <MdShare className="text-2xl text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Share Travel Story</h3>
              </div>
              <button
                onClick={() => setShareModal({ isOpen: false, story: null })}
                className="text-gray-400 hover:text-gray-500"
              >
                <MdClose size={24} />
              </button>
            </div>

            {shareModal.story && (
              <>
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <img
                      src={shareModal.story.imageUrl}
                      alt={shareModal.story.title}
                      className="w-16 h-16 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{shareModal.story.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {moment(shareModal.story.visitedDate).format('MMMM D, YYYY')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Story Link</label>
                    <div className="flex">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin} /story/${shareModal.story._id} `}
                        className="flex-1 p-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin} /story/${shareModal.story._id} `);
                          toast.success('Link copied to clipboard!');
                        }}
                        className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-r-md"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Share via</h4>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    <button
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/story/${shareModal.story._id}`)}`, '_blank');
                      }}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Facebook</span>
                    </button >
                    <button
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my travel story: ${shareModal.story.title}`)}&url=${encodeURIComponent(`${window.location.origin}/story/${shareModal.story._id}`)}`, '_blank');
                      }}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Twitter</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${window.location.origin}/story/${shareModal.story._id}`)}&title=${encodeURIComponent(`My Travel Story: ${shareModal.story.title}`)}&summary=${encodeURIComponent(shareModal.story.story.substring(0, 100) + '...')}`, '_blank');
                      }}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">LinkedIn</span>
                    </button>
                    {/* WhatsApp sharing */}
                    <button
                      onClick={() => {
                        const message = `Check out my travel story: ${shareModal.story.title}\n${window.location.origin}/story/${shareModal.story._id}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">WhatsApp</span>
                    </button>
                    {/* Instagram sharing notice */}
                    <button
                      onClick={() => {
                        // Instagram doesn't support direct sharing via URL
                        // Copy the link to clipboard and show a toast
                        navigator.clipboard.writeText(`${window.location.origin}/story/${shareModal.story._id}`);
                        toast.success('Link copied! Instagram does not support direct sharing. Paste the link in your Instagram story or post.');
                      }}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Instagram</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open(`mailto:?subject=${encodeURIComponent(`My Travel Story: ${shareModal.story.title}`)}&body=${encodeURIComponent(`Check out my travel story: ${shareModal.story.title}\n\n${shareModal.story.story.substring(0, 200)}...\n\nRead more: ${window.location.origin}/story/${shareModal.story._id}`)}`, '_blank');
                      }}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Email</span>
                    </button>
                  </div >
                </div >

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Export as</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleExportStory(shareModal.story, 'pdf')}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mb-2">
                        <MdDownload className="text-white text-xl" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">PDF</span>
                    </button>
                    <button
                      onClick={() => handleExportStory(shareModal.story, 'txt')}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mb-2">
                        <MdDownload className="text-white text-xl" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Text</span>
                    </button>
                    <button
                      onClick={() => handleExportStory(shareModal.story, 'json')}
                      className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
                        <MdDownload className="text-white text-xl" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">JSON</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div >
        </motion.div >
      </Modal >

      <motion.button
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-4 sm:right-10 bottom-6 sm:bottom-10 shadow-lg z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={!isOnline}
        onClick={() => {
          if (isOnline) {
            setOpenAddEditModal({ isShown: true, type: 'add', data: null });
          } else {
            toast.error('You need to be online to add new stories');
          }
        }}
        aria-label="Add new travel story"
      >
        <MdAdd className="text-[28px] sm:text-[32px] text-white" />
      </motion.button>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </HelmetProvider >
  );
};

export default Home;
