import auth from './auth';
import errorHandler from './errorHandler';
import logger from './logger';
import validator from './validator';

const middlewares = {
  auth,
  errorHandler,
  logger,
  validator,
};

export default middlewares;
