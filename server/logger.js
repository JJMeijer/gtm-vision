import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

// Init Gcloud winston connection
const loggingWinston = new LoggingWinston();

// Set Logger Format
const loggerFormat = winston.format.printf(({
  level,
  category,
  message,
  timestamp,
}) => `${category || 'server'} - ${timestamp} [${level}]: ${message}`);

// Initialize Main Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    loggerFormat,
  ),
});

if (process.env.NODE_ENV === 'production') {
  logger.add(loggingWinston);
} else {
  logger.add(new winston.transports.Console());
}

export default logger;
