interface Constructor {
  message: string;
  content: any;
  status: number;
}

export class HttpException extends Error {
  // message
  public message: string;

  // response content
  public content: any;

  // response status
  public status: number;

  constructor({ message, content, status }: Constructor) {
    super(message);

    this.message = message;
    this.content = content;
    this.status = status;
  }

  // body format
  public getBody() {
    return {
      statusCode: this.status,
      message: this.content,
      error: this.message,
    };
  }

  public static createBody(statusCode: number, message: string, error: string) {
    return {
      statusCode,
      message,
      error,
    };
  }
}
