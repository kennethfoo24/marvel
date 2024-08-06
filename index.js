const express = require("express");
const path = require("path");
const logger = require("./logger");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const tracer = require("dd-trace").init();
const axios = require("axios").default;
const { Pool } = require('pg');
require('dotenv').config(); // Using dotenv for environment variables

// Database connection configuration using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 5000, // Close idle clients after 5 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to log requests and add user information to traces
app.use((req, res, next) => {
  const username = req.body.username || req.query.username || req.headers['x-username'];

  if (username) {
    req.username = username;
    logger.info({
      message: "Request received",
      method: req.method,
      url: req.url,
      user: username,
    });
  } else {
    logger.info({
      message: "Request received",
      method: req.method,
      url: req.url,
    });
  }

  next();
});

// Function to simulate errors with stack trace
const simulateError = (message) => {
  throw new Error(message);
};

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// // Handle username submission
// app.post("/submit-username", (req, res) => {
//   const username = req.body.username;
//   logger.info({ message: "Username submitted", username: username });

//   try {
//     // const results = await pool.query('INSERT INTO users (username) VALUES ($1) RETURNING *', [username]);
//     logger.info({ message: 'Username saved', username: results.rows[0].username });
//     res.redirect(`/select-avenger?username=${username}`);
//   } catch (error) {
//     logger.error({ message: 'Error inserting user', error: error });
//     res.status(500).send('Error inserting user');
//   }
// });

// Handle username submission
app.post('/submit-username', (req, res) => {
  const username = req.body.username;
  logger.info({ message: 'Username submitted', username: username });
  res.redirect(`/select-avenger?username=${username}`);
});

// Serve the avenger selection page
app.get("/select-avenger", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "select-avenger.html"));
});

app.listen(port, () => {
  logger.info({ message: `Server running at http://localhost:${port}/` });
});
