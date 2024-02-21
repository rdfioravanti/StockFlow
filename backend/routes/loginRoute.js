const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserController = require('../controllers/userController');
const { generateToken } = require('../functions/tokenFunctions');

router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    // Fetch user data from the database based on employee ID
    const user = await UserController.getUserByEmployeeId(employeeId);

    // If user is null or undefined, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' }); // Incorrect password
    }

    // Generate ID token with issuer, expiration time (1 hour), and employeeId
    const idToken = generateToken({ iss: process.env.JWT_ISSUER, exp: Math.floor(Date.now() / 1000) + 3600, employeeId });

    // Generate refresh token with issuer and expiration time (1 week)
    const refreshToken = generateToken({ iss: process.env.JWT_ISSUER, exp: Math.floor(Date.now() / 1000) + 604800 });

    // Send tokens to the frontend
    res.json({ idToken, refreshToken });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(401).json({ error: 'Invalid credentials' });
    } else {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: 'Internal server error' }); // Return a generic error message for internal server errors
    }
  }
});

module.exports = router;
