import {
  Request, Response, NextFunction, Router,
} from 'express';
import userRouter from './user';
import cardRouter from './card';
import authRouter from './auth';
import auth from '../middlewares/auth';
import errors from '../errors';
import { ERROR_MESSAGE_ID } from '../helpers/constants/messages';

const { NotFoundError } = errors;

const router = Router();

router.use('/', authRouter);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(ERROR_MESSAGE_ID));
});
export default router;
