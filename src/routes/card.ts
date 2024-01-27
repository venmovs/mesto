import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';

const { validateCard, validateCardId } = middlewares.validator;
const router = Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = controllers.card;

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
