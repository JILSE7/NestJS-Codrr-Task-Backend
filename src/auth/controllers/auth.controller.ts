import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDTO } from '../dto/auth.dto';
import { IAuthBody } from '../interfaces';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() { username, password }: AuthDTO) {
    const userValidate = await this.authService.validateUser(
      username,
      password,
    );
    console.log(userValidate);
    if (!userValidate) {
      throw new UnauthorizedException('Data not valid');
    }

    return this.authService.generateJWT(userValidate);
  }
}
