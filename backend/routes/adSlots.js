const express = require('express');
const router = express.Router();
const AdSlot = require('../models/AdSlot');

// @route   GET /api/ad-slots
// @desc    Get active ad slots (public, no auth required)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const query = { isActive: true };
    
    // Optional filter by position
    if (req.query.position) {
      query.position = req.query.position;
    }
    
    const adSlots = await AdSlot.find(query)
      .sort({ order: 1 })
      .select('name position adCode dimensions order -_id');
    
    res.json({
      success: true,
      data: adSlots
    });
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching ad slots'
    });
  }
});

module.exports = router;
