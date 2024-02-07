const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Route to create a new user
router.post('/users', async (req, res) => {
  try {
    const user = req.body; // Assuming request body contains user data
    const newUser = await UserController.createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
