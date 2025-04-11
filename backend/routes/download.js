const express = require("express");
const router = express.Router();
const supabase = require("../db/supabaseClient");
const decryptFile = require("../utils/decryptFile");

router.get("/download/:tx_id", async (req, res) => {
  try {
    const { tx_id } = req.params;

    // Get key from DB
    const { data, error } = await supabase
      .from("vanishing_keys")
      .select("*")
      .eq("tx_id", tx_id)
      .single();

    if (error) {
      console.error("DB error:", error);
      return res.status(500).json({ error: "Failed to retrieve key" });
    }

    if (!data) {
      return res.status(404).json({ error: "Key not found" });
    }

    // Check if expired
    if (new Date(data.expiry) < new Date()) {
      return res.status(403).json({ error: "File access expired" });
    }

    // Get file from storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from("vault")
      .download(tx_id);

    if (storageError) {
      console.error("Storage error:", storageError);
      return res.status(500).json({ error: "Failed to retrieve file" });
    }

    // Decrypt file
    const [key, iv] = data.enc_key.split(":");
    const decryptedBuffer = decryptFile(fileData, key, iv);

    // Send file
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(decryptedBuffer);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

module.exports = router;
  