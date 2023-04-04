import { SetMetadata } from '@nestjs/common';
import { ACCESS_LEVELS, ACCESS_LEVEL_KEY, ROLES } from 'src/constans';

export const AccessLevel = (level: keyof typeof ACCESS_LEVELS) =>
  SetMetadata(ACCESS_LEVEL_KEY, level);
