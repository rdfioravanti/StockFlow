const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { verifyToken } = require('../functions/tokenValidationFunctions');

// Route to get item by SKU
router.get('/item/:sku', async (req, res) => {
  try {
    // Extract JWT token from request headers
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // If authentication is successful, proceed to get item by SKU
    const { sku } = req.params;
    if (!sku) {
      return res.status(400).json({ error: 'SKU parameter is required' });
    }
    const item = await ProductController.findBySku(sku);
    return res.json(item);
  } catch (error) {
    console.error('Error getting item by SKU:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
