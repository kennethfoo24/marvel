const express = require("express");
const path = require("path");
const logger = require("./logger");
const errorTagger = require('./error-tagger'); // Adjust the path accordingly
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const tracer = require("dd-trace").init({
  appsec: true,
});
const axios = require("axios").default;
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config(); // Using dotenv for environment variables

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

// Apply CORS middleware globally for all routes
app.use(cors());

// Apply body parser middleware for parsing URL-encoded bodies and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
//app.use(express.static(path.join(__dirname, 'public')));

// Apply error tagging middleware
app.use(errorTagger);

// Middleware to log requests and add user information to traces
app.use((req, res, next) => {
  const username = req.body.username || req.query.username || req.headers['x-username'];

  if (username) {
    const user = {
      id: username, // Unique identifier for the user
      name: username,
    };
    tracer.setUser(user);

    if (tracer.appsec.isUserBlocked(user)) {
      return tracer.appsec.blockRequest(req, res); // Blocking response is sent
    }

    logger.info({
      message: "Request received and username is set",
      method: req.method,
      url: req.url,
      user: username,
    });
  } else {
    logger.info({
      message: "Request received but username is unset",
      method: req.method,
      url: req.url,
    });
  }

  next();
});

// Serve the homepage
app.get("/", (req, res) => {
  logger.info({ message: "Backend server is running" });
  res.send("Backend server is running");
});

// Handle username submission
app.post("/submit-username", async (req, res) => {
  const username = req.body.username;
  logger.info({ message: "Username submitted", username: username });

  try {
    const results = await pool.query(
      "INSERT INTO users (username) VALUES ($1) RETURNING *",
      [username]
    );
    logger.info({
      message: "Username saved",
      username: results.rows[0].username,
    });
    res.redirect(`/select-avenger?username=${username}`);
  } catch (error) {
    logger.error({ message: "Error inserting user", error: error });
    res.status(500).send("Error inserting user");
  }
});

// Handle avenger selection
app.get("/avenger/:name", async (req, res) => {
  const avengers = {
    ironman: { name: "Iron Man", image: "ironman.png", phrase: "I am Iron Man." },
    captainamerica: { name: "Captain America", image: "captainamerica.png", phrase: "I can do this all day." },
    thor: { name: "Thor", image: "thor.png", phrase: "Bring me Thanos!" },
    hulk: { name: "Hulk", image: "hulk.png", phrase: "Hulk smash!" },
    thanos: { name: "Thanos", image: "thanos.png", phrase: "INFINITY SNAP!" },
  };
  const avenger = avengers[req.params.name];

  if (!avenger) {
    logger.error({ message: "Avenger not found", avenger: req.params.name });
    return res.status(404).send("Avenger not found");
  }

  switch (avenger.name) {
    case "Thanos":
      try {
        const span = tracer.scope().active();
        span.setTag("avenger", avenger.name);
        const response = await axios.get(
          "http://34.67.3.96:80/delayed-response"
        );
        logger.error({
          message: "OMG! It's Thanos, everybody run !",
          avenger: avenger.name,
        });
        logger.warn({
          message: "You should have gone for the head !",
          avenger: avenger.name,
        });
        logger.info({ message: "Thanos has arrived !", data: response.data });
        logger.info({ message: "Avenger selected", avenger: avenger.name });
        res.json(avenger);
      } catch (error) {
        logger.error({
          message: "Error fetching Thanos response",
          error: error,
        });
        res.status(400).send("Error");
        const span = tracer.scope().active();
        
        if (span) {
          // Tag the span with error 
          span.setTag('error', true);
          span.setTag('error.message', error.message);
          span.setTag('error.stack', error.stack);
        }
      }
      break;

    default:
      const spanDefault = tracer.scope().active();
      spanDefault.setTag("avenger", avenger.name);
      logger.error({ message: "AVENGERS ASSEMBLE !", avenger: avenger.name });
      logger.warn({ message: "I am... Iron Man.", avenger: avenger.name });
      logger.info({ message: "Captain America Hail Hydra", avenger: avenger.name });
      logger.info({ message: "Hulk Smashhh!", avenger: avenger.name });
      logger.info({ message: "Whosoever holds this hammer, if he be worthy, shall possess the power of Thor.", avenger: avenger.name });
      res.json(avenger);
  }
});

// Endpoint to get all users
app.get("/users", async (req, res) => {
  logger.info({ message: "Received request for /users" });
  try {
    const results = await pool.query("SELECT * FROM users");
    logger.info({ message: "Users fetched", users: results.rows });
    res.status(200).json(results.rows);
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.get('/unhandled-exception', (req, res) => {
  try {
    // Throw an error that isn't caught
    throw new Error('This is an unhandled exception!');
  } catch (error) {
    // Get the current active span
    const span = tracer.scope().active();

    if (span) {
      // Tag the span with error details
      span.setTag('error', true);
      span.setTag('error.message', err.message);
      span.setTag('error.stack', err.stack);
    }

    // Re-throw the error to keep it unhandled
    throw error;
  }
});

// Simulate HTTP status responses
app.get('/status/:code', (req, res) => {
  let respBody = {};
  const code = parseInt(req.params.code, 10);
  const span = tracer.scope().active(); // Get the current active span

  if (code >= 400) {
    let error;
    switch (code) {
      case 400:
        error = new Error(
          'Error: HTTP 400 Bad Request. The request could not be understood by the server due to malformed syntax.'
        );
        logger.warn(`Handling bad request: ${error.message}`, {
          stack: error.stack,
        });

        // Tagging the error in Datadog
        if (span) {
          span.setTag('error', true);
          span.setTag('error.message', error.message);
          span.setTag('error.stack', error.stack);
          span.setTag('http.status_code', code);
        }
        break;
      case 500:
        error = new Error('Error: HTTP 500 Internal Server Error. Something went very very wrong!');
        logger.error({
          message: error.message,
          status: code,
          stack: error.stack,
        });

        // Tagging the error in Datadog
        if (span) {
          span.setTag('error', true);
          span.setTag('error.message', error.message);
          span.setTag('error.stack', error.stack);
          span.setTag('http.status_code', code);
        }
        break;
    }
    respBody = { error: error.message };
  } else {
    respBody = { code: req.params.code };
    logger.info({ message: `Simulating HTTP ${code}`, code: code });

    // Tagging successful response in Datadog
    if (span) {
      span.setTag('http.status_code', code);
    }
  }
  res.status(code).send(respBody);
});

// Optimized route for attackGKE
app.get("/attackGKE", async (req, res) => {
  const username =
    req.body.username || req.query.username || req.headers["x-username"];
  try {
    const response = await axios.get("http://35.193.52.148:80/api/getRequest", {
      headers: {
        "User-Agent": "dd-test-scanner-log",
        "X-Username": username,
      },
    });
    res.status(200).send(response.data);
  } catch (error) {
    logger.error("Error:", error);
    res.status(400).send("Error fetching data from GKE");
  }
});

// Error-handling middleware
app.use((error, req, res, next) => {
  // Log the error using Winston
  logger.error({
    message: err.message,
    status: err.status,
    stack: err.stack,
  });

  const span = tracer.scope().active(); // Get the current active span

  if (span) {
    // Tag the error in the Datadog span
    span.setTag('error', true);
    span.setTag('error.message', error.message);
    span.setTag('error.stack', error.stack);
    span.setTag('http.status_code', res.statusCode || 500); // Default to 500 if status code is not set
  }

  // Pass the error to the next middleware
  next(error);

  // Respond with the error status and message
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

// app.post('/security-submit', (req, res) => {
//   logger.info('Received input:', req.body.userInput);
//   res.send('Input received');
// });

app.post("/security-submit", (req, res) => {
  const userInput = req.body.userInput;

  // Vulnerable SQL query (for demonstration purposes only)
  const query = `${userInput}`;
  console.log("Executing query:", query);

  pool.query(query, (error, results) => {
    if (error) {
      logger.error("Database error:", error);
      res.status(500).send("Database error");
    }
    res.json(results);
  });
});

app.listen(port, () => {
  logger.info({ message: `Server running at http://localhost:${port}/` });
});
