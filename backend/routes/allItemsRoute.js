const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Route to get all items
router.get('/items', async (req, res) => {
  try {
    const items = await ProductController.getAllItems();
    return res.json(items);
  } catch (error) {
    console.error('Error getting all items:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
