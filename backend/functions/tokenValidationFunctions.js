const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import crypto module for decryption

const verifyToken = (encryptedToken) => {
  try {
    // Convert key and IV from hexadecimal string to Buffer
    const keyBuffer = Buffer.from(process.env.KEY, 'hex');
    const ivBuffer = Buffer.from(process.env.IV, 'hex');

    // Create decipher object with AES symmetric decryption algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

    // Decrypt the encrypted token
    let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');

    // Verify decrypted token and decode payload
    const decodedToken = jwt.verify(decryptedToken, process.env.JWT_SECRET);

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      throw new Error('Token expired');
    }

    return decodedToken; // Return decoded token if valid and not expired
  } catch (error) {
    // If token decryption or verification fails or token is expired, throw an error
    throw new Error('Invalid token');
  }
};

module.exports = { verifyToken };
