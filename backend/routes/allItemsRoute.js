const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { verifyToken } = require('../functions/tokenValidationFunctions');

// Route to get all items
router.get('/items', async (req, res) => {
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

    // If authentication is successful, proceed to get all items
    const items = await ProductController.getAllItems();
    return res.json(items);
  } catch (error) {
    console.error('Error getting all items:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
