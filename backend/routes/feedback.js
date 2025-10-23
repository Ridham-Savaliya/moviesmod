const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Feedback = require('../models/Feedback');
const Movie = require('../models/Movie');
const { validate } = require('../middleware/validation');

// @route   POST /api/feedback
// @desc    Submit feedback for a movie
// @access  Public
router.post('/', [
  body('movie').isMongoId().withMessage('Invalid movie ID'),
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email').isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  validate
], async (req, res) => {
  try {
    const { movie, name, email, rating, comment } = req.body;
    
    // Check if movie exists
    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    // Create feedback
    const feedback = await Feedback.create({
      movie,
      name,
      email,
      rating,
      comment,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. It will be visible after approval.',
      data: feedback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting feedback'
    });
  }
});

// @route   GET /api/feedback/:movieId
// @desc    Get approved feedback for a movie
// @access  Public
router.get('/:movieId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const feedback = await Feedback.find({
      movie: req.params.movieId,
      status: 'approved'
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-ipAddress -userAgent -__v');
    
    const total = await Feedback.countDocuments({
      movie: req.params.movieId,
      status: 'approved'
    });
    
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
      message: 'Server error while fetching feedback'
    });
  }
});

module.exports = router;
