import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import routes from './routes';
import middlewares from './middlewares';

const { logger, errorHandler } = middlewares;
dotenv.config();
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect('mongodb://localhost:27017/mestodb')
  .then(() => console.info('Connected to DB'))
  .catch(console.error);

app.use(logger.requestLogger);
app.use(helmet());
app.use(cookieParser());
app.use(routes);
app.use(logger.errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server is Fire at http://localhost:${port}`);
});
