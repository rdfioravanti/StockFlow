const express = require('express');
const router = express.Router();
const { verifyToken } = require('../functions/tokenValidationFunctions');
const { generateToken, encryptToken } = require('../functions/tokenFunctions');

router.post('/refresh', async (req, res) => {
  try {
    const { idToken, refreshToken } = req.body;

    // Check if refreshToken is in the blacklist
    if (global.tokenBlacklist.has(refreshToken)) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Validate idToken
    let decodedIdToken;
    try {
      decodedIdToken = verifyToken(idToken);
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
    const newIdToken = generateToken({ iss: process.env.JWT_ISSUER }, '1h');

    // Use the expiration time of the existing refreshToken for the new refreshToken
    const refreshTokenExpiration = decodedRefreshToken.exp - Math.floor(Date.now() / 1000);
    const newRefreshToken = generateToken({ iss: process.env.JWT_ISSUER }, refreshTokenExpiration);

    // Encrypt new tokens
    const encryptedIdToken = encryptToken(newIdToken);
    const encryptedRefreshToken = encryptToken(newRefreshToken);

    // Add refreshToken to the blacklist
    global.tokenBlacklist.add(refreshToken);

    // Send new tokens to the frontend
    res.json({ idToken: encryptedIdToken, refreshToken: encryptedRefreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
