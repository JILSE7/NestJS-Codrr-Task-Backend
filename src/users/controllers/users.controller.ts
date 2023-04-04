import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { RolesAccess } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserDTO, UserToProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @PublicAccess()
  @Post('register')
  public async registerUser(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }

  @Post('register-user-in-project')
  public async registerUserInProject(@Body() body: UserToProjectDTO) {
    return await this.userService.relationToProject(body);
  }
  // @RolesAccess('ADMIN')
  // @AdminAccess()
  @ApiHeader({
    name: 'codrr_token',
  })
  @RolesAccess('ADMIN')
  @Get('all')
  public async findAllUsers() {
    return await this.userService.findUsers();
  }

  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  @PublicAccess()
  @Get(':id')
  public async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @ApiParam({ name: 'id', required: true })
  @Put('edit/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() body: UserUpdateDTO,
  ) {
    return await this.userService.updateUser(body, id);
  }

  @ApiParam({ name: 'id', required: true })
  @Delete('delete/:id')
  public async deleteUserById(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
