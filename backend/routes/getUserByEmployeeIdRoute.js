const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken } = require('../functions/tokenValidationFunctions');

// Route to get user by employee ID
router.get('/userById', async (req, res) => {
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
    
    // If authentication is successful, proceed to get user by employee ID
    const employeeId = decodedToken.employeeId;
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID not found in token' });
    }
    const user = await UserController.getUserByEmployeeId(employeeId);

    // Remove the password field from the user object before sending it back
    delete user.password;

    return res.json(user);
  } catch (error) {
    console.error('Error getting user by employee ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
