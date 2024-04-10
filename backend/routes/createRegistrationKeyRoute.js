const express = require('express');
const router = express.Router();
const RegistrationKeyController = require('../controllers/registrationKeyController');
const { verifyToken } = require('../functions/tokenValidationFunctions');

// Route to generate registration key
router.post('/generateRegistrationKey', async (req, res) => {
  try {
    // Extract JWT token from request headers
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
      // Verify JWT token
      decodedToken = verifyToken(token);
    } catch (verificationError) {
      console.error('Error verifying token:', verificationError);
      return res.status(402).json({ error: 'Unauthorized' });
    }
    
    // If authentication is successful, proceed to generate registration key
    const privilegeLevel = req.body.privilegeLevel;
    if (!privilegeLevel) {
      return res.status(400).json({ error: 'Privilege level is required' });
    }
    
    // Ensure privilege level is one of the accepted values
    const validPrivilegeLevels = ['admin', 'manager', 'employee'];
    if (!validPrivilegeLevels.includes(privilegeLevel)) {
      return res.status(400).json({ error: 'Invalid privilege level' });
    }

    // Generate registration key
    const key = await RegistrationKeyController.generateRegistrationKey(privilegeLevel);

    return res.json({ key });
  } catch (error) {
    console.error('Error generating registration key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
