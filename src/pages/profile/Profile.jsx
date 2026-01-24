import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion'; // Import motion from framer-motion
// Remove Navbar import
import Toaster from '../../components/Toaster';
import ShareProfileModal from '../../components/Modals/ShareProfileModal'; // Add ShareProfileModal import
import AuthService from '../../services/authService';
import {
  MdEdit, MdSave, MdCancel, MdCameraAlt, MdLocationOn, MdLink, MdPhone, MdEmail,
  MdFavorite, MdMap, MdLibraryBooks, MdPublic, MdVisibility, MdVisibilityOff,
  MdNotifications, MdNotificationsOff, MdFacebook, MdOutlineMailOutline, MdShare, MdDashboard
} from 'react-icons/md';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ stories: 0, locations: 0, favorites: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Add state for share modal
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    preferences: {
      notificationsEnabled: true,
      privacySettings: {
        showEmail: false,
        showPhone: false,
        profileVisibility: 'public'
      },
      theme: 'system'
    }
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Use useCallback to memoize the fetchUserProfile function
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AuthService.getUserProfile();
      if (data && data.user) {
        setProfileData(data.user);
        setProfileImage(data.user.profileImage);
        setFormData({
          fullName: data.user.fullName || '',
          bio: data.user.bio || '',
          location: data.user.location || '',
          phone: data.user.phone || '',
          website: data.user.website || '',
          socialLinks: {
            facebook: data.user.socialLinks?.facebook || '',
            twitter: data.user.socialLinks?.twitter || '',
            instagram: data.user.socialLinks?.instagram || '',
            linkedin: data.user.socialLinks?.linkedin || ''
          },
          preferences: {
            notificationsEnabled: data.user.preferences?.notificationsEnabled !== undefined
              ? data.user.preferences.notificationsEnabled
              : true,
            privacySettings: {
              showEmail: data.user.preferences?.privacySettings?.showEmail || false,
              showPhone: data.user.preferences?.privacySettings?.showPhone || false,
              profileVisibility: data.user.preferences?.privacySettings?.profileVisibility || 'public'
            },
            theme: data.user.preferences?.theme || 'system'
          }
        });
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle showing toast outside the render cycle
  useEffect(() => {
    if (showErrorToast) {
      toast.error('Failed to load profile data');
      setShowErrorToast(false);
    }
  }, [showErrorToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects (socialLinks, preferences)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSocialLinkChange = (network, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [network]: value
      }
    });
  };

  const handlePrivacySettingChange = (setting, value) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        privacySettings: {
          ...formData.preferences.privacySettings,
          [setting]: value
        }
      }
    });
  };

  const handleNotificationToggle = () => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        notificationsEnabled: !formData.preferences.notificationsEnabled
      }
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const data = await AuthService.updateProfileImage(formData);

      if (data && data.profileImage) {
        setProfileImage(data.profileImage);
        toast.success('Profile picture updated');
        return data.profileImage;
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to update profile picture');
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Upload profile image if changed
      if (imageFile) {
        await uploadProfileImage();
      }

      // Update profile data
      const data = await AuthService.updateUserProfile(formData);

      if (data && data.user) {
        setProfileData(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
      // Clear image preview and file
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const cancelEditing = () => {
    // Reset form data to current profile data
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        website: profileData.website || '',
        socialLinks: {
          facebook: profileData.socialLinks?.facebook || '',
          twitter: profileData.socialLinks?.twitter || '',
          instagram: profileData.socialLinks?.instagram || '',
          linkedin: profileData.socialLinks?.linkedin || ''
        },
        preferences: {
          notificationsEnabled: profileData.preferences?.notificationsEnabled || true,
          privacySettings: {
            showEmail: profileData.preferences?.privacySettings?.showEmail || false,
            showPhone: profileData.preferences?.privacySettings?.showPhone || false,
            profileVisibility: profileData.preferences?.privacySettings?.profileVisibility || 'public'
          },
          theme: profileData.preferences?.theme || 'system'
        }
      });
    }

    // Clear image preview and file
    setImagePreview(null);
    setImageFile(null);

    // Exit edit mode
    setIsEditing(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Your Profile | Travel Book</title>
        <meta name="description" content="Manage your Travel Book profile and account settings" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Enhanced Back to Dashboard Button */}
            <div className="mb-4">
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700
                text-white rounded-lg shadow-md shadow-cyan-500/20 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="flex items-center"
                  initial={{ gap: "0.5rem" }}
                  whileHover={{ gap: "0.75rem" }}
                >
                  <MdDashboard className="text-xl" />
                  <span>Back to Dashboard</span>
                </motion.div>
              </motion.button>
            </div>

            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 md:mb-0">
                Profile & Settings
              </h1>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-sm transition duration-200"
                >
                  <MdEdit className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition duration-200"
                  >
                    <MdCancel className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-sm transition duration-200"
                  >
                    <MdSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Profile Card */}
              <div className="md:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      {isEditing && (
                        <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full cursor-pointer">
                          <MdCameraAlt />
                          <input
                            type="file"
                            id="profile-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}

                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md">
                        <img
                          src={imagePreview || profileImage || '/avatar-default.png'}
                          alt={profileData?.fullName || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/avatar-default.png';
                          }}
                        />
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {profileData?.fullName || 'User'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {profileData?.email || 'email@example.com'}
                    </p>

                    {/* Share Profile Button */}
                    {!isEditing && profileData?._id && formData.preferences.privacySettings.profileVisibility === 'public' && (
                      <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="flex items-center px-3 py-1 mb-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-sm transition duration-200"
                      >
                        <MdShare className="mr-1" />
                        Share Profile
                      </button>
                    )}

                    {!isEditing ? (
                      <div className="text-center mb-4">
                        <p className="text-gray-600 dark:text-gray-300">
                          {profileData?.bio || 'No bio added yet'}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself..."
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          rows="3"
                        />
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 w-full text-center mt-2">
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

                  {!isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MdEmail className="text-gray-500 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                          <div className="text-gray-800 dark:text-white">
                            {profileData?.preferences?.privacySettings?.showEmail
                              ? profileData?.email
                              : <span className="text-gray-400 dark:text-gray-500 italic">Hidden</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <MdPhone className="text-gray-500 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                          <div className="text-gray-800 dark:text-white">
                            {profileData?.preferences?.privacySettings?.showPhone && profileData?.phone
                              ? profileData.phone
                              : <span className="text-gray-400 dark:text-gray-500 italic">
                                {profileData?.phone ? 'Hidden' : 'Not added'}
                              </span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <MdLocationOn className="text-gray-500 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                          <div className="text-gray-800 dark:text-white">
                            {profileData?.location || <span className="text-gray-400 dark:text-gray-500 italic">Not added</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <MdLink className="text-gray-500 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Website</div>
                          <div className="text-gray-800 dark:text-white">
                            {profileData?.website ? (
                              <a
                                href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-500 hover:text-cyan-600 hover:underline"
                              >
                                {profileData.website}
                              </a>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 italic">Not added</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your phone number"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Your location"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="Your website URL"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showEmail"
                          checked={formData.preferences.privacySettings.showEmail}
                          onChange={(e) => handlePrivacySettingChange('showEmail', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="showEmail" className="text-sm text-gray-700 dark:text-gray-300">
                          Show email to other users
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showPhone"
                          checked={formData.preferences.privacySettings.showPhone}
                          onChange={(e) => handlePrivacySettingChange('showPhone', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="showPhone" className="text-sm text-gray-700 dark:text-gray-300">
                          Show phone number to other users
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Details, Social Media & Preferences */}
              <div className="md:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h3>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Email: {profileData?.email}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          To change your email, please contact support
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Account Created
                        </label>
                        <p className="text-gray-600 dark:text-gray-300">
                          {new Date(profileData?.createdOn).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="border-b dark:border-gray-700 pb-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Full Name</div>
                        <div className="text-gray-800 dark:text-white">{profileData?.fullName}</div>
                      </div>

                      <div className="border-b dark:border-gray-700 pb-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Email Address</div>
                        <div className="text-gray-800 dark:text-white">{profileData?.email}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Member Since</div>
                        <div className="text-gray-800 dark:text-white">
                          {new Date(profileData?.createdOn).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Social Media</h3>

                  {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                          <MdFacebook className="text-white" />
                        </div>
                        <div>
                          {profileData?.socialLinks?.facebook ? (
                            <a
                              href={profileData.socialLinks.facebook.startsWith('http')
                                ? profileData.socialLinks.facebook
                                : `https://${profileData.socialLinks.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-500 hover:text-cyan-600 hover:underline"
                            >
                              Facebook
                            </a>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">Not connected</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center mr-3">
                          <FaTwitter className="text-white" />
                        </div>
                        <div>
                          {profileData?.socialLinks?.twitter ? (
                            <a
                              href={profileData.socialLinks.twitter.startsWith('http')
                                ? profileData.socialLinks.twitter
                                : `https://${profileData.socialLinks.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-500 hover:text-cyan-600 hover:underline"
                            >
                              Twitter
                            </a>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">Not connected</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center mr-3">
                          <FaInstagram className="text-white" />
                        </div>
                        <div>
                          {profileData?.socialLinks?.instagram ? (
                            <a
                              href={profileData.socialLinks.instagram.startsWith('http')
                                ? profileData.socialLinks.instagram
                                : `https://${profileData.socialLinks.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-500 hover:text-cyan-600 hover:underline"
                            >
                              Instagram
                            </a>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">Not connected</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                          <FaLinkedin className="text-white" />
                        </div>
                        <div>
                          {profileData?.socialLinks?.linkedin ? (
                            <a
                              href={profileData.socialLinks.linkedin.startsWith('http')
                                ? profileData.socialLinks.linkedin
                                : `https://${profileData.socialLinks.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-500 hover:text-cyan-600 hover:underline"
                            >
                              LinkedIn
                            </a>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">Not connected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <MdFacebook className="text-blue-500 mr-2" />
                          Facebook
                        </label>
                        <input
                          type="url"
                          value={formData.socialLinks.facebook}
                          onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                          placeholder="Your Facebook profile URL"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <FaTwitter className="text-blue-400 mr-2" />
                          Twitter
                        </label>
                        <input
                          type="url"
                          value={formData.socialLinks.twitter}
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          placeholder="Your Twitter profile URL"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <FaInstagram className="text-pink-500 mr-2" />
                          Instagram
                        </label>
                        <input
                          type="url"
                          value={formData.socialLinks.instagram}
                          onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                          placeholder="Your Instagram profile URL"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <FaLinkedin className="text-blue-700 mr-2" />
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={formData.socialLinks.linkedin}
                          onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                          placeholder="Your LinkedIn profile URL"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Preferences</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {formData.preferences.notificationsEnabled ?
                          <MdNotifications className="text-cyan-500 mr-3 text-xl" /> :
                          <MdNotificationsOff className="text-gray-400 mr-3 text-xl" />
                        }
                        <div>
                          <div className="text-gray-800 dark:text-white font-medium">Notifications</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formData.preferences.notificationsEnabled ?
                              'Receive email notifications' :
                              'Email notifications are disabled'
                            }
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            id="notification-toggle"
                            checked={formData.preferences.notificationsEnabled}
                            onChange={handleNotificationToggle}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="notification-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.preferences.notificationsEnabled ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                          ></label>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {formData.preferences.privacySettings.profileVisibility === 'public' ?
                          <MdPublic className="text-cyan-500 mr-3 text-xl" /> :
                          <MdVisibilityOff className="text-gray-400 mr-3 text-xl" />
                        }
                        <div>
                          <div className="text-gray-800 dark:text-white font-medium">Profile Visibility</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formData.preferences.privacySettings.profileVisibility === 'public' ?
                              'Your profile is visible to everyone' :
                              'Your profile is private'
                            }
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <select
                          value={formData.preferences.privacySettings.profileVisibility}
                          onChange={(e) => handlePrivacySettingChange('profileVisibility', e.target.value)}
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Options */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Security</h3>

                  <div className="space-y-4">
                    <button
                      onClick={() => navigate('/change-password')}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition duration-200 w-full sm:w-auto text-center"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Toaster />

      {/* Render ShareProfileModal */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profileId={profileData?._id}
        userName={profileData?.fullName || 'User'}
      />

      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #0891b2;
        }
        .toggle-label {
          transition: background-color 0.2s ease;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #0891b2;
        }
      `}</style>
    </HelmetProvider>
  );
};

export default Profile;