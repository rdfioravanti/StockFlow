const pool = require('../db');

class LogController {
  static async createLog(endpoint, method, userAgent, timestamp) {
    try {
      const client = await pool.connect();
      const query = `
        INSERT INTO http_logs (endpoint, method, user_agent, timestamp)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(query, [endpoint, method, userAgent, timestamp]);
      client.release();
    } catch (error) {
      throw error;
    }
  }

  static async getLogsByDateRange(startDate, endDate) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT *
        FROM http_logs
        WHERE timestamp >= $1 AND timestamp <= $2
      `;
      const result = await client.query(query, [startDate, endDate]);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getLogById(logId) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT *
        FROM http_logs
        WHERE log_id = $1
      `;
      const result = await client.query(query, [logId]);
      client.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LogController;
