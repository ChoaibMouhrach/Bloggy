import { HttpException } from "./Http.exception";

export class UnauthorizedException extends HttpException {
  constructor(content?: any) {
    super({ message: "Unauthorized", content, status: 401 });
  }
}
