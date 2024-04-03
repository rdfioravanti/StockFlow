const pool = require('../db');

class RegistrationKeyController {
  static async getRegistrationKey(key) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT key_id, key, issuing_date, key_used, privilege_level
        FROM registration_keys
        WHERE key = $1
      `;
      const result = await client.query(query, [key]);
      client.release();

      if (result.rows.length === 0) {
        return null; // Return null if no key found
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async markKeyAsUsed(key) {
    try {
      const client = await pool.connect();
      const query = `
        UPDATE registration_keys
        SET key_used = true
        WHERE key = $1
      `;
      await client.query(query, [key]);
      client.release();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RegistrationKeyController;
