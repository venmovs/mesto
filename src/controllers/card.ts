import { Request, Response } from 'express';
import {
  STATUS_CREATED, STATUS_ERROR_ID, STATUS_ERROR_SERVER,
} from '../helpers/constants/statuses';
import { ERROR_MESSAGE_ID, ERROR_MESSAGE_SERVER } from '../helpers/constants/messages';
import models from '../models';
import temporaryUserId from '../helpers/temporaryUserId';

const Card = models.card;
const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER }));

const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = temporaryUserId(req);

  return Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER }));
};
const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(STATUS_ERROR_ID).send(ERROR_MESSAGE_ID);
      } else {
        res.send({ data: card });
      }
    })
    .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER }));
};

const likeCard = (req: Request, res: Response) => {
  const owner = temporaryUserId(req);
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_ERROR_ID)
          .send({ message: ERROR_MESSAGE_ID });
      } else {
        res.send(card);
      }
    })
    .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER }));
};

const dislikeCard = (req: Request, res: Response) => {
  const owner = temporaryUserId(req);

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_ERROR_ID)
          .send({ message: ERROR_MESSAGE_ID });
      } else {
        res.send(card);
      }
    })
    .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER }));
};
export default {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
