const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Route to get a user by employee ID
router.get('/users/:employeeId', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    const user = await UserController.getUserByEmployeeId(employeeId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
