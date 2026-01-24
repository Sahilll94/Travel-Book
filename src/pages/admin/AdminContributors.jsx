import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FaCheck, FaTimes, FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaTrash, FaSearch, FaFilter, FaUserShield, FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt, FaUsers, FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { BiRefresh, BiDownload } from 'react-icons/bi';
import { useAuth } from '../../utils/AuthContext';
import ContributorsNavbar from '../../components/Navbar/ContributorsNavbar';
import AuthService from '../../services/authService';
import ContributorService from '../../services/contributorService';

const AdminContributors = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('submittedAt'); // submittedAt, fullName, contributionType
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Function to get user info directly from API (same as Home component)
  const getUserInfo = async () => {
    try {
      const data = await AuthService.getUser();
      setUserInfo(data.user);
      console.log('User info from API:', data.user);
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  };

  // Check if user is admin - check both currentUser and userInfo
  const isAdmin = (currentUser?.email === 'sahilk64555@gmail.com') || (userInfo?.email === 'sahilk64555@gmail.com');

  useEffect(() => {
    console.log('=== ADMIN DEBUG INFO ===');
    console.log('Environment mode:', import.meta.env.MODE);
    console.log('Is development:', import.meta.env.DEV);
    console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('Use mock data setting:', import.meta.env.VITE_USE_MOCK_DATA);
    console.log('Current user from context:', currentUser);
    console.log('Auth loading:', authLoading);
    console.log('User info from API:', userInfo);
    console.log('Is admin (context):', currentUser?.email === 'sahilk64555@gmail.com');
    console.log('Is admin (API):', userInfo?.email === 'sahilk64555@gmail.com');
    console.log('Is admin (combined):', isAdmin);
    console.log('========================');

    if (!authLoading) {
      getUserInfo();
    }
  }, [authLoading, currentUser]);

  useEffect(() => {
    if (userInfo && isAdmin) {
      fetchContributors();
    }
  }, [userInfo, isAdmin]);

  const fetchContributors = async () => {
    try {
      setLoading(true);
      const data = await ContributorService.getAdminContributors();
      console.log('Fetched contributors:', data);
      setContributors(data.contributors || []);
    } catch (error) {
      console.error('Error fetching contributors:', error);
      toast.error('Failed to fetch contributors');
    } finally {
      setLoading(false);
    }
  };

  const updateContributorStatus = async (contributorId, status) => {
    try {
      setProcessing({ ...processing, [contributorId]: true });

      const data = await ContributorService.updateContributorStatus(contributorId, {
        status,
        adminNotes: selectedContributor === contributorId ? adminNotes : undefined
      });

      if (data.success) {
        toast.success(`Contributor ${status} successfully!`);
        fetchContributors();
        setAdminNotes('');
        setSelectedContributor(null);
      }
    } catch (error) {
      console.error('Error updating contributor status:', error);
      toast.error(error.response?.data?.message || 'Failed to update contributor status');
    } finally {
      setProcessing({ ...processing, [contributorId]: false });
    }
  };

  const exportContributors = async () => {
    try {
      // Get all contributors for export (no pagination)
      const data_api = await ContributorService.getAdminContributors({ limit: 1000 });
      const data = data_api.contributors || [];

      if (data.length === 0) {
        toast.error('No contributors to export');
        return;
      }

      // Convert to CSV format
      const headers = [
        'ID',
        'Full Name',
        'GitHub Username',
        'Email',
        'Country',
        'Contribution Type',
        'Status',
        'Submitted Date',
        'LinkedIn',
        'Portfolio',
        'Contribution Description',
        'Bio'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(contributor => [
          contributor._id,
          `"${contributor.fullName}"`,
          contributor.githubUsername,
          contributor.email || '',
          contributor.country || '',
          contributor.contributionType,
          contributor.status,
          new Date(contributor.submittedAt).toLocaleDateString(),
          contributor.linkedinProfile || '',
          contributor.portfolioWebsite || '',
          `"${contributor.contributionDescription.replace(/"/g, '""')}"`,
          `"${(contributor.bio || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `contributors-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Contributors exported successfully!');
    } catch (error) {
      console.error('Error exporting contributors:', error);
      toast.error('Failed to export contributors');
    }
  };

  const deleteContributor = async (contributorId) => {
    if (!window.confirm('Are you sure you want to delete this contributor? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing({ ...processing, [contributorId]: true });

      const data = await ContributorService.deleteContributor(contributorId);

      if (data.success) {
        toast.success('Contributor deleted successfully!');
        fetchContributors();
      }
    } catch (error) {
      console.error('Error deleting contributor:', error);
      toast.error(error.response?.data?.message || 'Failed to delete contributor');
    } finally {
      setProcessing({ ...processing, [contributorId]: false });
    }
  };

  // Show loading while auth is being checked or user info is being fetched
  if (authLoading || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have permission to access this page.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
            <p>Current user (context): {currentUser?.email || 'Not logged in'}</p>
            <p>Current user (API): {userInfo?.email || 'Not loaded'}</p>
            <p>Required: sahilk64555@gmail.com</p>
          </div>
        </div>
      </div>
    );
  }

  // Compute filtered and sorted contributors
  const filteredContributors = contributors
    .filter(contributor => {
      // Apply status filter
      if (filter !== 'all' && contributor.status !== filter) {
        return false;
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          contributor.fullName.toLowerCase().includes(query) ||
          contributor.githubUsername.toLowerCase().includes(query) ||
          contributor.email?.toLowerCase().includes(query) ||
          contributor.contributionType.toLowerCase().includes(query) ||
          contributor.country?.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'fullName':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'contributionType':
          aValue = a.contributionType.toLowerCase();
          bValue = b.contributionType.toLowerCase();
          break;
        case 'submittedAt':
        default:
          aValue = new Date(a.submittedAt);
          bValue = new Date(b.submittedAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Calculate stats for filtered contributors
  const stats = {
    total: filteredContributors.length,
    pending: filteredContributors.filter(c => c.status === 'pending').length,
    approved: filteredContributors.filter(c => c.status === 'approved').length,
    rejected: filteredContributors.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ContributorsNavbar currentPage="admin" />

      {/* Enhanced Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                <FaUserShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Contributors Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Review and manage contributor applications
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchContributors}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <BiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={exportContributors}
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <BiDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FaUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <FaClipboardList className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <FaTimesCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, username, email, type, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400 w-4 h-4" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="submittedAt">Sort by Date</option>
                <option value="fullName">Sort by Name</option>
                <option value="contributionType">Sort by Type</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                title={`Currently: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contributors List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading contributors...</p>
          </div>
        ) : (
          <>
            {filteredContributors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <FaUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No contributors found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? 'Try adjusting your search query.' : `No contributors found for status: ${filter}`}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {filteredContributors.map((contributor, index) => (
                  <motion.div
                    key={contributor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Contributor Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src={contributor.profilePicture || `https://github.com/${contributor.githubUsername}.png`}
                            alt={contributor.fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {contributor.fullName}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${contributor.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                  : contributor.status === 'approved'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                }`}>
                                {contributor.status.charAt(0).toUpperCase() + contributor.status.slice(1)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <FaGithub className="w-4 h-4" />
                                <span>@{contributor.githubUsername}</span>
                              </div>
                              {contributor.country && (
                                <div className="flex items-center space-x-1">
                                  <FaMapMarkerAlt className="w-4 h-4" />
                                  <span>{contributor.country}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <FaCalendarAlt className="w-4 h-4" />
                                <span>{new Date(contributor.submittedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">ID: {contributor._id.slice(-6)}</div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={`https://github.com/${contributor.githubUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="View GitHub Profile"
                            >
                              <FaGithub className="w-4 h-4" />
                            </a>
                            {contributor.linkedinProfile && (
                              <a
                                href={contributor.linkedinProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="View LinkedIn Profile"
                              >
                                <FaLinkedin className="w-4 h-4" />
                              </a>
                            )}
                            {contributor.portfolioWebsite && (
                              <a
                                href={contributor.portfolioWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="View Portfolio"
                              >
                                <FaGlobe className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contributor Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Contribution Details</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                              <span className="ml-2 px-2 py-1 bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300 text-sm rounded">
                                {contributor.contributionType}
                              </span>
                            </div>

                            <div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Description:</span>
                              <p className="mt-1 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm">
                                {contributor.contributionDescription}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact Information</h4>
                          <div className="space-y-2">
                            {contributor.email && (
                              <div className="flex items-center space-x-2 text-sm">
                                <FaEnvelope className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">{contributor.email}</span>
                              </div>
                            )}

                            {contributor.bio && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Bio:</span>
                                <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">{contributor.bio}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pull Requests */}
                      {contributor.prLinks && contributor.prLinks.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Pull Requests</h4>
                          <div className="grid gap-2">
                            {contributor.prLinks.map((pr, index) => (
                              <a
                                key={index}
                                href={pr}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
                              >
                                <FaExternalLinkAlt className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                                <span className="text-cyan-600 dark:text-cyan-400 hover:underline truncate">
                                  {pr}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {contributor._id}
                        </div>

                        <div className="flex items-center space-x-3">
                          {contributor.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateContributorStatus(contributor._id, 'approved')}
                                disabled={processing[contributor._id]}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                              >
                                <FaCheck className="w-4 h-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => updateContributorStatus(contributor._id, 'rejected')}
                                disabled={processing[contributor._id]}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                              >
                                <FaTimes className="w-4 h-4" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {contributor.status !== 'pending' && (
                            <button
                              onClick={() => updateContributorStatus(contributor._id, 'pending')}
                              disabled={processing[contributor._id]}
                              className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                            >
                              <FaClock className="w-4 h-4" />
                              <span>Set Pending</span>
                            </button>
                          )}

                          <button
                            onClick={() => deleteContributor(contributor._id)}
                            disabled={processing[contributor._id]}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            <FaTrash className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminContributors;
