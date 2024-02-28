const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const encryptToken = (token) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.KEY, 'hex'); // Use KEY from environment variable
  const iv = Buffer.from(process.env.IV, 'hex'); // Use IV from environment variable

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encryptedToken = cipher.update(token, 'utf8', 'hex');
  encryptedToken += cipher.final('hex');

  // Return encrypted token along with key and IV for decryption
  return { encryptedToken };
};

module.exports = { generateToken, encryptToken };
