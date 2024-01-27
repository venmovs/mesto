import { Error } from 'mongoose';

class ValidationError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export default ValidationError;
