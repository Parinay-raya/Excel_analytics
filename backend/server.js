// Import dependencies (CommonJS style)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/excel_analytics';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit if DB connection fails
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Excel Analytics API' });
});

// User routes
app.use('/api/users', require('./src/routes/userRoutes'));

// Create HTTP server
const server = http.createServer(app);

// Define ports to try
const ports = [process.env.PORT || 5000, 5001, 5002, 5003, 8080, 3000];
let currentPortIndex = 0;

// Function to try starting the server on different ports
function startServer() {
  if (currentPortIndex >= ports.length) {
    console.error('❌ Could not find an available port. Please free up one of these ports or specify a different port in .env file.');
    process.exit(1);
  }

  const PORT = ports[currentPortIndex];

  server.listen(PORT);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${PORT} is already in use, trying another port...`);
      currentPortIndex++;
      startServer(); // Try next port
    } else {
      console.error('❌ Server error:', error);
      process.exit(1);
    }
  });

  server.on('listening', () => {
    const actualPort = server.address().port;
    console.log(`✅ Server is running on port ${actualPort}`);

    if (actualPort !== 5000) {
      console.log(`⚠️ Note: Your frontend may be configured to connect to port 5000.`);
      console.log(`👉 Update the API URL in your frontend code to use port ${actualPort} if necessary.`);
    }
  });
}

// Start the server
startServer();
