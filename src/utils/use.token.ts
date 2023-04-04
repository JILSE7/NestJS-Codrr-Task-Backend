import { AuthTokenResult, IUseToken } from 'src/auth/interfaces';
import * as jwt from 'jsonwebtoken';

export const useToken = (token: string): IUseToken | string => {
  try {
    const decoded = jwt.decode(token) as AuthTokenResult;
    const { sub, role, exp } = decoded;

    const currentDate = new Date();
    const expDate = new Date(exp);
    return {
      sub,
      role,
      isExpired: +expDate <= +currentDate / 1000,
    };
  } catch (error) {
    return 'Token is not valid';
  }
};
