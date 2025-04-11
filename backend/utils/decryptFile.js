const crypto = require('crypto');

function decryptFile(encryptedBuffer, key, iv) {
  try {
    // Convert key and iv from base64 to Buffer
    const keyBuffer = Buffer.from(key, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

    // Decrypt the data
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err);
    throw new Error('Failed to decrypt file');
  }
}

module.exports = decryptFile; 