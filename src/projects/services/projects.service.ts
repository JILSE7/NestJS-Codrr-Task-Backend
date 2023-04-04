import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ACCESS_LEVELS } from 'src/constans';
import { HttpCustomService } from 'src/providers/http/http.service';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersProjectEntity } from 'src/users/entities/usersProject.entity';
import { UsersService } from 'src/users/services/users.service';
import { ErrorManager } from 'src/utils/error.manager';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { ProjectsEntity } from '../entities/projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectRespository: Repository<ProjectsEntity>,
    @InjectRepository(UsersProjectEntity)
    private readonly userProjectRepository: Repository<UsersProjectEntity>,

    private readonly userService: UsersService,
    private readonly httpService: HttpCustomService,
  ) {}

  public async createProject(body: ProjectDTO, userId: string): Promise<any> {
    try {
      const user = await this.userService.findUserById(userId);
      const project = await this.projectRespository.save(body);
      return await this.userProjectRepository.save({
        access_level: ACCESS_LEVELS.OWNER,
        project,
        user,
      });
      // return await this.projectRespository.save(project);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findProjects(): Promise<ProjectsEntity[]> {
    try {
      return await this.projectRespository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findProjectById(id: string): Promise<ProjectsEntity> {
    try {
      return await this.projectRespository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.usersIncludes', 'usersIncludes')
        .leftJoinAndSelect('usersIncludes.user', 'user')
        .where({ id })
        .getOne();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async listApi() {
    return this.httpService.apiFindAll();
  }

  public async updateProject(
    body: ProjectUpdateDTO,
    id: string,
  ): Promise<UpdateResult> {
    try {
      const project = await this.projectRespository.update(id, body);
      if (project.affected === 0)
        throw ErrorManager.createSignatureError('Project not found');
      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteProject(id: string): Promise<DeleteResult> {
    try {
      const project = await this.projectRespository.delete(id);
      if (project.affected === 0)
        throw ErrorManager.createSignatureError('Project not found');

      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
