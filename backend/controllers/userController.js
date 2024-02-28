const pool = require('../db');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserController {
  static async getAllUsers() {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM users';
      const result = await client.query(query);
      client.release();

      const users = result.rows.map(row => {
        return new User(row.employee_id, row.first_name, row.last_name, row.email, row.birth_date, row.password, row.privilege_level);
      });

      return users;
    } catch (error) {
      throw error;
    }
  }


  static async getUserByEmployeeId(employeeId) {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM users WHERE employee_id = $1';
      const result = await client.query(query, [employeeId]);
      client.release();

      const userData = result.rows[0];
      if (!userData) {
        throw new Error('User not found');
      }

      const user = new User(userData.employee_id, userData.first_name, userData.last_name, userData.email, userData.birth_date, userData.password, userData.privilege_level);

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);
      client.release();
  
      const userData = result.rows[0];
      return userData ? new User(userData.employee_id, userData.first_name, userData.last_name, userData.email, userData.birth_date, userData.password, userData.privilege_level) : null;
    } catch (error) {
      throw error;
    }
  }
  
  static async createUser(user) {
    try {
      const { firstName, lastName, email, birthDate, password, privilegeLevel } = user;
      
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if user with the same email already exists
      const existingUser = await UserController.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with the same email already exists');
      }
  
      // Validate privilegeLevel
      if (!['employee', 'manager', 'admin'].includes(privilegeLevel)) {
        throw new Error('Invalid privilege level. Allowed values are "employee", "manager", or "admin"');
      }
  
      const client = await pool.connect();
      const query = 'INSERT INTO users (first_name, last_name, email, birth_date, password, privilege_level) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const result = await client.query(query, [firstName, lastName, email, birthDate, hashedPassword, privilegeLevel]);
      client.release();
  
      const newUser = result.rows[0];
      if (!newUser) {
        throw new Error('Failed to create user');
      }
  
      // Decrypt the password before sending it back
      newUser.password = password;

      return new User(newUser.employeeId, newUser.firstName, newUser.lastName, newUser.email, newUser.birthDate, newUser.password, newUser.privilegeLevel);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserController;
