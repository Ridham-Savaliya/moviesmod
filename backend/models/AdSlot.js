const mongoose = require('mongoose');

const adSlotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  position: {
    type: String,
    required: true,
    enum: ['header', 'sidebar', 'footer', 'between-movies', 'movie-detail-top', 'movie-detail-bottom']
  },
  adCode: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dimensions: {
    width: String,
    height: String
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdSlot', adSlotSchema);
