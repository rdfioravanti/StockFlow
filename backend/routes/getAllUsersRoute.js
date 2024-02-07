const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await UserController.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
