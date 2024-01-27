import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';

const { login, register } = controllers.auth;
const { validateLogin, validateUser } = middlewares.validator;

const router = Router();

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, register);

export default router;
