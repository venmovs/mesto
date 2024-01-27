import winston from 'winston';
import expressWinston from 'express-winston';

// создадим логер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
    }),
  ],
  format: winston.format.json(),
});

const logger = {
  requestLogger,
  errorLogger,
};

export default logger;
