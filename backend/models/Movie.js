const mongoose = require('mongoose');

const downloadLinkSchema = new mongoose.Schema({
  quality: {
    type: String,
    required: true,
    enum: ['360p', '480p', '720p', '1080p', '4K']
  },
  size: String,
  url: {
    type: String,
    required: true
  }
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  posterUrl: String, // URL for poster instead of upload
  thumbnail: String,
  trailerUrl: String,
  releaseYear: {
    type: Number,
    required: true,
    index: true
  },
  duration: String,
  type: {
    type: String,
    enum: ['movie', 'series'],
    default: 'movie'
  },
  totalSeasons: {
    type: Number,
    default: 0
  },
  totalEpisodes: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  imdbRating: Number,
  genres: [{
    type: String,
    required: true,
    index: true
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  cast: [String],
  director: String,
  languages: [{
    type: String,
    default: []
  }],
  quality: {
    type: String,
    enum: ['360p', '480p', '720p', '1080p', '1440p', '4K', 'CAM', 'HDRip', 'BluRay', 'WEB-DL'],
    default: '1080p'
  },
  downloadLinks: [downloadLinkSchema],
  streamingPlatforms: [{
    type: String,
    enum: ['netflix', 'prime', 'disney', 'apple', 'hotstar', 'zee5', 'sonyliv', 'youtube'],
    default: []
  }],
  screenshots: [{
    type: String,
    default: []
  }],
  views: {
    type: Number,
    default: 0,
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published',
    index: true
  },
  tags: [String],
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String]
}, {
  timestamps: true
});

// Text Search Index
movieSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Pre-validate middleware to generate slug before required validation
movieSchema.pre('validate', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Method to increment views
movieSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Movie', movieSchema);
