const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const UserController = require('../controllers/userController');
const RegistrationKeyController = require('../controllers/registrationKeyController');
const { generateToken, encryptToken } = require('../functions/tokenFunctions');

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, birthDate, password, registrationKey } = req.body;

    // Check if all required fields are present
    if (!firstName || !lastName || !email || !birthDate || !password || !registrationKey) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email is valid (you can implement email validation logic here)

    // Retrieve registration key information
    const keyInfo = await RegistrationKeyController.getRegistrationKey(registrationKey);

    if (!keyInfo) {
      return res.status(400).json({ error: 'Invalid registration key' });
    }

    if (keyInfo.key_used) {
      return res.status(400).json({ error: 'Registration key has already been used' });
    }

    // Uncomment the following lines if you want to mark the key as used before creating the user
    // await RegistrationKeyController.markKeyAsUsed(registrationKey);

    // Extract privilege level from the key
    const { privilege_level } = keyInfo;

    // Encrypt the password
    const hashedPassword = await argon2.hash(password);

    // Create user object
    const user = {
      firstName,
      lastName,
      email,
      birthDate,
      password: hashedPassword,
      privilegeLevel: privilege_level // Using the extracted privilege level from the registration key
    };

    // Create user in the database
    const newUser = await UserController.createUser(user);

    // Generate ID token with issuer, expiration time (1 hour), and employeeId
    const idToken = encryptToken(generateToken({ iss: process.env.JWT_ISSUER, uniqueId: global.uniqueId, employeeId: newUser.employeeId }, '1h')); // Including the uniqueId in the idToken

    // Generate refresh token with issuer and expiration time (1 week)
    const refreshToken = encryptToken(generateToken({ iss: process.env.JWT_ISSUER, uniqueId: global.uniqueId }, '7d')); // Including the uniqueId in the refreshToken

    // Send tokens to the frontend
    res.status(201).json({ idToken, refreshToken });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
