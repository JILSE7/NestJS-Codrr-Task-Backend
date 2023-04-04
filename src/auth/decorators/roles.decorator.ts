import { SetMetadata } from '@nestjs/common';
import { ROLES, ROLES_KEY } from 'src/constans';

export const RolesAccess = (...roles: Array<keyof typeof ROLES>) =>
  SetMetadata(ROLES_KEY, roles);
