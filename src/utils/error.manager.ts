import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends Error {
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    super(`${type}::${message}`);
  }

  public static createSignatureError(message: string) {
    const typeStatusCodes = message.split('::')[0];
    if (HttpStatus[typeStatusCodes]) {
      throw new HttpException(message, HttpStatus[typeStatusCodes]);
    }

    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
