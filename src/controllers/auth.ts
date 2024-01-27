import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';
import HASH_SALT_ROUNDS from '../helpers/constants/hashSaltRounds';
import { STATUS_CREATED, STATUS_SUCCESS } from '../helpers/constants/statuses';
import { ERROR_MESSAGE_ID, ERROR_MESSAGE_LOGIN_DATA, ERROR_MESSAGE_SERVER } from '../helpers/constants/messages';
import errors from '../errors';

dotenv.config();

const secretKey = process.env.JWT_SECRET;
const User = models.user;

const {
  ValidationError, RegistrationError, ServerError, AuthorizationError,
} = errors;
export const register = (req: Request, res: Response, next: NextFunction) => {
  const {
    password, email, name, about, avatar,
  } = req.body;
  return bcrypt.hash(password, HASH_SALT_ROUNDS)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(STATUS_CREATED).send({
        _id,
        email,
      });
    })
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        next(new ValidationError(ERROR_MESSAGE_ID));
      }
      if (error.code === 11000) {
        next(new RegistrationError(ERROR_MESSAGE_LOGIN_DATA));
      }
      next(new ServerError(ERROR_MESSAGE_SERVER));
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!secretKey) {
        throw new ServerError(ERROR_MESSAGE_SERVER);
      }
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: weekInMilliseconds,
      });
      res.status(STATUS_SUCCESS).send({ token });
    })
    .catch((error) => {
      if (error.name === 'AuthorizationError') {
        throw new AuthorizationError(ERROR_MESSAGE_LOGIN_DATA);
      } else {
        return next(error);
      }
    });
};

export default {
  login, register,
};
