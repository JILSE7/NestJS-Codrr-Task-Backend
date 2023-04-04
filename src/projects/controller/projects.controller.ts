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
import { ApiTags } from '@nestjs/swagger';
import { PublicAccess, RolesAccess } from 'src/auth/decorators';
import { AccessLevel } from 'src/auth/decorators/acces-level.decorator';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ErrorManager } from 'src/utils/error.manager';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { ProjectsService } from '../services/projects.service';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}
  @RolesAccess('CREATOR')
  @Post('create/userOwner/:userId')
  public async registerProject(
    @Body() body: ProjectDTO,
    @Param('userId') userId: string,
  ) {
    try {
      return await this.projectService.createProject(body, userId);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Get('all')
  public async findAllProjects() {
    return await this.projectService.findProjects();
  }

  @Get(':projectId')
  public async findAProjectById(@Param('projectId') projectId: string) {
    return await this.projectService.findProjectById(projectId);
  }

  @PublicAccess()
  @Get('list/api')
  public async listApi() {
    return this.projectService.listApi();
  }

  @AccessLevel('OWNER')
  @Put('edit/:projectId')
  public async updateProject(
    @Param('projectId') projectId: string,
    @Body() body: ProjectUpdateDTO,
  ) {
    return await this.projectService.updateProject(body, projectId);
  }

  @Delete('delete/:projectId')
  public async deleteProjectByprojectId(@Param('projectId') projectId: string) {
    return await this.projectService.deleteProject(projectId);
  }
}
