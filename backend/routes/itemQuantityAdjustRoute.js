const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { verifyToken } = require('../functions/tokenValidationFunctions');

// Route to adjust quantity of an item by SKU
router.put('/item/:sku/adjust', async (req, res) => {
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

    // If authentication is successful, proceed to adjust quantity
    const { sku } = req.params;
    if (!sku) {
      return res.status(400).json({ error: 'SKU parameter is required' });
    }

    // Extract adjustment quantity and type (addition/subtraction) from request body
    const { quantity, isAddition } = req.body;
    if (quantity === undefined || isAddition === undefined) {
      return res.status(400).json({ error: 'Quantity and isAddition parameters are required' });
    }

    // Convert quantity to a number
    const adjustedQuantity = parseInt(quantity);
    if (isNaN(adjustedQuantity)) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Adjust the quantity
    const newQuantity = await ProductController.adjustQuantityBySku(sku, adjustedQuantity, isAddition);
    
    // Return the new quantity
    return res.json({ newQuantity });
  } catch (error) {
    console.error('Error adjusting quantity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
