import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/constans';
import { UsersService } from 'src/users/services/users.service';
import { useToken } from 'src/utils/use.token';
import { IUseToken } from '../interfaces';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
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

    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers['codrr_token'];

    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Token not found');
    }

    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }

    if (manageToken.isExpired)
      throw new UnauthorizedException('Token is expired');

    const sub = manageToken.sub;
    const user = await this.userService.findUserById(sub);

    if (!user) throw new UnauthorizedException('User not found');

    //Inyectar datos en el request por medio de los guards y namespaces
    request.idUser = user.id;
    request.roleUser = user.role;

    return true;
  }
}
