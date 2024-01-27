import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { STATUS_UNAUTHORIZED } from '../helpers/constants/statuses';
import errors from '../errors';
import { ERROR_MESSAGE_SERVER } from '../helpers/constants/messages';

const { ServerError } = errors;
interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const handleAuthError = (res: Response) => {
  res.status(STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header: string) => header.replace('Bearer ', '');
const auth = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    if (!secretKey) {
      throw new ServerError(ERROR_MESSAGE_SERVER);
    }
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
};

export default auth;
