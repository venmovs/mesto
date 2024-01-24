import { Router } from 'express';
import controllers from '../controllers';

const router = Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = controllers.card;

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
