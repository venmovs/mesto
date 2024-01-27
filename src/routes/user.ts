import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';

const { validateAvatar, validateId, validateUserInfo } = middlewares.validator;
const router = Router();

const {
  getUser, getUsers, updateUserInfo, updateUserAvatar, getUserMe,
} = controllers.user;

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', validateId, getUser);
router.patch('/me', validateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);

export default router;
