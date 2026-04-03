export class HttpException extends Error {
  public status: number;
  public message: string;
  public title: string;
  constructor(status: number, message: string, title: string) {
    super(message);
    this.status = status || 500;
    this.message = message || 'Internal Server Error';
    this.title = title || 'Error';
  }
}
