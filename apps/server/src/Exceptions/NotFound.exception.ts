import { HttpException } from "./Http.exception";

export class NotFoundException extends HttpException {
  constructor(content: string) {
    super({
      message: "Not Found",
      status: 404,
      content: `${content} does not exist`,
    });
  }
}
