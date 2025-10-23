const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const Movie = require('../models/Movie');
const Category = require('../models/Category');
const Feedback = require('../models/Feedback');
const AdSlot = require('../models/AdSlot');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// All routes are protected and require authentication
router.use(protect);

// ========== MOVIE MANAGEMENT ==========

// @route   POST /api/admin/movies
// @desc    Create a new movie
// @access  Private (Admin, Editor)
router.post('/movies', authorize('admin', 'editor'), upload.single('poster'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('releaseYear').isInt({ min: 1900, max: 2100 }).withMessage('Valid release year is required'),
  body('category').isMongoId().withMessage('Valid category is required'),
  validate
], async (req, res) => {
  try {
    // Parse JSON fields if sent as strings (from FormData)
    const movieData = { ...req.body };
    
    if (typeof movieData.genres === 'string') {
      movieData.genres = JSON.parse(movieData.genres);
    }
    if (typeof movieData.cast === 'string' && movieData.cast) {
      // Split comma-separated cast into array
      movieData.cast = movieData.cast.split(',').map(c => c.trim());
    }
    if (typeof movieData.languages === 'string' && movieData.languages) {
      // Check if it's JSON array or comma-separated
      try {
        movieData.languages = JSON.parse(movieData.languages);
      } catch {
        movieData.languages = movieData.languages.split(',').map(l => l.trim());
      }
    }
    if (typeof movieData.screenshots === 'string' && movieData.screenshots) {
      // Check if it's JSON array or comma-separated
      try {
        movieData.screenshots = JSON.parse(movieData.screenshots);
      } catch {
        movieData.screenshots = movieData.screenshots.split(',').map(s => s.trim()).filter(s => s);
      }
    }
    if (typeof movieData.downloadLinks === 'string') {
      movieData.downloadLinks = JSON.parse(movieData.downloadLinks);
    }
    
    // Handle streamingPlatforms array
    if (movieData['streamingPlatforms[]']) {
      // If sent as streamingPlatforms[], convert to streamingPlatforms
      movieData.streamingPlatforms = Array.isArray(movieData['streamingPlatforms[]']) 
        ? movieData['streamingPlatforms[]'] 
        : [movieData['streamingPlatforms[]']];
      delete movieData['streamingPlatforms[]'];
    } else if (typeof movieData.streamingPlatforms === 'string') {
      try {
        movieData.streamingPlatforms = JSON.parse(movieData.streamingPlatforms);
      } catch {
        movieData.streamingPlatforms = [];
      }
    }
    
    // Add poster path if uploaded or use posterUrl
    if (req.file) {
      movieData.poster = `/uploads/${req.file.filename}`;
    } else if (movieData.posterUrl && !movieData.poster) {
      movieData.poster = movieData.posterUrl;
    }
    
    // Validate genres
    if (!movieData.genres || movieData.genres.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one genre is required'
      });
    }
    
    const movie = await Movie.create(movieData);
    
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating movie'
    });
  }
});

// @route   PUT /api/admin/movies/:id
// @desc    Update a movie
// @access  Private (Admin, Editor)
router.put('/movies/:id', authorize('admin', 'editor'), upload.single('poster'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.poster = `/uploads/${req.file.filename}`;
    }
    
    // Parse JSON fields if sent as strings
    if (typeof updateData.genres === 'string') {
      updateData.genres = JSON.parse(updateData.genres);
    }
    if (typeof updateData.cast === 'string' && updateData.cast) {
      // Check if it's JSON array or comma-separated
      try {
        updateData.cast = JSON.parse(updateData.cast);
      } catch {
        updateData.cast = updateData.cast.split(',').map(c => c.trim());
      }
    }
    if (typeof updateData.languages === 'string' && updateData.languages) {
      // Check if it's JSON array or comma-separated
      try {
        updateData.languages = JSON.parse(updateData.languages);
      } catch {
        updateData.languages = updateData.languages.split(',').map(l => l.trim());
      }
    }
    if (typeof updateData.screenshots === 'string' && updateData.screenshots) {
      // Check if it's JSON array or comma-separated
      try {
        updateData.screenshots = JSON.parse(updateData.screenshots);
      } catch {
        updateData.screenshots = updateData.screenshots.split(',').map(s => s.trim()).filter(s => s);
      }
    }
    if (typeof updateData.downloadLinks === 'string') {
      updateData.downloadLinks = JSON.parse(updateData.downloadLinks);
    }
    
    // Handle streamingPlatforms array
    if (updateData['streamingPlatforms[]']) {
      updateData.streamingPlatforms = Array.isArray(updateData['streamingPlatforms[]']) 
        ? updateData['streamingPlatforms[]'] 
        : [updateData['streamingPlatforms[]']];
      delete updateData['streamingPlatforms[]'];
    } else if (typeof updateData.streamingPlatforms === 'string') {
      try {
        updateData.streamingPlatforms = JSON.parse(updateData.streamingPlatforms);
      } catch {
        updateData.streamingPlatforms = [];
      }
    }
    
    // Handle posterUrl
    if (updateData.posterUrl && !req.file) {
      updateData.poster = updateData.posterUrl;
    }
    
    // Update the movie document
    Object.assign(movie, updateData);
    await movie.save();
    
    // Populate category for response
    await movie.populate('category', 'name slug');
    
    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    console.error(error);
    
    // Handle duplicate key error (slug conflict)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A movie with this title already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating movie'
    });
  }
});

// @route   DELETE /api/admin/movies/:id
// @desc    Delete a movie
// @access  Private (Admin)
router.delete('/movies/:id', authorize('admin'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    await Movie.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting movie'
    });
  }
});

// @route   GET /api/admin/movies
// @desc    Get all movies (including drafts)
// @access  Private (Admin, Editor, Moderator)
router.get('/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    const movies = await Movie.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
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
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/movies/:id
// @desc    Get single movie by ID
// @access  Private (Admin, Editor, Moderator)
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('category', 'name slug');
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
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

// ========== CATEGORY MANAGEMENT ==========

// @route   POST /api/admin/categories
// @desc    Create a new category
// @access  Private (Admin)
router.post('/categories', authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  validate
], async (req, res) => {
  try {
    // Generate slug from name
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    const category = new Category({
      ...req.body,
      slug
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? 'Category already exists' : 'Server error while creating category'
    });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update a category
// @access  Private (Admin)
router.put('/categories/:id', authorize('admin'), async (req, res) => {
  try {
    // Generate slug if name is being updated
    if (req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete a category
// @access  Private (Admin)
router.delete('/categories/:id', authorize('admin'), async (req, res) => {
  try {
    // Check if category has movies
    const moviesCount = await Movie.countDocuments({ category: req.params.id });
    
    if (moviesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${moviesCount} movies associated with it.`
      });
    }
    
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
});

// @route   GET /api/admin/categories
// @desc    Get all categories with movie count
// @access  Private
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    
    // Get movie count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const movieCount = await Movie.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          movieCount
        };
      })
    );
    
    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== FEEDBACK MANAGEMENT ==========

// @route   GET /api/admin/feedback
// @desc    Get all feedback
// @access  Private (Admin, Moderator)
router.get('/feedback', authorize('admin', 'moderator'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const feedback = await Feedback.find(query)
      .populate('movie', 'title slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    const total = await Feedback.countDocuments(query);
    
    res.json({
      success: true,
      data: feedback,
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
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/feedback/:id/status
// @desc    Update feedback status
// @access  Private (Admin, Moderator)
router.put('/feedback/:id/status', authorize('admin', 'moderator'), [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  validate
], async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Feedback status updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/feedback/:id
// @desc    Delete feedback
// @access  Private (Admin, Moderator)
router.delete('/feedback/:id', authorize('admin', 'moderator'), async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== AD SLOT MANAGEMENT ==========

// @route   GET /api/admin/ad-slots
// @desc    Get all ad slots
// @access  Private (Admin)
router.get('/ad-slots', authorize('admin'), async (req, res) => {
  try {
    const adSlots = await AdSlot.find().sort({ order: 1 });
    
    res.json({
      success: true,
      data: adSlots
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/ad-slots
// @desc    Create an ad slot
// @access  Private (Admin)
router.post('/ad-slots', authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('adCode').notEmpty().withMessage('Ad code is required'),
  validate
], async (req, res) => {
  try {
    const adSlot = await AdSlot.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Ad slot created successfully',
      data: adSlot
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/ad-slots/:id
// @desc    Update an ad slot
// @access  Private (Admin)
router.put('/ad-slots/:id', authorize('admin'), async (req, res) => {
  try {
    const adSlot = await AdSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!adSlot) {
      return res.status(404).json({
        success: false,
        message: 'Ad slot not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Ad slot updated successfully',
      data: adSlot
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/ad-slots/:id
// @desc    Delete an ad slot
// @access  Private (Admin)
router.delete('/ad-slots/:id', authorize('admin'), async (req, res) => {
  try {
    const adSlot = await AdSlot.findByIdAndDelete(req.params.id);
    
    if (!adSlot) {
      return res.status(404).json({
        success: false,
        message: 'Ad slot not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Ad slot deleted successfully'
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
