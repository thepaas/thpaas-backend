import { QueryFailedError } from 'typeorm';
import { PostgresErrorCodes } from '../enums/database';

export class DatabaseError extends Error {
  constructor(message: string, stack?: string) {
    super(message);
    this.name = this.constructor.name;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export function handleQueryFailedError(error: QueryFailedError): DatabaseError {
  const stack = error.stack || '';
  let message = error.message;

  const errorCode = (error.driverError as { code?: string }).code;

  switch (errorCode) {
    case PostgresErrorCodes.Duplicated:
      message = (error.driverError as { detail?: string }).detail || message;
      break;
    case PostgresErrorCodes.NumericFieldOverflow:
      message = 'Invalid numeric value';
      break;
    default:
      break;
  }

  return new DatabaseError(message, stack);
}
