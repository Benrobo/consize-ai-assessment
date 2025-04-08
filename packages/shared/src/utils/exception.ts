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

export class WorkersException extends Error {
  public errorCode: string;
  public data: {
    message?: string;
    details: any;
  };
  constructor(errorCode: string, data?: any) {
    super();
    this.name = "WorkersException";
    this.errorCode = errorCode;
    this.data = data;
  }
}
