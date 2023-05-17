import { UnauthorizedException, NotFoundException } from "@src/Exceptions";
import config from "@src/lib/config";
import { database } from "@src/lib/database";
import { AuthRequest } from "@src/types";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authAccessMiddleware = async (
  request: AuthRequest,
  _response: Response,
  next: NextFunction
) => {
  // get authorization header
  const { authorization } = request.headers;

  // check if the authorization exists
  if (!authorization || !authorization.split(" ")[1]) {
    throw new UnauthorizedException();
  }

  // extract token
  const token = authorization.split(" ")[1];

  // user id
  let id: number;

  try {
    // decoed token and extract id
    const decoded = jwt.verify(token, config.SECRET_ACCESS) as { id: number };
    id = decoded.id;
  } catch (err: any) {
    // throw token issue
    throw new UnauthorizedException(err.message);
  }

  // retrieve user
  const user = await database.user.findUnique({ where: { id }, include: { Role: true } });

  // if user not found
  if (!user) {
    throw new NotFoundException("User");
  }

  request.auth = {
    user,
    token,
  };

  next();
};
