import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user';
import { ROLES_KEY } from '../decorators';
import { CustomHttpError } from '../errors/controlled';
import { ErrorAuth } from '../constants/errors';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const isAllowed = requiredRoles.some((role) => user.role === role);

    if (isAllowed) {
      return true;
    }

    throw new CustomHttpError(ErrorAuth.Unauthorized, HttpStatus.UNAUTHORIZED);
  }
}
