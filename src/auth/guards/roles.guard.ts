import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ADMIN_KEY, PUBLIC_KEY, ROLES, ROLES_KEY } from 'src/constans';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, //perimite leer atributos de decoradores
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest<Request>();

    const { roleUser } = request;

    if (!roles) {
      if (!admin) return true;
      if (!roles && admin && roleUser === ROLES.ADMIN) return true;
      else throw new UnauthorizedException('Do not have permission to access');
    }

    if (roleUser === ROLES.ADMIN) return true;

    const isAuth = roles.includes(ROLES[roleUser]);

    if (!isAuth) {
      throw new UnauthorizedException(
        'Do not have permission to realice this operation',
      );
    }

    return true;
  }
}
