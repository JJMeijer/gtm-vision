import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

// Init Gcloud winston connection
const loggingWinston = new LoggingWinston();

// Initialize Logger
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    loggingWinston,
  ],
});

export default logger;
