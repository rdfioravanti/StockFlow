const LogController = require('../controllers/logController');

const logRequest = async (req, res, next) => {
  const { path: endpoint, method } = req;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toISOString();
  
  try {
    await LogController.createLog(endpoint, method, userAgent, timestamp);
    next();
  } catch (error) {
    console.error('Error logging request:', error);
    next(error);
  }
};

module.exports = logRequest;
