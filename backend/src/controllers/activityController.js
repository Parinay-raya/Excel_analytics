const Activity = require('../models/Activity');

// GET /api/activity
const listActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const activities = await Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { listActivities }; 