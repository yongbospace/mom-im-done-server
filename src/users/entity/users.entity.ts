import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { UserChildrenModel } from './user-children.entity';
import { HomeworksModel } from 'src/homeworks/entity/homeworks.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    unique: true,
  })
  @IsString()
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.PARENT,
  })
  role: RolesEnum;

  @OneToMany(() => HomeworksModel, (homework) => homework.child)
  homeworks: HomeworksModel[];

  @OneToMany(() => UserChildrenModel, (ucm) => ucm.child)
  children: UserChildrenModel[];

  @Column({ default: 0 })
  score: number;
}
