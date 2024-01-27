import { Request, Response } from 'express';
import { ERROR_MESSAGE_SERVER } from '../helpers/constants/messages';
import { STATUS_ERROR_SERVER } from '../helpers/constants/statuses';

interface IError extends Error {
  statusCode: number
}
const errorHandler = (err: IError, req: Request, res: Response) => {
  const { statusCode = STATUS_ERROR_SERVER, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === STATUS_ERROR_SERVER ? ERROR_MESSAGE_SERVER : message });
};

export default errorHandler;
