// Add this route to `authRoutes.js` or a separate `userRoutes.js`
const router = require('express').Router();
const User = require('./models/User');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ username: 1 }); // Sort alphabetically by default
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
