const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const UserController = require('../controllers/userController');
const { generateToken, encryptToken } = require('../functions/tokenFunctions');

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
    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' }); // Incorrect password
    }

    // Generate ID token with issuer, expiration time (1 hour), and employeeId
    const idToken = encryptToken(generateToken({ iss: process.env.JWT_ISSUER, uniqueId: global.uniqueId, employeeId: user.employeeId }, '1h')); // Including the uniqueId in the idToken

    // Generate refresh token with issuer and expiration time (1 week)
    const refreshToken = encryptToken(generateToken({ iss: process.env.JWT_ISSUER, uniqueId: global.uniqueId }, '7d')); // Including the uniqueId in the refreshToken

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
