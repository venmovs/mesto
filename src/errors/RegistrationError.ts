import { Error } from 'mongoose';

class RegistrationError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'RegistrationError';
    this.statusCode = 409;
  }
}

export default RegistrationError;
