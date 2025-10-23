const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Feedback = require('../models/Feedback');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);
router.use(authorize('admin', 'editor'));

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin, Editor)
router.get('/dashboard', async (req, res) => {
  try {
    // Total counts
    const totalMovies = await Movie.countDocuments();
    const publishedMovies = await Movie.countDocuments({ status: 'published' });
    const draftMovies = await Movie.countDocuments({ status: 'draft' });
    const totalCategories = await Category.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });
    
    // Total views
    const viewsResult = await Movie.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;
    
    // Most viewed movies
    const mostViewedMovies = await Movie.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views poster slug')
      .populate('category', 'name');
    
    // Recent movies
    const recentMovies = await Movie.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt poster slug')
      .populate('category', 'name');
    
    // Movies by category
    const moviesByCategory = await Movie.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate category names
    const categoriesIds = moviesByCategory.map(item => item._id);
    const categories = await Category.find({ _id: { $in: categoriesIds } });
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = cat.name;
    });
    
    const moviesByCategoryWithNames = moviesByCategory.map(item => ({
      category: categoryMap[item._id.toString()] || 'Unknown',
      count: item.count
    }));
    
    // Recent feedback
    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('movie', 'title slug')
      .select('name rating comment status createdAt');
    
    // Movies added per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const moviesPerMonth = await Movie.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Movies by genre
    const moviesByGenre = await Movie.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Movies by quality
    const moviesByQuality = await Movie.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$quality', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Movies by type (movie vs series)
    const moviesByType = await Movie.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Average rating by category
    const avgRatingByCategory = await Feedback.aggregate([
      { $match: { status: 'approved' } },
      { $lookup: { from: 'movies', localField: 'movie', foreignField: '_id', as: 'movieData' } },
      { $unwind: '$movieData' },
      { $group: { _id: '$movieData.category', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1 } }
    ]);
    
    // Trending movies (most views in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const trendingMovies = await Movie.find({
      status: 'published',
      updatedAt: { $gte: sevenDaysAgo }
    })
      .sort({ views: -1 })
      .limit(10)
      .select('title views poster slug')
      .populate('category', 'name');
    
    // Growth metrics (compare with previous period)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const moviesLastMonth = await Movie.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const moviesPreviousMonth = await Movie.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });
    
    const feedbackLastMonth = await Feedback.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const feedbackPreviousMonth = await Feedback.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });
    
    const moviesGrowth = moviesPreviousMonth > 0 
      ? ((moviesLastMonth - moviesPreviousMonth) / moviesPreviousMonth * 100).toFixed(1)
      : 100;
    const feedbackGrowth = feedbackPreviousMonth > 0
      ? ((feedbackLastMonth - feedbackPreviousMonth) / feedbackPreviousMonth * 100).toFixed(1)
      : 100;
    
    res.json({
      success: true,
      data: {
        overview: {
          totalMovies,
          publishedMovies,
          draftMovies,
          totalCategories,
          totalFeedback,
          pendingFeedback,
          totalViews,
          moviesLastMonth,
          feedbackLastMonth,
          moviesGrowth: parseFloat(moviesGrowth),
          feedbackGrowth: parseFloat(feedbackGrowth)
        },
        mostViewedMovies,
        recentMovies,
        trendingMovies,
        moviesByCategory: moviesByCategoryWithNames,
        moviesByGenre: moviesByGenre.map(item => ({ genre: item._id, count: item.count })),
        moviesByQuality: moviesByQuality.map(item => ({ quality: item._id, count: item.count })),
        moviesByType: moviesByType.map(item => ({ type: item._id, count: item.count })),
        recentFeedback,
        moviesPerMonth
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/analytics/movies/:id
// @desc    Get analytics for a specific movie
// @access  Private (Admin, Editor)
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('category', 'name');
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    // Feedback statistics
    const totalFeedback = await Feedback.countDocuments({ movie: movie._id });
    const approvedFeedback = await Feedback.countDocuments({ 
      movie: movie._id, 
      status: 'approved' 
    });
    
    const avgRating = await Feedback.aggregate([
      { $match: { movie: movie._id, status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    const averageRating = avgRating.length > 0 ? avgRating[0].avgRating : 0;
    
    res.json({
      success: true,
      data: {
        movie,
        analytics: {
          views: movie.views,
          totalFeedback,
          approvedFeedback,
          averageRating: averageRating.toFixed(1)
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
