import React, { useState, useEffect } from 'react';
import StoryService from '../../services/storyService';
import { Toaster, toast } from 'sonner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { MdClose } from 'react-icons/md';
import { getRandomColor } from '../../utils/helper';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const TravelAnalytics = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStories: 0,
    favoriteStories: 0,
    mostVisitedLocations: [],
    storiesByMonth: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await StoryService.getAllStories();

        if (data && data.stories) {
          const stories = data.stories;

          // Calculate total stories
          const totalStories = stories.length;

          // Calculate favorite stories
          const favoriteStories = stories.filter(story => story.isFavourite).length;

          // Calculate location frequency
          const locationCounts = {};
          stories.forEach(story => {
            if (Array.isArray(story.visitedLocation)) {
              story.visitedLocation.forEach(location => {
                locationCounts[location] = (locationCounts[location] || 0) + 1;
              });
            } else if (typeof story.visitedLocation === 'string') {
              // Handle case where visitedLocation might be a string (legacy data)
              locationCounts[story.visitedLocation] = (locationCounts[story.visitedLocation] || 0) + 1;
            }
          });

          // Sort locations by frequency
          const mostVisitedLocations = Object.entries(locationCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5) // Get top 5 locations
            .map(([location, count]) => ({ location, count }));

          // Calculate stories by month
          const monthCounts = {};
          stories.forEach(story => {
            const date = new Date(story.createdOn);
            const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
          });

          // Convert to array for chart
          const storiesByMonth = Object.entries(monthCounts)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => {
              const [aMonth, aYear] = a.month.split(' ');
              const [bMonth, bYear] = b.month.split(' ');
              return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
            })
            .slice(-6); // Get last 6 months

          setStats({
            totalStories,
            favoriteStories,
            mostVisitedLocations,
            storiesByMonth
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Prepare data for pie chart
  const locationData = {
    labels: stats.mostVisitedLocations.map(item => item.location),
    datasets: [
      {
        data: stats.mostVisitedLocations.map(item => item.count),
        backgroundColor: stats.mostVisitedLocations.map(() => getRandomColor()),
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for bar chart
  const monthlyData = {
    labels: stats.storiesByMonth.map(item => item.month),
    datasets: [
      {
        label: 'Stories Created',
        data: stats.storiesByMonth.map(item => item.count),
        backgroundColor: '#05B6D3',
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Travel Analytics</h2>
          <button onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg overflow-y-auto max-h-[80vh]">
      <Toaster position="top-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Travel Analytics</h2>
        <button onClick={onClose}>
          <MdClose className="text-xl text-slate-400" />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-cyan-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Total Stories</h3>
          <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{stats.totalStories}</p>
        </div>
        <div className="bg-cyan-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Favorite Stories</h3>
          <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{stats.favoriteStories}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Most visited locations */}
        {stats.mostVisitedLocations.length > 0 ? (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Most Visited Locations</h3>
            <div className="h-64">
              <Pie data={locationData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-300">No location data available</p>
          </div>
        )}

        {/* Monthly story creation */}
        {stats.storiesByMonth.length > 0 ? (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Stories Created (Last 6 Months)</h3>
            <div className="h-64">
              <Bar
                data={monthlyData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : undefined
                      }
                    },
                    x: {
                      ticks: {
                        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : undefined
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-300">No monthly data available</p>
          </div>
        )}
      </div>

      {/* Travel Tips */}
      <div className="mt-8 bg-cyan-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Travel Insights</h3>
        {stats.totalStories === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Start creating travel stories to see your insights!</p>
        ) : (
          <div className="text-gray-600 dark:text-gray-300">
            <p className="mb-2">
              {stats.favoriteStories > 0
                ? `You have marked ${stats.favoriteStories} stories as favorites (${Math.round(stats.favoriteStories / stats.totalStories * 100)}% of your stories).`
                : "You haven't marked any stories as favorites yet."}
            </p>
            {stats.mostVisitedLocations.length > 0 && (
              <p>Your most visited location is {stats.mostVisitedLocations[0].location} with {stats.mostVisitedLocations[0].count} visits.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelAnalytics;