import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

// Init Gcloud winston connection
const gcpLoggingServer = new LoggingWinston({
  prefix: 'server',
  labels: {
    component: 'server',
  },
});

// Init Gcloud winston connection
const gcpLoggingFrontend = new LoggingWinston({
  prefix: 'frontend',
  labels: {
    component: 'frontend',
  },
});

// Initialize Main Loggers
const serverLogger = winston.createLogger({
  level: 'info',
  defaultMeta: {
    component: 'server',
  },
});

const frontendLogger = winston.createLogger({
  level: 'info',
  defaultMeta: {
    component: 'frontend',
  },
});

// Set Console Logger
const loggerFormat = winston.format.printf((info) => `${info.component} - ${info.timestamp} [${info.level}]: ${info.message}`);

if (process.env.NODE_ENV === 'production') {
  serverLogger.add(gcpLoggingServer);
  frontendLogger.add(gcpLoggingFrontend);
} else {
  serverLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      loggerFormat,
    ),
  }));
  frontendLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      loggerFormat,
    ),
  }));
}

export { serverLogger, frontendLogger };
