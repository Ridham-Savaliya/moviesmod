const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Compound index for efficient queries
feedbackSchema.index({ movie: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
