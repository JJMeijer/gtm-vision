import { CustomError } from 'ts-custom-error';

export class HttpError extends CustomError {
  public constructor(public code: number, message?: string) {
    super(message);
  }
}

export class FrontendError extends CustomError {
  public constructor(public gtmId: string, message?: string) {
    super(message);
  }
}
