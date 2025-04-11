// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const uploadRoutes = require("./routes/upload");
const storeKeyRoute = require('./routes/storeKey');
const getKeyRoute = require('./routes/getKey');
const priceRoutes = require("./routes/price");
const downloadRoute = require("./routes/download");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// Routes
app.use('/key/store', storeKeyRoute);
app.use('/key/get', getKeyRoute);
app.use(uploadRoutes);
app.use(priceRoutes);
app.use("/download", downloadRoute);

// Health Check
app.get('/', (req, res) => {
  res.send('Vanishing Vault backend is running. 🔐');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🧱 Server running on http://localhost:${PORT}`);
});
