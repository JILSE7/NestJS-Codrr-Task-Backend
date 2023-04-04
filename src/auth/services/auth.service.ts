import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersEntity } from 'src/users/entities/users.entity';
import { PayloadToken } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly userServices: UsersService) {}

  public async validateUser(username: string, pass: string): Promise<any> {
    const userByUsername = await this.userServices.findBy({
      key: 'username',
      value: username,
    });
    console.log({ userByUsername });

    if (userByUsername) {
      const match = await bcrypt.compare(pass, userByUsername.password);
      console.log({ match });
      if (match) return userByUsername;
    }

    const userByEmail = await this.userServices.findBy({
      key: 'email',
      value: username,
    });
    console.log({ userByEmail });

    if (userByEmail) {
      const match = await bcrypt.compare(pass, userByEmail.password);
      if (match) return userByEmail;
    }
  }

  public async singJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: number | string;
  }) {
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  public async generateJWT(user: UsersEntity): Promise<any> {
    const userFound = await this.userServices.findUserById(user.id);
    const payload: PayloadToken = {
      role: userFound.role,
      sub: userFound.id,
    };

    return {
      accessToken: await this.singJWT({
        payload,
        secret: process.env.JWT_SECRET,
        expires: '1h',
      }),
      user: userFound,
    };
  }
}
