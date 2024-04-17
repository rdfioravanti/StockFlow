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
      const query = `
        SELECT pr.sku, pr.name, pr.description, pr.price, s1.on_hand_quantity, s1.last_received_date
        FROM product_reference pr
        LEFT JOIN store_1 s1 ON pr.sku = s1.sku
        WHERE pr.sku = $1
      `;
      const result = await client.query(query, [sku]);
      client.release();

      const products = result.rows.map(row => {
        return new Product(
          row.sku,
          row.name,
          row.description,
          row.price,
          row.on_hand_quantity,
          row.last_received_date
        );
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
      const queryText = `
        SELECT pr.sku, pr.name, pr.description, pr.price, s1.on_hand_quantity, s1.last_received_date
        FROM product_reference pr
        LEFT JOIN store_1 s1 ON pr.sku = s1.sku
        WHERE pr.name ILIKE $1 OR pr.description ILIKE $1
      `;
      const result = await client.query(queryText, [searchQuery]);
      client.release();

      const products = result.rows.map(row => {
        return new Product(
          row.sku,
          row.name,
          row.description,
          row.price,
          row.on_hand_quantity,
          row.last_received_date
        );
      });

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async adjustQuantityBySku(sku, quantity, isAddition) {
    try {
        const client = await pool.connect();

        // Retrieve the current quantity of the product
        const currentQuantityQuery = `
            SELECT on_hand_quantity FROM store_1 WHERE sku = $1
        `;
        const currentQuantityResult = await client.query(currentQuantityQuery, [sku]);
        const currentQuantity = currentQuantityResult.rows[0].on_hand_quantity;

        // Calculate the new quantity based on the adjustment
        let newQuantity;
        if (isAddition) {
            newQuantity = currentQuantity + quantity;
        } else {
            newQuantity = currentQuantity - quantity;
        }

        // Ensure the new quantity is not negative
        if (newQuantity < 0) {
            throw new Error('Adjustment would result in negative quantity');
        }

        // Update the quantity in the database
        const updateQuery = `
            UPDATE store_1 SET on_hand_quantity = $1 WHERE sku = $2
        `;
        await client.query(updateQuery, [newQuantity, sku]);
        client.release();

        return newQuantity;
    } catch (error) {
        throw error;
    }
  }
}

module.exports = ProductController;
