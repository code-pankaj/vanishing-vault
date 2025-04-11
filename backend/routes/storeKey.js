// routes/storeKey.js
const express = require('express');
const router = express.Router();
const supabase = require('../db/supabaseClient');

// POST /key/store
router.post('/', async (req, res) => {
  const { tx_id, enc_key, expiry } = req.body;

  if (!tx_id || !enc_key || !expiry) {
    return res.status(400).json({ error: 'tx_id, enc_key, and expiry are required.' });
  }

  try {
    console.log('Attempting to store key with data:', { tx_id, enc_key, expiry });
    
    const { data, error } = await supabase
      .from('vanishing_keys')
      .insert([{ tx_id, enc_key, expiry }]);

    if (error) {
      console.error('Supabase error details:', error);
      return res.status(500).json({ 
        error: 'Failed to store the key.',
        details: error.message 
      });
    }

    console.log('Successfully stored key:', data);
    res.status(201).json({ message: 'Encryption key stored successfully.', data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal server error.',
      details: err.message 
    });
  }
});

module.exports = router;
