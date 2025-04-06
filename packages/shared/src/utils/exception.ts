export class HttpException extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super();
    this.name = "HttpException";
    this.message = message;
    this.statusCode = statusCode;
  }
}
