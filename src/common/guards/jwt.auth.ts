import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CustomHttpError } from '../errors/controlled';
import { ErrorAuth } from '../constants/errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-http') implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check for public routes first
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Try to authenticate with JWT
    try {
      // `super` has to be called to set `user` on `request`
      // see https://github.com/nestjs/passport/blob/master/lib/auth.guard.ts
      return (await super.canActivate(context)) as boolean;
    } catch (jwtError) {
      console.log(jwtError);
      switch (jwtError?.response?.statusCode) {
        case HttpStatus.UNAUTHORIZED:
          throw new CustomHttpError(
            ErrorAuth.Unauthorized,
            HttpStatus.UNAUTHORIZED,
          );
        case HttpStatus.FORBIDDEN:
          if (jwtError?.response?.message === ErrorAuth.Forbidden) {
            throw new CustomHttpError(
              ErrorAuth.Forbidden,
              HttpStatus.FORBIDDEN,
            );
          }
          break;
        default:
          throw new CustomHttpError(
            ErrorAuth.Unauthorized,
            HttpStatus.UNAUTHORIZED,
          );
      }

      return false;
    }
  }
}
