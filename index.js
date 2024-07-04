const express = require('express');
const path = require('path');
const logger = require('./logger');
const app = express();
const port = 3000;
const tracer = require('dd-trace').init();
const span = tracer.scope().active()

// Function to simulate errors with stack trace
const simulateError = (message) => {
  throw new Error(message);
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to log requests
app.use((req, res, next) => {
  logger.info({ message: 'Request received', method: req.method, url: req.url });
  next();
});

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle username submission
app.post('/submit-username', (req, res) => {
  const username = req.body.username;
  logger.info({ message: 'Username submitted', username: username });
  res.redirect(`/select-avenger?username=${username}`);
});

// Serve the avenger selection page
app.get('/select-avenger', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'select-avenger.html'));
});

// Handle avenger selection
app.get('/avenger/:name', (req, res) => {
  const avengers = {
    ironman: { name: 'Iron Man', image: 'ironman.png', phrase: 'I am Iron Man.' },
    captainamerica: { name: 'Captain America', image: 'captainamerica.png', phrase: 'I can do this all day.' },
    thor: { name: 'Thor', image: 'thor.png', phrase: 'Bring me Thanos!' },
    hulk: { name: 'Hulk', image: 'hulk.png', phrase: 'Hulk smash!' }
  };
  const avenger = avengers[req.params.name];
  if (avenger) {
    logger.info({ message: 'Avenger selected', avenger: avenger.name });
    span.setTag('avenger', avenger.name)
    res.json(avenger);
  } else {
    logger.error({ message: 'Avenger not found', avenger: req.params.name });
    res.status(404).send('Avenger not found');
  }
});

// Simulate HTTP status responses
app.get('/status/:code', (req, res) => {
  const code = parseInt(req.params.code, 10);
  if (code === 400) {
    const error = simulateError('This is a mockup error message for a bad request. The request could not be understood by the server due to malformed syntax.');
    logger.warn(`Handling bad request: ${error.message}`, { stack: error.stack });
  } else if (code === 500) {
    // Simulate an error by throwing it
    const error = new Error('Something went wrong');
    error.status = 500;

    // Log the error using Winston
    logger.error({
        message: error.message,
        status: error.status,
        stack: error.stack
    });

    // Respond with the error status and message
    res.status(error.status).json({
        error: {
            message: error.message
        }
    });
    //const error = simulateError('This is a mockup error message for an internal server error. An unexpected condition was encountered.', 'InternalServerError');
    //logger.error(`Handling server error: ${error.message}`, { kind: error.kind, stack: error.stack });
  } else {
    logger.info({ message: `Simulating HTTP ${code}`, code: code });
  }
  res.status(code).send(`HTTP ${code} - ${require('http').STATUS_CODES[code]}`);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  // Log the error using Winston
  logger.error({
      message: err.message,
      status: err.status,
      stack: err.stack
  });

  // Respond with the error status and message
  res.status(err.status || 500).json({
      error: {
          message: err.message
      }
  });
});

app.listen(port, () => {
  logger.info({ message: `Server running at http://localhost:${port}/` });
});
