const tracer = require('dd-trace').init(); // Initialize Datadog tracing

// Error-handling middleware
function errorTagger(err, req, res, next) {
  const span = tracer.scope().active(); // Get the current active span

  if (span) {
    // Tag the error in the Datadog span
    span.setTag('error', true);
    span.setTag('error.message', err.message);
    span.setTag('error.stack', err.stack);
    span.setTag('http.status_code', res.statusCode || 500); // Default to 500 if status code is not set
  }

  // Pass the error to the next middleware
  next(err);
}

module.exports = errorTagger;
