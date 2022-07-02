import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadToken } from '../models/token.model';
import { Role } from '../models/roles.model';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    // ['admin', 'customer', 'super-admin']
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;
    // { role: 'admin', sub: '12312312' }
    const isAllowed = roles.some((role) => role === user.role);
    if (!isAllowed) {
      throw new ForbiddenException(
        'Your role is not allowed to this request..',
      );
    }
    return isAllowed;
  }
}
