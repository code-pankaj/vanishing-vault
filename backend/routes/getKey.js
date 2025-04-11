// routes/getKey.js
const express = require('express');
const router = express.Router();
const supabase = require('../db/supabaseClient');

// GET /key/get/:tx_id
router.get('/:tx_id', async (req, res) => {
  const { tx_id } = req.params;

  if (!tx_id) {
    return res.status(400).json({ error: 'tx_id is required' });
  }

  try {
    const { data, error } = await supabase
      .from('vanishing_keys')
      .select('*')
      .eq('tx_id', tx_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Key not found' });
    }

    const now = new Date();
    const expiryTime = new Date(data.expiry);

    if (now > expiryTime) {
      return res.status(403).json({ error: 'Key has expired and is no longer accessible' });
    }

    res.status(200).json({ enc_key: data.enc_key });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
