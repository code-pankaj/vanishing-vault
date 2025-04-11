const crypto = require("crypto");

function encryptFile(buffer) {
  const key = crypto.randomBytes(32); // AES-256
  const iv = crypto.randomBytes(16); // Initialization vector

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  return {
    encryptedData: encrypted,
    key: key.toString("base64"),
    iv: iv.toString("base64")
  };
}

module.exports = encryptFile;
