import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  ACCESS_LEVEL_KEY,
  ADMIN_KEY,
  PUBLIC_KEY,
  ROLES,
  ROLES_KEY,
} from 'src/constans';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector, //perimite leer atributos de decoradores
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const access_level = this.reflector.get<number>(
      ACCESS_LEVEL_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest<Request>();

    const { roleUser, idUser } = request;

    if (!roles && !access_level) {
      if (!admin) return true;
      if (!roles && admin && roleUser === ROLES.ADMIN) return true;
      else throw new UnauthorizedException('Do not have permission to access');
    }

    if ([ROLES.ADMIN, ROLES.CREATOR].includes(ROLES[roleUser])) return true;

    const user = await this.userService.findUserById(idUser);

    const userExistInProject = user.projectIncludes.find(
      (project) => project.id === request.params.projectId,
    );

    if (!userExistInProject)
      throw new UnauthorizedException('You are not in this project');

    if (access_level !== userExistInProject.access_level)
      throw new UnauthorizedException(
        'You dont have access level for this project',
      );

    return true;
  }
}
