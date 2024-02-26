import { BaseModel } from 'src/common/entity/base.entity';
import { Entity, OneToMany } from 'typeorm';
import { UsersModel } from './users.entity';

@Entity()
export class UserFamilyModel extends BaseModel {
  @OneToMany(() => UsersModel, (user) => user.family)
  users: UsersModel[];
}
