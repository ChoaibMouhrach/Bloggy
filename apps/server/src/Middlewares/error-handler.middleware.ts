import { HttpException } from "@src/Exceptions";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof HttpException) {
    return response.status(error.status).json(error.getBody());
  }

  console.log(error);

  return response
    .status(500)
    .json(
      HttpException.createBody(500, error.message, "Internal Server Error")
    );
}
