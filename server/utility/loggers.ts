import winston from 'winston';

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
const loggerFormat = winston.format.printf(
  (info) => `${info.component} - ${info.timestamp} [${info.level}]: ${info.message}`,
);

serverLogger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      loggerFormat,
    ),
  }),
);

frontendLogger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      loggerFormat,
    ),
  }),
);

export { serverLogger, frontendLogger };
