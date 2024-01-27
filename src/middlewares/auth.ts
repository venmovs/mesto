import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import errors from '../errors';
import { ERROR_MESSAGE_SERVER } from '../helpers/constants/messages';

const { ServerError, AuthorizationError } = errors;
interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

dotenv.config();

const secretKey = process.env.JWT_SECRET || 'super-secret-key';

const handleAuthError = (next: NextFunction) => {
  next(new AuthorizationError('Необходима авторизация'));
};
const auth = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(next);
  }

  const token = req.cookies.jwt;

  if (!token) {
    next(new AuthorizationError('Необходима авторизация'));
  }
  let payload;

  try {
    if (!secretKey) {
      throw new ServerError(ERROR_MESSAGE_SERVER);
    }
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload;
  return next();
};

export default auth;
