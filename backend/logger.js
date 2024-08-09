const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new transports.Console(),
  ]
});

module.exports = logger;
