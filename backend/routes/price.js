const express = require("express");
const axios = require("axios");
const router = express.Router();

// Get price in AR for a file size
router.post("/price", async (req, res) => {
  try {
    const { size } = req.body; // size in bytes
    if (!size || isNaN(size)) {
      return res.status(400).json({ error: "Invalid size" });
    }

    const response = await axios.get(`https://arweave.net/price/${size}`);
    const priceInWinston = response.data; // Winston is smallest unit (1 AR = 10^12 Winston)
    const priceInAR = parseFloat(priceInWinston) / 1e12;

    res.json({
      ar: priceInAR,
      winston: priceInWinston
    });
  } catch (err) {
    console.error("Error fetching price:", err.message);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

module.exports = router;
