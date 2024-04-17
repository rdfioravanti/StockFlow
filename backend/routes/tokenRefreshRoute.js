const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { decryptToken, verifyToken } = require('../functions/tokenValidationFunctions');
const { generateToken, encryptToken } = require('../functions/tokenFunctions');

router.post('/refresh', async (req, res) => {
  try {
    const { idToken, refreshToken } = req.body;

    // Check if refreshToken is in the blacklist
    if (global.tokenBlacklist.has(refreshToken)) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Decrypt and decode idToken
    let decodedIdToken;
    try {
      decodedIdToken = decryptToken(idToken);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid idToken' });
    }

    // Validate refreshToken
    let decodedRefreshToken;
    try {
      decodedRefreshToken = verifyToken(refreshToken);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid refresh token' });
    }

    // If both tokens are valid, generate new tokens
    // Extract fields from the decryptedIdToken
    const employeeId = decodedIdToken.employeeId;

    // Get user info from database for privilege level
    const user = await UserController.getUserByEmployeeId(employeeId);

    // Generate new idToken with the same fields except for the expiration time
    const newIdToken = encryptToken(generateToken({ iss: process.env.JWT_ISSUER, uniqueId: global.uniqueId, employeeId }, '1h'));

    // Extract fields from the decryptedRefreshToken
    const refreshTokenExpiration = decodedRefreshToken.exp;

    // Generate new refreshToken with the same fields including the expiration time
    const newRefreshToken = encryptToken(generateToken({ iss: process.env.JWT_ISSUER, uniqueId: global.uniqueId }, refreshTokenExpiration - Math.floor(Date.now() / 1000)));

    // Add refreshToken to the blacklist
    global.tokenBlacklist.add(refreshToken);

    // Send new tokens to the frontend
    res.json({ idToken: newIdToken, refreshToken: newRefreshToken, privilegeLevel: user.privilegeLevel });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
