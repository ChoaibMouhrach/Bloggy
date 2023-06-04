import { HttpException } from "./Http.exception";

export class BadRequestException extends HttpException {
  constructor(content: any) {
    super({ message: "Bad Request", status: 400, content });
  }
}
