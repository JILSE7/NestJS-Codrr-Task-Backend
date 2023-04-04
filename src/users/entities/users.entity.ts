import { BaseEntity } from '../../config/base.entity';
import { ROLES } from '../../constans/enums';
import { IUser } from '../../interfaces';
import { Column, Entity, OneToMany } from 'typeorm';
import { UsersProjectEntity } from './usersProject.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity implements IUser {
  @Column()
  age: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @Column({ unique: true })
  username: string;

  @OneToMany(() => UsersProjectEntity, (userProject) => userProject.user)
  projectIncludes: UsersProjectEntity[];
}
