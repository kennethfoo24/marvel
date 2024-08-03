const express = require("express");
const path = require("path");
const logger = require("./logger");
const bodyParser = require('body-parser');
const app = express();
const tracer = require("dd-trace").init();
const axios = require("axios").default;
const { Pool } = require('pg');
require('dotenv').config(); // Using dotenv for environment variables

const port = process.env.PORT || 3000;

// Database connection configuration using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Function to simulate errors with stack trace
const simulateError = (message) => {
  throw new Error(message);
};

// Serve static files from the 'public' directory with caching
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: '1d', // Cache static files for 1 day
}));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to log requests
app.use((req, res, next) => {
  logger.info({
    message: "Request received",
    method: req.method,
    url: req.url,
  });
  next();
});

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle username submission
app.post("/submit-username", async (req, res) => {
  const username = req.body.username;
  logger.info({ message: "Username submitted", username: username });

  try {
    const results = await pool.query('INSERT INTO users (username) VALUES ($1) RETURNING *', [username]);
    logger.info({ message: 'Username saved', username: results.rows[0].username });
    res.redirect(`/select-avenger?username=${username}`);
  } catch (error) {
    logger.error({ message: 'Error inserting user', error: error });
    res.status(500).send('Error inserting user');
  }
});

// Serve the avenger selection page
app.get("/select-avenger", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "select-avenger.html"));
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

  if (avenger.name === "Thanos") {
    try {
      const response = await axios.get("http://34.67.3.96:80/delayed-response");
      res.status(200).json(response.data);
      logger.info({ message: "Thanos response received", data: response.data });
      const span = tracer.scope().active();
      span.setTag("avenger", avenger.name);
    } catch (error) {
      logger.error({ message: "Error fetching Thanos response", error: error });
      res.status(400).send("Error");
    }
  } else {
    logger.info({ message: "Avenger selected", avenger: avenger.name });
    const span = tracer.scope().active();
    span.setTag("avenger", avenger.name);
    res.json(avenger);
  }
});

// Endpoint to get all users
app.get('/users', async (req, res) => {
  logger.info({ message: "Received request for /users" });
  try {
    const results = await pool.query('SELECT * FROM users');
    logger.info({ message: 'Users fetched', users: results.rows });
    res.status(200).json(results.rows);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

// Simulate HTTP status responses
app.get("/status/:code", (req, res) => {
  const code = parseInt(req.params.code, 10);
  if (code === 400) {
    const error = new Error("This is a mockup error message for a bad request. The request could not be understood by the server due to malformed syntax.");
    logger.warn(`Handling bad request: ${error.message}`, {
      stack: error.stack,
    });
  } else if (code === 500) {
    const error = new Error("Something went wrong");
    logger.error({
      message: error.message,
      status: error.status,
      stack: error.stack,
    });
    return res.status(500).json({ error: { message: error.message } });
  } else {
    logger.info({ message: `Simulating HTTP ${code}`, code: code });
  }
  res.status(code).send(`HTTP ${code} - ${require("http").STATUS_CODES[code]}`);
});

// Handle other routes and methods with a 404 response
app.use((req, res) => {
  res.status(404).send("Not Found");
});


// app.get("/attack", (req, res) => {
//   axios
//     .get("https://cloudrunpythonbe-n2at3rsn5a-uc.a.run.app/api/getRequest", {
//       headers: { "User-Agent": "dd-test-scanner-log" },
//     })
//     .then((response) => {
//       res.status(200).send(response.data);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(400).send("Error");
//     });
// });

app.get("/attackGKE", (req, res) => {
  axios
    .get("http://34.67.95.125:80/api/getRequest", {
      headers: { "User-Agent": "dd-test-scanner-log" },
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error");
    });
});

app.get("/thanos", (req, res) => {
  const avengers = {
    thanos: {
      name: "Thanos",
      image: "thanos.png",
      phrase: "INFINITY SNAP!",
    },
  };
  const avenger = avengers[req.params.name];
  axios
    .get("http://34.67.3.96:80/delayed-response", {})
    .then((response) => {
      res.status(200).send(response.data);
      const span = tracer.scope().active();
      span.setTag("avenger", avenger.name);
      res.json(avenger);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error");
    });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  // Log the error using Winston
  logger.error({
    message: err.message,
    status: err.status,
    stack: err.stack,
  });

  // Respond with the error status and message
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

app.post('/security-submit', (req, res) => {
  logger.info('Received input:', req.body.userInput);
  res.send('Input received');
});

app.listen(port, () => {
  logger.info({ message: `Server running at http://localhost:${port}/` });
});
