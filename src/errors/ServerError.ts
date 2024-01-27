class ServerError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = 500;
  }
}

export default ServerError;
