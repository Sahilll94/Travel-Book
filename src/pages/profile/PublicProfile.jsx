import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { MdLocationOn, MdLink, MdPhone, MdEmail, 
  MdFavorite, MdMap, MdLibraryBooks, MdPerson } from 'react-icons/md';
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import EmptyCard from '../../components/Cards/EmptyCard';

const PublicProfile = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ stories: 0, locations: 0, favorites: 0 });
  const [recentStories, setRecentStories] = useState([]);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/public-profile/${userId}`);
        if (data.profile) {
          setProfileData(data.profile);
          setStats(data.stats || { stories: 0, locations: 0, favorites: 0 });
          setRecentStories(data.recentStories || []);
        } else {
          toast.error('Could not load profile data correctly');
        }
      } catch (error) {
        console.error('Error fetching public profile:', error);
        toast.error('Failed to load profile. The profile may not exist or is private.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicProfile();
    }
  }, [userId]);

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Render social media links if they exist
  const renderSocialLinks = () => {
    if (!profileData?.socialLinks) return null;
    
    const { facebook, twitter, instagram, linkedin } = profileData.socialLinks;
    
    if (!facebook && !twitter && !instagram && !linkedin) return null;
    
    return (
      <div className="flex space-x-3 mt-4">
        {facebook && (
          <a 
            href={facebook.startsWith('http') ? facebook : `https://${facebook}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            aria-label="Facebook"
          >
            <FaFacebook size={20} />
          </a>
        )}
        
        {twitter && (
          <a 
            href={twitter.startsWith('http') ? twitter : `https://${twitter}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
            aria-label="Twitter"
          >
            <FaTwitter size={20} />
          </a>
        )}
        
        {instagram && (
          <a 
            href={instagram.startsWith('http') ? instagram : `https://${instagram}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
        )}
        
        {linkedin && (
          <a 
            href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
        )}
      </div>
    );
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{profileData?.fullName || 'User'} | Travel Book</title>
        <meta name="description" content={`View ${profileData?.fullName || 'User'}'s travel profile and stories`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !profileData ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Profile Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The profile you're looking for doesn't exist or is set to private.</p>
            <Link 
              to="/"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-sm transition duration-200"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Profile Card */}
              <div className="md:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md">
                        <img 
                          src={profileData.profileImage || '/avatar-default.png'} 
                          alt={profileData.fullName || 'User'} 
                          loading="eager"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/avatar-default.png';
                          }}
                        />
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {profileData.fullName || 'User'}
                    </h2>
                    
                    {profileData.preferences?.privacySettings?.showEmail && (
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {profileData.email}
                      </p>
                    )}
                    
                    <div className="text-center mb-4">
                      <p className="text-gray-600 dark:text-gray-300">
                        {profileData.bio || 'No bio added yet'}
                      </p>
                    </div>
                    
                    {/* Render social media links */}
                    {renderSocialLinks()}
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 w-full text-center mt-4">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <div className="text-xl font-bold text-gray-800 dark:text-white">{stats.stories}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Stories</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <div className="text-xl font-bold text-gray-800 dark:text-white">{stats.locations}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Places</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <div className="text-xl font-bold text-gray-800 dark:text-white">{stats.favorites}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Favorites</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h3>
                  
                  <div className="space-y-3">
                    {profileData.preferences?.privacySettings?.showEmail && (
                      <div className="flex items-center">
                        <MdEmail className="text-gray-500 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                          <div className="text-gray-800 dark:text-white">{profileData.email}</div>
                        </div>
                      </div>
                    )}
                    
                    {profileData.preferences?.privacySettings?.showPhone && profileData.phone && (
                      <div className="flex items-center">
                        <MdPhone className="text-gray-500 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                          <div className="text-gray-800 dark:text-white">{profileData.phone}</div>
                        </div>
                      </div>
                    )}
                    
                    {profileData.location && (
                      <div className="flex items-center">
                        <MdLocationOn className="text-gray-500 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                          <div className="text-gray-800 dark:text-white">{profileData.location}</div>
                        </div>
                      </div>
                    )}
                    
                    {profileData.website && (
                      <div className="flex items-center">
                        <MdLink className="text-gray-500 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Website</div>
                          <div className="text-gray-800 dark:text-white">
                            <a 
                              href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-500 hover:text-cyan-600 hover:underline"
                            >
                              {profileData.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* About Member */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    <MdPerson className="inline-block mr-2" />
                    About Member
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Member since: </span>
                      <span className="text-gray-800 dark:text-white">{formatJoinDate(profileData.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Recent Travel Stories */}
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Recent Travel Stories
                  </h3>
                  
                  {recentStories.length === 0 ? (
                    <EmptyCard 
                      imgSrc="/avatar-.png"
                      message={`${profileData.fullName || 'This user'} hasn't shared any travel stories yet.`}
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {recentStories.map(story => (
                        <TravelStoryCard 
                          key={story._id}
                          imgUrl={story.imageUrl}
                          title={story.title}
                          date={story.visitedDate}
                          story={story.story}
                          visitedLocation={story.visitedLocation}
                          isFavourite={story.isFavourite}
                          isPublicView={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </HelmetProvider>
  );
};

export default PublicProfile;