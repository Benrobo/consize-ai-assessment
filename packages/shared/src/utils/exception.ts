export class HttpException extends Error {
  public statusCode: number;
  public data: any;
  constructor(message: string, statusCode: number, data?: any) {
    super();
    this.name = "HttpException";
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
