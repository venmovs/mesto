import { NextFunction, Response, Request } from 'express';
import { Error } from 'mongoose';
import models from '../models';
import {
  STATUS_SUCCESS,
} from '../helpers/constants/statuses';
import {
  ERROR_MESSAGE_BAD_REQUEST,
  ERROR_MESSAGE_ID,
  ERROR_MESSAGE_LOGIN_DATA,
  ERROR_MESSAGE_SERVER,
} from '../helpers/constants/messages';
import errors from '../errors';
import { SessionRequest } from '../models/types';

const User = models.user;
const {
  NotFoundError, ValidationError, ServerError,
} = errors;

const getUserMe = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  console.info(req);
  const userId = req.user?._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE_ID);
      } else {
        res.status(STATUS_SUCCESS).send(user);
      }
    })
    .catch((error) => next(error));
};

const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch(() => next(new ServerError(ERROR_MESSAGE_SERVER)));

const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail()
    .catch((error) => {
      if (error instanceof Error.CastError) {
        return next(new ValidationError(ERROR_MESSAGE_BAD_REQUEST));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        throw new NotFoundError(ERROR_MESSAGE_ID);
      }
      return next(new ServerError(ERROR_MESSAGE_SERVER));
    });
};

const updateUserInfo = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.user?._id },
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE_ID);
    }
    return res.send(user);
  } catch (error) {
    if (error instanceof Error.DocumentNotFoundError) {
      return next(new NotFoundError(ERROR_MESSAGE_ID));
    }
    if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
      return next(new ValidationError(ERROR_MESSAGE_LOGIN_DATA));
    }
    return next(new ServerError(ERROR_MESSAGE_SERVER));
  }
};
const updateUserAvatar = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.user?._id },
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE_ID);
    }
    return res.send(user);
  } catch (error) {
    if (error instanceof Error.DocumentNotFoundError) {
      return next(new NotFoundError(ERROR_MESSAGE_ID));
    }
    if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
      return next(new ValidationError(ERROR_MESSAGE_LOGIN_DATA));
    }
    return next(new ServerError(ERROR_MESSAGE_SERVER));
  }
};

export default {
  getUsers, getUser, updateUserInfo, updateUserAvatar, getUserMe,
};
