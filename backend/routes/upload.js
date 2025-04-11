const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const encryptFile = require("../utils/encryptFile");
const supabase = require("../db/supabaseClient");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { expiry, wallet } = req.body;
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    if (!expiry || !wallet) {
      return res.status(400).json({ error: "Missing expiry or wallet" });
    }

    // Encrypt file
    const { encryptedData, key, iv } = encryptFile(fileBuffer);
    const encKey = `${key}:${iv}`;
    let tx_id = null;

    // Try Arweave first
    try {
      const arRes = await axios.post(
        "https://arweave.net", // or Bundlr endpoint
        encryptedData,
        { headers: { "Content-Type": "application/octet-stream" } }
      );
      tx_id = arRes.data.id || "mocked_tx_id";
    } catch (err) {
      console.warn("⚠️ Arweave upload failed, falling back to Supabase:", err.message);

      // Create a unique filename
      const fileName = `uploads/${Date.now()}-${originalName}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vault") // Make sure this bucket exists in Supabase
        .upload(fileName, encryptedData, {
          contentType: "application/octet-stream",
        });

      if (uploadError) {
        console.error("Supabase storage error:", uploadError);
        throw new Error(`Failed to upload to Supabase storage: ${uploadError.message}`);
      }

      tx_id = fileName;
    }

    // Store key in DB
    const { data: dbData, error: dbError } = await supabase
      .from("vanishing_keys")
      .insert([
        {
          tx_id,
          enc_key: encKey,
          expiry
        }
      ]);

    if (dbError) {
      console.error("Supabase DB error:", dbError);
      throw new Error(`Failed to store key in database: ${dbError.message}`);
    }

    res.json({
      message: "Upload successful",
      tx_id
    });
  } catch (err) {
    console.error("🔥 Upload error:", err.message);
    res.status(500).json({ 
      error: "Upload failed.",
      details: err.message 
    });
  }
});

module.exports = router;
