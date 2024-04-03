const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import crypto module for decryption

const decryptToken = (encryptedToken) => {
  try {
    // Convert key and IV from hexadecimal string to Buffer
    const keyBuffer = Buffer.from(process.env.KEY, 'hex');
    const ivBuffer = Buffer.from(process.env.IV, 'hex');

    // Create decipher object with AES symmetric decryption algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

    // Decrypt the encrypted token
    let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');

    // Decode payload without verifying token
    const decodedToken = jwt.decode(decryptedToken);

    // Check if decoded token has uniqueId field and it matches global.uniqueId
    if (!decodedToken.uniqueId || decodedToken.uniqueId !== global.uniqueId) {
      throw new Error('Invalid uniqueId');
    }

    return decodedToken; // Return decoded token without verification
  } catch (error) {
    // If token decryption fails or uniqueId doesn't match, throw an error
    throw new Error('Failed to decrypt token or invalid uniqueId');
  }
};

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

    // Check if decoded token has uniqueId field and it matches global.uniqueId
    if (!decodedToken.uniqueId || decodedToken.uniqueId !== global.uniqueId) {
      throw new Error('Invalid uniqueId');
    }

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      throw new Error('Token expired');
    }

    return decodedToken; // Return decoded token if valid and not expired
  } catch (error) {
    // If token decryption or verification fails, uniqueId doesn't match, or token is expired, throw an error
    throw new Error('Invalid token or uniqueId');
  }
};

module.exports = { decryptToken, verifyToken };
