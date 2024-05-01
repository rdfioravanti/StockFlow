const pool = require('../db');
const crypto = require('crypto');

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

  static generateRandomKey(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      key += chars.charAt(index);
    }
    return key;
  }

  static async generateRegistrationKey(privilegeLevel) {
    // Validate privilege level
    const validPrivilegeLevels = ['admin', 'manager', 'employee'];
    if (!validPrivilegeLevels.includes(privilegeLevel)) {
      throw new Error('Invalid privilege level');
    }

    try {
      // Generate a random 25-digit alphanumeric key
      const key = this.generateRandomKey(25);
      
      // Insert the generated key into the database
      const client = await pool.connect();
      const query = `
        INSERT INTO registration_keys (key, issuing_date, key_used, privilege_level)
        VALUES ($1, CURRENT_TIMESTAMP, false, $2)
        RETURNING key
      `;
      const result = await client.query(query, [key, privilegeLevel]);
      client.release();

      if (result.rows.length === 0) {
        throw new Error('Failed to generate registration key');
      }

      return result.rows[0].key;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RegistrationKeyController;
