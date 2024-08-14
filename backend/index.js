const express = require("express");
const path = require("path");
const logger = require("./logger");
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

app.use(cors());
app.options("*", cors()); // include before other routes

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
    tracer.setUser({
      id: username, // Unique identifier for the user
      name: username,
    });

    if (tracer.appsec.isUserBlocked(username)) {
      return tracer.appsec.blockRequest(req, res); // Blocking response is sent
    }

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
    ironman: {
      name: "Iron Man",
      image: "ironman.png",
      phrase: "I am Iron Man.",
    },
    captainamerica: {
      name: "Captain America",
      image: "captainamerica.png",
      phrase: "I can do this all day.",
    },
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
      }
      break;

    default:
      const spanDefault = tracer.scope().active();
      spanDefault.setTag("avenger", avenger.name);
      logger.error({ message: "AVENGERS ASSEMBLE !", avenger: avenger.name });
      logger.warn({ message: "I am... Iron Man.", avenger: avenger.name });
      logger.info({
        message: "Captain America Hail Hydra",
        avenger: avenger.name,
      });
      logger.info({ message: "Hulk Smashhh!", avenger: avenger.name });
      logger.info({
        message:
          "Whosoever holds this hammer, if he be worthy, shall possess the power of Thor.",
        avenger: avenger.name,
      });
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

// Simulate HTTP status responses
app.get("/status/:code", (req, res) => {
  let respBody = {};
  const code = parseInt(req.params.code, 10);
  if (code >= 400) {
    let error;
    switch (code) {
      case 400:
        error = new Error(
          "This is a mockup error message for a bad request. The request could not be understood by the server due to malformed syntax."
        );
        logger.warn(`Handling bad request: ${error.message}`, {
          stack: error.stack,
        });
        break;
      case 500:
        error = new Error("Something went wrong");
        logger.error({
          message: error.message,
          status: code,
          stack: error.stack,
        });
        break;
    }
    respBody = { error: error.message };
  } else {
    logger.info({ message: `Simulating HTTP ${code}`, code: code });
  }
  res.status(code).send(respBody);
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

// app.post('/security-submit', (req, res) => {
//   logger.info('Received input:', req.body.userInput);
//   res.send('Input received');
// });

app.post("/security-submit", (req, res) => {
  const userInput = req.body.userInput;

  // Vulnerable SQL query (for demonstration purposes only)
  const query = `${userInput}`;
  console.log("Executing query:", query);

  pool.query(query, (err, results) => {
    if (err) {
      logger.error("Database error:", err);
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  logger.info({ message: `Server running at http://localhost:${port}/` });
});
