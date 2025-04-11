const crypto = require("crypto");

function decryptBuffer(encBuffer, keyBase64, ivBase64) {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([decipher.update(encBuffer), decipher.final()]);
}

module.exports = { decryptBuffer };
