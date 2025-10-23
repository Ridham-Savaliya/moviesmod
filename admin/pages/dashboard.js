import { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { FiFilm, FiFolder, FiMessageSquare, FiEye, FiTrendingUp } from 'react-icons/fi';
import { analyticsAPI } from '@/lib/api';
import { formatNumber, formatDate } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Movies',
      value: stats?.overview?.totalMovies || 0,
      icon: FiFilm,
      color: 'bg-blue-500',
    },
    {
      title: 'Published',
      value: stats?.overview?.publishedMovies || 0,
      icon: FiTrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Categories',
      value: stats?.overview?.totalCategories || 0,
      icon: FiFolder,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Views',
      value: formatNumber(stats?.overview?.totalViews || 0),
      icon: FiEye,
      color: 'bg-orange-500',
    },
    {
      title: 'Pending Feedback',
      value: stats?.overview?.pendingFeedback || 0,
      icon: FiMessageSquare,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Viewed Movies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Most Viewed Movies</h2>
            <div className="space-y-3">
              {stats?.mostViewedMovies?.slice(0, 5).map((movie, index) => (
                <div key={movie._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-semibold">{index + 1}</span>
                    <div>
                      <p className="text-gray-800 font-medium">{movie.title}</p>
                      <p className="text-gray-500 text-sm">{movie.category?.name}</p>
                    </div>
                  </div>
                  <span className="text-primary-500 font-semibold">
                    {formatNumber(movie.views)} views
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Movies by Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Movies by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.moviesByCategory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Movies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Movies</h2>
            <div className="space-y-3">
              {stats?.recentMovies?.map((movie) => (
                <div key={movie._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">{movie.title}</p>
                    <p className="text-gray-500 text-sm">{formatDate(movie.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    movie.status === 'published' ? 'bg-green-100 text-green-800' :
                    movie.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {movie.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Feedback</h2>
            <div className="space-y-3">
              {stats?.recentFeedback?.map((feedback) => (
                <div key={feedback._id} className="border-b border-gray-200 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-800 font-medium">{feedback.name}</p>
                    <span className="text-yellow-500">{'★'.repeat(feedback.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{feedback.movie?.title}</p>
                  <p className="text-gray-500 text-xs">{formatDate(feedback.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
