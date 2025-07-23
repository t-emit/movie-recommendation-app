// server/routes/lists.js (UPDATED FOR NEW LOGIC)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   POST api/lists/add
// @desc    Add a movie to a user's list with new, smarter logic
router.post('/add', auth, async (req, res) => {
  const { movieId, listType } = req.body; // listType: 'likes', 'dislikes', 'watchlist'
  
  if (!['likes', 'dislikes', 'watchlist'].includes(listType)) {
    return res.status(400).json({ msg: 'Invalid list type' });
  }

  try {
    const userId = req.user.id;
    const update = { $addToSet: { [listType]: movieId } };

    // --- NEW LOGIC ---
    // If liking, remove from dislikes (but not watchlist)
    if (listType === 'likes') {
      update.$pull = { dislikes: movieId };
    }

    // If disliking, remove from likes (but not watchlist)
    if (listType === 'dislikes') {
      update.$pull = { likes: movieId };
    }
    
    // If adding to watchlist, no pull operation is needed. It's independent.
    // --- END OF NEW LOGIC ---

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('ERROR in /api/lists/add:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/lists/remove
// @desc    Remove a movie from a specific list
// NEW ROUTE TO ALLOW REMOVAL
router.post('/remove', auth, async (req, res) => {
  const { movieId, listType } = req.body;

  if (!['likes', 'dislikes', 'watchlist'].includes(listType)) {
    return res.status(400).json({ msg: 'Invalid list type' });
  }

  try {
    const userId = req.user.id;
    const update = { $pull: { [listType]: movieId } };

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('ERROR in /api/lists/remove:', err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/lists
// @desc    Get user's lists
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('likes dislikes watchlist');
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('ERROR in /api/lists GET:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;