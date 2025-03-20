import winston from "winston";

// error, warn, info
const logger = winston.createLogger({
  level: "debug",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // new winston.transports.File({ filename: "warn.log", level: "warn" }),
    // new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;
