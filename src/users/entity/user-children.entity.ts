import { BaseModel } from 'src/common/entity/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { UsersModel } from './users.entity';

@Entity()
export class UserChildrenModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.children)
  child: UsersModel;
}
