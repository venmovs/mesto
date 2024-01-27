import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';

const { validateCard, validateId } = middlewares.validator;
const router = Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = controllers.card;

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateId, deleteCard);
router.put('/:cardId/likes', validateId, likeCard);
router.delete('/:cardId/likes', validateId, dislikeCard);

export default router;
