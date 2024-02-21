const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    // Verify token and decode payload
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      throw new Error('Token expired');
    }

    return decodedToken; // Return decoded token if valid and not expired
  } catch (error) {
    // If token verification fails or token is expired, throw an error
    throw new Error('Invalid token');
  }
};

module.exports = { verifyToken };
