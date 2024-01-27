import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';

const { login, register } = controllers.auth;
const { validateLogin, validateUser } = middlewares.validator;

const router = Router();

router.get('/signin', validateLogin, login);
router.get('/signup', validateUser, register);

export default router;
