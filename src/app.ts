import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import routes from './routes';
import temporaryUser from './middlewares/temporaryUser';

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect('mongodb://localhost:27017/mestodb')
  .then(() => console.info('Connected to DB'))
  .catch(console.error);

app.use(temporaryUser);

app.use('/users', routes.user);
app.use('/cards', routes.card);

app.listen(port, () => {
  console.info(`Server is Fire at http://localhost:${port}`);
});
