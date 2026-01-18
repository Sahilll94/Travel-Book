import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MdPlace, MdDateRange, MdInfo, MdOutlineExplore, MdFavorite } from 'react-icons/md';
import { motion } from 'framer-motion';
import moment from 'moment';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: 20,  // Default center at a global view
  lng: 0
};

const getMapOptions = (isDarkMode) => ({
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  styles: isDarkMode ? [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
    { featureType: "poi", elementType: "labels.icon", stylers: [{ color: "#6f9ba5" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#364e59" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
    { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#294ea0" }] },
    { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#64779e" }] },
    { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
  ] : []
});

const LocationMap = ({ stories, locations, location, onViewStory, className }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [markers, setMarkers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  
  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Handle map load
  const handleMapLoad = useCallback((map) => {
    setIsMapLoaded(true);
  }, []);
  
  // Handle map load error
  const handleMapLoadError = useCallback((error) => {
    console.error('Error loading Google Maps:', error);
    setLoadError(error);
  }, []);
  
  // Process stories to get markers safely after map is loaded
  useEffect(() => {
    if (!isMapLoaded || !window.google || !window.google.maps) return;
    
    try {
      const processedMarkers = [];
      const geocoder = new window.google.maps.Geocoder();
      
      // Keep track of processed locations to avoid duplicates
      const processedLocations = new Set();
      
      // Handle case where stories array is provided
      if (stories && stories.length > 0) {
        stories.forEach((story) => {
          // Skip if no location
          if (!story.visitedLocation || story.visitedLocation.length === 0) return;
          
          story.visitedLocation.forEach((loc, index) => {
            // Skip if location is empty or already processed
            if (!loc || processedLocations.has(loc)) return;
            
            processedLocations.add(loc);
            
            // Geocode the location
            geocoder.geocode({ address: loc }, (results, status) => {
              if (status === 'OK' && results[0]) {
                const position = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                };
                
                // Add marker with story details
                processedMarkers.push({
                  id: `${story._id}-${index}`,
                  story,
                  position,
                  location: loc,
                });
                
                // Update markers state
                setMarkers([...processedMarkers]);
                
                // If this is the first marker, center the map on it
                if (processedMarkers.length === 1) {
                  setCenter(position);
                }
              } else {
                console.warn(`Geocoding failed for location: ${loc}. Status: ${status}`);
              }
            });
          });
        });
      }
      // Handle case where locations array is provided (from ViewTravelStory)
      else if (locations && locations.length > 0) {
        locations.forEach((loc, index) => {
          if (!loc || processedLocations.has(loc)) return;
          
          processedLocations.add(loc);
          
          geocoder.geocode({ address: loc }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const position = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
              };
              
              processedMarkers.push({
                id: `location-${index}`,
                position,
                location: loc,
                // Create a simple placeholder for the story
                story: {
                  title: loc,
                  visitedDate: new Date(),
                  isFavourite: false
                }
              });
              
              setMarkers([...processedMarkers]);
              
              if (processedMarkers.length === 1) {
                setCenter(position);
              }
            } else {
              console.warn(`Geocoding failed for location: ${loc}. Status: ${status}`);
            }
          });
        });
      }
      // Handle case where a single location string is provided (from StoryDetails)
      else if (location) {
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const position = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            };
            
            processedMarkers.push({
              id: 'single-location',
              position,
              location,
              // Create a simple placeholder for the story
              story: {
                title: location,
                visitedDate: new Date(),
                isFavourite: false
              }
            });
            
            setMarkers([...processedMarkers]);
            setCenter(position);
          } else {
            console.warn(`Geocoding failed for location: ${location}. Status: ${status}`);
          }
        });
      }
    } catch (error) {
      console.error('Error processing location data:', error);
      setLoadError(error);
    }
  }, [stories, locations, location, isMapLoaded]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString).format('MMMM D, YYYY');
  };
  
  // Get custom map container style with dynamic height
  const getCustomMapContainerStyle = () => {
    const style = {...mapContainerStyle};
    if (className?.includes('h-full')) {
      style.height = '100%';
    }
    return style;
  };
  
  // If there's a load error, show error message
  if (loadError) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700 ${className || ''}`}>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <MdInfo className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load map
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mb-4">
            There was an error loading the map. Please check your internet connection or try again later.
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded">
            {loadError.toString()}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={() => console.log('Google Maps script loaded')}
        onError={handleMapLoadError}
      >
        <GoogleMap
          mapContainerStyle={getCustomMapContainerStyle()}
          center={center}
          zoom={markers.length === 1 ? 10 : 2}
          options={getMapOptions(isDarkMode)}
          onLoad={handleMapLoad}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="${marker.story?.isFavourite ? '#f87171' : '#06b6d4'}" stroke="${marker.story?.isFavourite ? '#ef4444' : '#0891b2'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3" fill="white"></circle>
                  </svg>
                `),
                scaledSize: window.google?.maps?.Size ? new window.google.maps.Size(40, 40) : null,
                anchor: window.google?.maps?.Point ? new window.google.maps.Point(20, 40) : null,
              }}
              onClick={() => setSelectedMarker(marker)}
              animation={window.google?.maps?.Animation?.DROP}
            />
          ))}
          
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
              options={{
                pixelOffset: window.google?.maps?.Size ? new window.google.maps.Size(0, -40) : undefined,
                maxWidth: 380
              }}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Image Section */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                  {selectedMarker.story?.imageUrl ? (
                    <>
                      <motion.div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${selectedMarker.story.imageUrl})` }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdOutlineExplore className="text-6xl text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  
                  {/* Favorite Badge */}
                  {selectedMarker.story?.isFavourite && (
                    <motion.div 
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <MdFavorite className="text-lg" />
                    </motion.div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <motion.h3 
                    className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selectedMarker.story?.title || selectedMarker.location}
                  </motion.h3>

                  {/* Location with Icon */}
                  <motion.div 
                    className="flex items-start gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <MdPlace className="text-cyan-500 dark:text-cyan-400 mt-0.5 flex-shrink-0 text-base" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {selectedMarker.location}
                    </span>
                  </motion.div>

                  {/* Date with Icon */}
                  {selectedMarker.story?.visitedDate && (
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <MdDateRange className="text-cyan-500 dark:text-cyan-400 flex-shrink-0 text-base" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatDate(selectedMarker.story.visitedDate)}
                      </span>
                    </motion.div>
                  )}

                  {/* Story Preview */}
                  {selectedMarker.story?.story && (
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
                        {selectedMarker.story.story.slice(0, 200)}
                        {selectedMarker.story.story.length > 200 ? '...' : ''}
                      </p>
                    </motion.div>
                  )}

                  {/* View Story Button */}
                  {onViewStory && selectedMarker.story && (
                    <motion.button 
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                      onClick={() => onViewStory(selectedMarker.story)}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span>View Full Story</span>
                      <MdOutlineExplore className="text-lg group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {markers.length} {markers.length === 1 ? 'location' : 'locations'} found
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mr-1"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Regular</span>
            </div>
            <div className="flex items-center ml-3">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Favorite</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMap;