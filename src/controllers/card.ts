import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import {
  STATUS_CREATED, STATUS_ERROR_ID, STATUS_ERROR_SERVER, STATUS_SUCCESS,
} from '../helpers/constants/statuses';
import { ERROR_MESSAGE_BAD_REQUEST, ERROR_MESSAGE_ID, ERROR_MESSAGE_SERVER } from '../helpers/constants/messages';
import models from '../models';
import { SessionRequest } from '../models/types';
import errors from '../errors';

const {
  ValidationError, ServerError, ForbiddenError, NotFoundError,
} = errors;

const Card = models.card;
const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .orFail()
  .then((cards) => res.send({ data: cards }))
  .catch(() => next(new ServerError(ERROR_MESSAGE_SERVER)));

const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = { _id: req.user?._id };

  return Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        next(new ValidationError(ERROR_MESSAGE_ID));
      } else {
        next(new ServerError(ERROR_MESSAGE_SERVER));
      }
    });
};
const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (req.user?._id !== String(card.owner)) {
        next(new ForbiddenError(ERROR_MESSAGE_BAD_REQUEST));
      } else {
        Card.findByIdAndDelete(cardId)
          .then(() => res.status(STATUS_SUCCESS).send({ data: card }))
          .catch(() => {
            res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER });
          });
      }
    })
    .catch((error) => {
      if (error instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError(ERROR_MESSAGE_ID));
      } else if (error instanceof Error.CastError) {
        next(new ValidationError(ERROR_MESSAGE_ID));
      } else {
        next(new ServerError(ERROR_MESSAGE_SERVER));
      }
    });
};

const likeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_ERROR_ID)
          .send({ message: ERROR_MESSAGE_ID });
      } else {
        res.send(card);
      }
    })
    .catch((error) => {
      if (error instanceof Error.CastError) {
        next(new ValidationError(ERROR_MESSAGE_ID));
      } else {
        next(new ServerError(ERROR_MESSAGE_SERVER));
      }
    });
};

const dislikeCard = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true, runValidators: true },
)
  .orFail()
  .then((card) => {
    if (!card) {
      res
        .status(STATUS_ERROR_ID)
        .send({ message: ERROR_MESSAGE_ID });
    } else {
      res.send(card);
    }
  })
  .catch((error) => {
    if (error instanceof Error.DocumentNotFoundError) {
      next(new NotFoundError(ERROR_MESSAGE_ID));
    } else if (error instanceof Error.CastError) {
      next(new ValidationError(ERROR_MESSAGE_ID));
    } else {
      next(new ServerError(ERROR_MESSAGE_SERVER));
    }
  });
export default {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
