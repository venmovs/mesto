import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';

const { validateAvatar, validateUserId, validateUserInfo } = middlewares.validator;
const router = Router();

const {
  getUser, getUsers, updateUserInfo, updateUserAvatar, getUserMe,
} = controllers.user;

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);

export default router;
