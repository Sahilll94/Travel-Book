import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaGithub, FaLinkedin, FaGlobe, FaUser, FaEnvelope, FaCode, FaMapMarkerAlt } from 'react-icons/fa';
import { BiCheckCircle, BiArrowBack } from 'react-icons/bi';
import ContributorsFooter from '../../components/Footer/ContributorsFooter';
import ContributorsNavbar from '../../components/Navbar/ContributorsNavbar';
import ContributorService from '../../services/contributorService';

const ContributorForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    githubUsername: '',
    email: '',
    linkedinProfile: '',
    portfolioWebsite: '',
    contributionDescription: '',
    contributionType: '',
    prLinks: '',
    issuesWorkedOn: '',
    country: '',
    bio: '',
    profilePicture: '',
    consentToDisplay: false
  });

  const contributionTypes = [
    'Bug Fix',
    'Feature',
    'UI/UX Improvement',
    'Documentation',
    'Testing',
    'Performance Optimization',
    'Code Refactoring',
    'Security Enhancement',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'githubUsername', 'contributionDescription', 'contributionType'];
    for (let field of required) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!formData.consentToDisplay) {
      toast.error('Please give consent to display your information');
      return false;
    }

    // Validate GitHub username
    const githubRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubRegex.test(formData.githubUsername)) {
      toast.error('Please enter a valid GitHub username');
      return false;
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Convert PR links from textarea to array
      const prLinksArray = formData.prLinks
        .split('\n')
        .map(link => link.trim())
        .filter(link => link);

      // Send form data directly with the correct field names
      const submitData = {
        ...formData,
        prLinks: prLinksArray
      };

      const data = await ContributorService.addContributor(submitData);

      if (data.success) {
        toast.success('Your contribution has been submitted for review!');
        // Reset form
        setFormData({
          fullName: '',
          githubUsername: '',
          email: '',
          linkedinProfile: '',
          portfolioWebsite: '',
          contributionDescription: '',
          contributionType: '',
          prLinks: '',
          issuesWorkedOn: '',
          country: '',
          bio: '',
          profilePicture: '',
          consentToDisplay: false
        });

        // Navigate to success page or contributors page after a delay
        setTimeout(() => {
          navigate('/contributors');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <ContributorsNavbar />

      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Apply for Contributor Recognition
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have you contributed to Travel Book? Apply to have your name featured on our contributors page
            </p>
          </motion.div>
        </div>
      </header>

      {/* Submission Guidelines */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-8 mb-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Submission Guidelines</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Before You Submit</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>Ensure your contribution has been merged or accepted into the project</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>Provide accurate information about your contribution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>Include relevant links to pull requests, issues, or documentation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>Use a professional profile photo and provide accurate contact information</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Review Process</h3>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  All contributor applications undergo a verification process to ensure accuracy and authenticity:
                </p>
                <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 font-semibold">1.</span>
                    <span>Your submission will be reviewed by our team within 3-5 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 font-semibold">2.</span>
                    <span>We verify your contributions against project history and documentation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 font-semibold">3.</span>
                    <span>You will receive an email notification with the review outcome</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 font-semibold">4.</span>
                    <span>Approved submissions will appear on the contributors page within 24 hours</span>
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Contribution Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Code Contributions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Features, bug fixes, performance improvements, refactoring, testing
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Documentation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    README updates, API docs, tutorials, code comments, user guides
                  </p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Design & UX</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    UI/UX improvements, design assets, accessibility enhancements
                  </p>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                  <h4 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">Community Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Issue reporting, bug triaging, user support, feature suggestions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Basic Details Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FaUser className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Basic Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub Username *
                  </label>
                  <input
                    type="text"
                    name="githubUsername"
                    value={formData.githubUsername}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                    placeholder="github-username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                    placeholder="your@email.com (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country/Region
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                    placeholder="Your country (optional)"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                    placeholder="https://linkedin.com/in/username (optional)"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio/Website URL
                </label>
                <div className="relative">
                  <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="portfolioWebsite"
                    value={formData.portfolioWebsite}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                    placeholder="https://yourwebsite.com (optional)"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                  placeholder="https://image-url.com/photo.jpg (optional - will use GitHub avatar if not provided)"
                />
              </div>
            </div>

            {/* Contribution Info Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FaCode className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Contribution Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contribution Type *
                  </label>
                  <select
                    name="contributionType"
                    value={formData.contributionType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                    required
                  >
                    <option value="">Select contribution type</option>
                    {contributionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issues Worked On
                  </label>
                  <input
                    type="text"
                    name="issuesWorkedOn"
                    value={formData.issuesWorkedOn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white"
                    placeholder="Issue numbers (e.g., #123, #456)"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What did you contribute? *
                </label>
                <textarea
                  name="contributionDescription"
                  value={formData.contributionDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white resize-none"
                  placeholder="Brief description of your contribution..."
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pull Request Links
                </label>
                <textarea
                  name="prLinks"
                  value={formData.prLinks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white resize-none"
                  placeholder="https://github.com/repo/pull/123&#10;https://github.com/repo/pull/456&#10;(One URL per line)"
                />
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Additional Information</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Bio (max 200 characters)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white resize-none"
                  placeholder="Brief description about yourself..."
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.bio.length}/200 characters
                </p>
              </div>
            </div>

            {/* Consent Section */}
            <div className="mb-8">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="consentToDisplay"
                  checked={formData.consentToDisplay}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 text-cyan-600 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600"
                  required
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">I agree to have my name and contribution details displayed on the /contributors page.</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    By checking this box, you consent to displaying your information publicly on our contributors page.
                    This helps us recognize and celebrate your contributions to the project.
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${loading
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <BiCheckCircle className="w-6 h-6 mr-2" />
                  Submit for Review
                </div>
              )}
            </motion.button>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded-lg">
              <p className="text-sm text-cyan-800 dark:text-cyan-200">
                <strong>Note:</strong> Your submission will be reviewed by our team. We'll verify your contributions
                against the GitHub repository and send you an email confirmation once approved. This process helps
                maintain the quality and authenticity of our contributors list.
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      <ContributorsFooter />
    </div>
  );
};

export default ContributorForm;
