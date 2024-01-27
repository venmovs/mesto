class AuthorizationError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 401;
  }
}

export default AuthorizationError;
