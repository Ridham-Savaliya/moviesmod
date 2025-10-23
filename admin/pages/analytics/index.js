import { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { FiTrendingUp, FiTrendingDown, FiFilm, FiStar, FiMessageSquare, FiEye, FiFolder } from 'react-icons/fi';
import { analyticsAPI } from '@/lib/api';
import { formatNumber, formatDate } from '@/lib/utils';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Analytics">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load analytics data</p>
        </div>
      </Layout>
    );
  }

  const { overview, mostViewedMovies, trendingMovies, moviesByCategory, moviesByGenre, moviesByQuality, moviesByType, recentFeedback, moviesPerMonth } = data;

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trendValue >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trendValue >= 0 ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
            <span className="font-semibold">{Math.abs(trendValue)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{formatNumber(value)}</p>
    </div>
  );

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  return (
    <Layout title="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights and statistics</p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Movies"
            value={overview.totalMovies}
            icon={FiFilm}
            trend
            trendValue={overview.moviesGrowth}
            color="primary"
          />
          <StatCard
            title="Published Movies"
            value={overview.publishedMovies}
            icon={FiFilm}
            color="green"
          />
          <StatCard
            title="Total Views"
            value={overview.totalViews}
            icon={FiEye}
            color="blue"
          />
          <StatCard
            title="Total Feedback"
            value={overview.totalFeedback}
            icon={FiMessageSquare}
            trend
            trendValue={overview.feedbackGrowth}
            color="purple"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Draft Movies"
            value={overview.draftMovies}
            icon={FiFilm}
            color="yellow"
          />
          <StatCard
            title="Categories"
            value={overview.totalCategories}
            icon={FiFolder}
            color="indigo"
          />
          <StatCard
            title="Pending Feedback"
            value={overview.pendingFeedback}
            icon={FiMessageSquare}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Movies by Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Movies by Category</h2>
            <div className="space-y-3">
              {moviesByCategory.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-medium text-gray-700 w-32 truncate">{item.category}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(item.count / moviesByCategory[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 ml-3">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Movies by Genre */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Top Genres</h2>
            <div className="space-y-3">
              {moviesByGenre.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-medium text-gray-700 w-32 truncate">{item.genre}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(item.count / moviesByGenre[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 ml-3">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality & Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Movies by Quality */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quality Distribution</h2>
            <div className="grid grid-cols-2 gap-4">
              {moviesByQuality.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">{item.count}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.quality}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Movies by Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Content Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {moviesByType.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{item.count}</p>
                  <p className="text-sm text-gray-600 mt-1 capitalize">{item.type}s</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Added Per Month */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Movies Added (Last 6 Months)</h2>
          <div className="flex items-end justify-between space-x-2 h-64">
            {moviesPerMonth.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center justify-end">
                <div className="text-xs font-semibold text-gray-700 mb-2">{item.count}</div>
                <div
                  className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-colors"
                  style={{ height: `${(item.count / Math.max(...moviesPerMonth.map(m => m.count))) * 100}%`, minHeight: '20px' }}
                />
                <div className="text-xs text-gray-600 mt-2">
                  {getMonthName(item._id.month)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed & Trending Movies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Viewed Movies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Most Viewed Movies</h2>
            <div className="space-y-3">
              {mostViewedMovies.map((movie, index) => (
                <div key={movie._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                  <div className="relative w-12 h-16 flex-shrink-0">
                    <Image
                      src={getImageUrl(movie.poster)}
                      alt={movie.title}
                      fill
                      className="object-cover rounded"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{movie.title}</p>
                    <p className="text-xs text-gray-500">{movie.category?.name}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-primary-600">
                    <FiEye size={14} />
                    <span className="text-sm font-semibold">{formatNumber(movie.views)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Movies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Trending (Last 7 Days)</h2>
            <div className="space-y-3">
              {trendingMovies.slice(0, 5).map((movie, index) => (
                <div key={movie._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-lg font-bold text-green-400 w-6">{index + 1}</span>
                  <div className="relative w-12 h-16 flex-shrink-0">
                    <Image
                      src={getImageUrl(movie.poster)}
                      alt={movie.title}
                      fill
                      className="object-cover rounded"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{movie.title}</p>
                    <p className="text-xs text-gray-500">{movie.category?.name}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <FiTrendingUp size={14} />
                    <span className="text-sm font-semibold">{formatNumber(movie.views)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Feedback</h2>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback._id} className="border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <p className="font-medium text-gray-800">{feedback.name}</p>
                    <div className="flex items-center space-x-1">
                      <FiStar className="text-yellow-400" size={14} />
                      <span className="text-sm font-semibold text-gray-700">{feedback.rating}/5</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    feedback.status === 'approved' ? 'bg-green-100 text-green-800' :
                    feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {feedback.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{feedback.comment}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Movie: {feedback.movie?.title}</span>
                  <span>{formatDate(feedback.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
