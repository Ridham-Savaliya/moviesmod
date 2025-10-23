const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Category = require('../models/Category');

// @route   GET /api/movies
// @desc    Get all movies with pagination, filtering, and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { status: 'published' };
    
    // Filter by category
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) query.category = category._id;
    }
    
    // Filter by genre
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    
    // Filter by year
    if (req.query.year) {
      query.releaseYear = parseInt(req.query.year);
    }
    
    // Filter by quality
    if (req.query.quality) {
      query.quality = req.query.quality;
    }
    
    // Featured movies
    if (req.query.featured === 'true') {
      query.featured = true;
    }
    
    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sort === 'views') {
      sort = { views: -1 };
    } else if (req.query.sort === 'rating') {
      sort = { rating: -1 };
    } else if (req.query.sort === 'year') {
      sort = { releaseYear: -1 };
    } else if (req.query.sort === 'title') {
      sort = { title: 1 };
    }
    
    // Execute query
    const movies = await Movie.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select('-__v');
    
    const total = await Movie.countDocuments(query);
    
    res.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching movies'
    });
  }
});

// @route   GET /api/movies/search-suggestions
// @desc    Get search suggestions (autocomplete)
// @access  Public
router.get('/search-suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const movies = await Movie.find({
      status: 'published',
      title: { $regex: q, $options: 'i' }
    })
    .select('title slug poster')
    .limit(10);
    
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/movies/trending
// @desc    Get trending movies (most viewed in last 7 days)
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const movies = await Movie.find({
      status: 'published',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    .populate('category', 'name slug')
    .sort({ views: -1 })
    .limit(limit)
    .select('-__v');
    
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/movies/:slug
// @desc    Get single movie by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const movie = await Movie.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).populate('category', 'name slug');
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    // Increment views (async, don't wait for it)
    movie.incrementViews().catch(err => console.error('Error incrementing views:', err));
    
    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/movies/:slug/related
// @desc    Get related movies based on genre and category
// @access  Public
router.get('/:slug/related', async (req, res) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug });
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    const limit = parseInt(req.query.limit) || 6;
    
    const relatedMovies = await Movie.find({
      _id: { $ne: movie._id },
      status: 'published',
      $or: [
        { category: movie.category },
        { genres: { $in: movie.genres } }
      ]
    })
    .populate('category', 'name slug')
    .limit(limit)
    .select('-__v');
    
    res.json({
      success: true,
      data: relatedMovies
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
