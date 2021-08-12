import winston from 'winston';

// Initialize Main Loggers
const serverLogger = winston.createLogger({
    level: 'info',
});

// Set Console Logger
const loggerFormat = winston.format.printf(
    (info) => `${info['timestamp']} [${info.level}]: ${info.message}`,
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

export { serverLogger };
