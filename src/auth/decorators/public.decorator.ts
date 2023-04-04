import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from 'src/constans';

export const PublicAccess = () => SetMetadata(PUBLIC_KEY, true);
