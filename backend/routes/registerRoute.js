const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserController = require('../controllers/userController');
const { generateToken, encryptToken } = require('../functions/tokenFunctions');

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, birthDate, password, privilegeLevel } = req.body;

    // Check if all required fields are present
    if (!firstName || !lastName || !email || !birthDate || !password || !privilegeLevel) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = {
      firstName,
      lastName,
      email,
      birthDate,
      password: hashedPassword,
      privilegeLevel
    };

    // Create user in the database
    const newUser = await UserController.createUser(user);

    // Generate ID token with issuer, expiration time (1 hour), and employeeId
    const idToken = encryptToken(generateToken({ iss: process.env.JWT_ISSUER, employeeId: newUser.employeeId }, '1h'));

    // Generate refresh token with issuer and expiration time (1 week)
    const refreshToken = encryptToken(generateToken({ iss: process.env.JWT_ISSUER }, '7d'));

    // Send tokens to the frontend
    res.status(201).json({ idToken, refreshToken });
  } catch (error) {
    console.error(error); // Log the error for debugging
    if (error.message === 'User with the same email already exists') {
      return res.status(400).json({ error: error.message });
    } else if (error.message === 'Invalid privilege level. Allowed values are "employee", "manager", or "admin"') {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Function to validate email format
function isValidEmail(email) {
  // Email validation logic here
  return true; // Placeholder for email validation
}

module.exports = router;
