import { Request } from "express";

const validate = () => {};

const authorize = () => {};

export interface LoginRequest extends Request {}

const loginRequest = {
  validate,
  authorize,
};

export default loginRequest;
