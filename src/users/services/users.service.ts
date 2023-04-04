import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDTO, UserToProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { UsersEntity } from '../entities/users.entity';
import { UsersProjectEntity } from '../entities/usersProject.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(UsersProjectEntity)
    private readonly userProjectRepository: Repository<UsersProjectEntity>,
  ) {}

  public async createUser(body: UserDTO): Promise<UsersEntity> {
    try {
      const password = await bcrypt.hash(
        body.password,
        process.env.HASH_SALT * 1,
      );
      body.password = password;
      const user = await this.userRepository.save(body);

      if (!user)
        throw new ErrorManager({
          message: 'We could not create the user',
          type: 'BAD_REQUEST',
        });
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async relationToProject(
    body: UserToProjectDTO,
  ): Promise<UsersProjectEntity> {
    try {
      const userToProject = await this.userProjectRepository.save(body);
      if (!userToProject)
        throw new ErrorManager({
          message: 'We could not create the relation between user and project',
          type: 'BAD_REQUEST',
        });
      return userToProject;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findUsers(): Promise<UsersEntity[]> {
    try {
      const users: UsersEntity[] = await this.userRepository.find();
      if (users.length === 0)
        throw new ErrorManager({
          message: 'You dont have users yet',
          type: 'BAD_REQUEST',
        });

      return users;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findUserById(id: string): Promise<UsersEntity> {
    try {
      const user: UsersEntity = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .leftJoinAndSelect('user.projectIncludes', 'projectIncludes')
        .leftJoinAndSelect('projectIncludes.project', 'project')
        .getOne();
      if (!user) {
        throw new ErrorManager({
          message: 'User not found',
          type: 'BAD_REQUEST',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findBy({
    key,
    value,
  }: {
    key: keyof UserDTO;
    value: any;
  }): Promise<UsersEntity> {
    try {
      const user: UsersEntity = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne();
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateUser(
    body: UserUpdateDTO,
    id: string,
  ): Promise<UpdateResult> {
    try {
      const user = await this.userRepository.update(id, body);
      if (user.affected === 0) {
        throw new ErrorManager({
          message: 'User not found to update',
          type: 'BAD_REQUEST',
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult> {
    try {
      const user = await this.userRepository.softDelete(id);
      if (user.affected === 0) {
        throw new ErrorManager({
          message: 'User not found to delete',
          type: 'BAD_REQUEST',
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
