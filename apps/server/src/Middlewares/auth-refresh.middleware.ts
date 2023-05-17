import { NotFoundException, UnauthorizedException } from "@src/Exceptions";
import config from "@src/lib/config";
import { database } from "@src/lib/database";
import { AuthRequest } from "@src/types";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authRefresh = async (
  request: AuthRequest,
  _response: Response,
  next: NextFunction
) => {
  // extract authorization
  const { authorization } = request.headers;

  // check if authorization exists with the token
  if (!authorization || !authorization.split(" ")[1]) {
    throw new UnauthorizedException();
  }

  // extract token
  const token = authorization.split(" ")[1];

  // user id
  let id: number;

  try {
    // decode token
    const decoded = jwt.verify(token, config.SECRET_REFRESH) as { id: number };

    // set user id
    id = decoded.id;
  } catch (err: any) {
    throw new UnauthorizedException(err.message);
  }

  // retrieve user
  const user = await database.user.findUnique({ where: { id } });

  // check user existance
  if (!user) {
    throw new NotFoundException("User");
  }

  // retrieve refreshTokens
  const tokens = await database.refreshToken.findMany({
    where: { userId: user.id, token },
  });

  // check tokens length
  if (!tokens.length) {
    throw new UnauthorizedException();
  }

  // set user in token
  request.auth = {
    token,
    user,
  };

  next();
};
