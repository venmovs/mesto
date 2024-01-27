class ForbiddenError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

export default ForbiddenError;
