import { Request, Response } from 'express';
import models from '../models';
import { STATUS_BAD_REQUEST, STATUS_ERROR_ID, STATUS_ERROR_SERVER } from '../helpers/constants/statuses';
import { ERROR_MESSAGE_BAD_REQUEST, ERROR_MESSAGE_ID, ERROR_MESSAGE_SERVER } from '../helpers/constants/messages';
import temporaryUserId from '../helpers/temporaryUserId';

const User = models.user;
const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: ERROR_MESSAGE_BAD_REQUEST,
        });
      } else {
        res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER });
      }
    });
};

const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send(users))
  .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER }));

const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_ERROR_ID).send({ message: ERROR_MESSAGE_ID });
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: STATUS_BAD_REQUEST });
      } else {
        res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER });
      }
    });
};

const updateUserInfo = (req: Request, res: Response) => {
  const owner = temporaryUserId(req);
  const { name, about } = req.body;
  return User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(STATUS_ERROR_ID).send({ message: ERROR_MESSAGE_ID });
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: ERROR_MESSAGE_BAD_REQUEST,
        });
      } else {
        res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER });
      }
    });
};

const updateUserAvatar = (req: Request, res: Response) => {
  const owner = temporaryUserId(req);
  const { avatar } = req.body;

  return User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(STATUS_ERROR_ID)
          .send({ message: ERROR_MESSAGE_ID });
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: ERROR_MESSAGE_BAD_REQUEST,
        });
      } else {
        res.status(STATUS_ERROR_SERVER).send({ message: ERROR_MESSAGE_SERVER });
      }
    });
};

export default {
  createUser, getUsers, getUser, updateUserInfo, updateUserAvatar,
};
