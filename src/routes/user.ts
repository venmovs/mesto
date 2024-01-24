import { Router } from 'express';
import controllers from '../controllers';

const router = Router();

const {
  getUser, getUsers, createUser, updateUserInfo, updateUserAvatar,
} = controllers.user;

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

export default router;
