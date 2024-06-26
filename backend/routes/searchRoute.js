const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { verifyToken } = require('../functions/tokenValidationFunctions');

// Route to search for items based on a search query
router.get('/search', async (req, res) => {
  try {
    // Extract JWT token from request headers
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];

    try {
      // Verify JWT token
      const decodedToken = verifyToken(token);
    } catch (error) {
      // Send 402 status if there's an error in token verification
      console.error('Error verifying token:', error);
      return res.status(402).json({ error: 'Unauthorized' });
    }

    // Proceed to search for items
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const items = await ProductController.searchItems(search);
    return res.json(items);
  } catch (error) {
    console.error('Error searching for items:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
