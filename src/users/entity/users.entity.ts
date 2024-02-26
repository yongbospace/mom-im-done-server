import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { HomeworksModel } from 'src/homeworks/entity/homeworks.entity';
import { UserFamilyModel } from './user-family.entity';

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
  })
  role: RolesEnum;

  @OneToMany(() => HomeworksModel, (homework) => homework.child)
  homeworks: HomeworksModel[];

  @ManyToOne(() => UserFamilyModel, (family) => family.users, {
    nullable: true,
  })
  family: UserFamilyModel;

  @Column({ default: 0 })
  score: number;
}
