import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsService } from 'src/projects/services/projects.service';
import { ErrorManager } from 'src/utils/error.manager';
import { Repository } from 'typeorm';
import { TasksDTO } from '../dto/tasks.dto';
import { TasksEntity } from '../entities/tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksEntity)
    private readonly tasksRepository: Repository<TasksEntity>,

    private readonly projectsService: ProjectsService,
  ) {}

  public async createTask(
    body: TasksDTO,
    projectId: string,
  ): Promise<TasksEntity> {
    try {
      const project = await this.projectsService.findProjectById(projectId);
      if (!project)
        throw new ErrorManager({
          message: 'Project not found',
          type: 'NOT_FOUND',
        });
      return await this.tasksRepository.save({
        ...body,
        project,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getByProjectId(projectId: string): Promise<TasksEntity[]> {
    try {
      const project = await this.projectsService.findProjectById(projectId);
      if (!project)
        throw new ErrorManager({
          message: 'Project not found',
          type: 'NOT_FOUND',
        });
      return await this.tasksRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.project_id', 'project')
        .where({ project })
        .getMany();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
