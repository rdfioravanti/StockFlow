const crypto = require('crypto');

const generateUniqueId = () => {
  // Generate a random buffer
  const buffer = crypto.randomBytes(16);
  
  // Convert the buffer to a hexadecimal string
  const uniqueId = buffer.toString('hex');

  return uniqueId;
};

module.exports = generateUniqueId;
