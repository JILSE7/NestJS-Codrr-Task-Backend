import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessLevel } from 'src/auth/decorators';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TasksDTO } from '../dto/tasks.dto';
import { TasksService } from '../services/tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService, // private readonly projectsService: ProjectsService
  ) {}

  @AccessLevel('DEVELOPER')
  @Post('create/:projectId')
  public async createTask(
    @Body() body: TasksDTO,
    @Param('projectId') projectId: string,
  ) {
    return await this.tasksService.createTask(body, projectId);
  }

  /* @Get('task/:projectId')
  public async findByTaskId(@Param('projectId') projectId: string) {
    return await this.tasksService.getByProjectId(projectId);
  } */
}
