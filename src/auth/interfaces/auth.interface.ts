import { ROLES } from 'src/constans/enums';

export interface PayloadToken {
  sub: string;
  role: ROLES;
}

export interface IAuthBody {
  username: string;
  password: string;
}

export interface AuthTokenResult {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface IUseToken {
  role: string;
  sub: string;
  isExpired: boolean;
}
