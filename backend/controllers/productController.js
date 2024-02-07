const pool = require('../db');
const Product = require('../models/productModel');

class ProductController {
  static async searchItems(query) {
    try {
      const sku = parseInt(query);
      
      if (!isNaN(sku)) {
        return await ProductController.findBySku(sku);
      } else {
        return await ProductController.findByNameOrDescription(query);
      }
    } catch (error) {
      throw error;
    }
  }

  static async findBySku(sku) {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM product_reference WHERE sku = $1';
      const result = await client.query(query, [sku]);
      client.release();

      const products = result.rows.map(row => {
        return new Product(row.sku, row.name, row.description, row.price, row.onHandQuantity, row.lastReceivedDate);
      });

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async findByNameOrDescription(query) {
    try {
      const client = await pool.connect();
      const searchQuery = `%${query}%`; // Add wildcards for a partial match
      const query = 'SELECT * FROM product_reference WHERE name ILIKE $1 OR description ILIKE $1';
      const result = await client.query(query, [searchQuery]);
      client.release();

      const products = result.rows.map(row => {
        return new Product(row.sku, row.name, row.description, row.price, row.onHandQuantity, row.lastReceivedDate);
      });

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getAllItems() {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM product_reference');
      client.release();

      const products = result.rows.map(row => {
        return new Product(row.sku, row.name, row.description, row.price, row.onHandQuantity, row.lastReceivedDate);
      });

      return products;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductController;
