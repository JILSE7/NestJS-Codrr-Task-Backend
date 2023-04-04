import { BaseEntity } from '../../config/base.entity';
import { IProject } from '../../interfaces';
import { UsersProjectEntity } from '../../users/entities/usersProject.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { TasksEntity } from '../../tasks/entities/tasks.entity';

@Entity({ name: 'projects' })
export class ProjectsEntity extends BaseEntity implements IProject {
  @Column()
  name: string;
  @Column()
  description: string;
  // Uno a muchos
  @OneToMany(() => UsersProjectEntity, (userProject) => userProject.project)
  usersIncludes: UsersProjectEntity[];

  @OneToMany(() => TasksEntity, (task) => task.project)
  tasks: TasksEntity[];
}
