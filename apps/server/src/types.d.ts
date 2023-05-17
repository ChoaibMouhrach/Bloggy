import { User } from "@prisma/client";
import { Request, Response } from "express";

// Auth
export interface AuthRequest extends Request {
  auth?: {
    user: User;
    token: string;
  };
}

// validate middleware
export type ValidateParse = (
  request: Request
) => Promise<SafeParseReturnType<any, any>> | SafeParseReturnType<any, any>;
export type ValidateAuthorize = (request: Request) => any;
