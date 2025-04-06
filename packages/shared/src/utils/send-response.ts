import type { StatusCodes as StatusCodeType } from "http-status-codes";
import { StatusCodes } from "http-status-codes";

import { Response } from "express";

class SendResponse {
  private capitalizeWord(word: string) {
    const capWrd = word.split("")[0].toUpperCase() + word.slice(1);
    return capWrd;
  }

  error(
    res: Response,
    message: string,
    statusCode: StatusCodeType,
    data?: any
  ) {
    return res.status(statusCode).json({
      message: message ?? this.capitalizeWord("error-message"),
      data,
    });
  }

  success(
    res: Response,
    message: string,
    statusCode: StatusCodeType,
    data?: any
  ) {
    return res.status(statusCode).json({
      message: message ?? this.capitalizeWord("success-message"),
      data: data ?? null,
    });
  }
}

const sendResponse = new SendResponse();
export default sendResponse;
