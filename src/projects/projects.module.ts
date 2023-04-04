import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEntity } from './entities/projects.entity';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controller/projects.controller';
import { UsersProjectEntity } from 'src/users/entities/usersProject.entity';
import { UsersService } from 'src/users/services/users.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { HttpCustomService } from 'src/providers/http/http.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectsEntity,
      UsersProjectEntity,
      ProvidersModule,
    ]),
  ],
  providers: [ProjectsService, UsersService, HttpCustomService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
