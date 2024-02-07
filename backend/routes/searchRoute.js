const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Route to search for items based on a search query
router.get('/search', async (req, res) => {
  try {
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
