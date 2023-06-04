import { UnauthorizedException, BadRequestException } from "@src/Exceptions";
import { ValidateParse, ValidateAuthorize } from "@src/types";
import { NextFunction, Request, Response } from "express";
import { SafeParseReturnType } from "zod";

interface ValidateParams {
  parse?: ValidateParse;
  authorize?: ValidateAuthorize;
}

export const validate = ({ parse, authorize }: ValidateParams) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    if (authorize) {
      const authorization: boolean = Boolean(authorize(request));

      if (!authorization) {
        throw new UnauthorizedException(undefined);
      }
    }

    if (parse) {
      const validation: SafeParseReturnType<any, any> = await parse(request);

      if (!validation.success) {
        throw new BadRequestException(validation.error.issues);
      }

      request.body = validation.data;
    }

    next();
  };
};
