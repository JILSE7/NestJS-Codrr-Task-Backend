import { BaseEntity } from '../../config/base.entity';
import { ACCESS_LEVELS } from '../../constans/enums';
import { ProjectsEntity } from '../../projects/entities/projects.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity({ name: 'users_project' })
export class UsersProjectEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ACCESS_LEVELS })
  access_level: ACCESS_LEVELS;

  //Muchos a uno
  @ManyToOne(() => UsersEntity, (user) => user.projectIncludes)
  user: UsersEntity;
  @ManyToOne(() => ProjectsEntity, (project) => project.usersIncludes)
  project: ProjectsEntity;
}
