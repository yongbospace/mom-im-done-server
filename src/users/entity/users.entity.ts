import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { HomeworksModel } from 'src/homeworks/entity/homeworks.entity';
import { UserFamilyModel } from './user-family.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { propertyValidationMessage } from 'src/common/validation-message/property.validation.message';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 12,
    unique: true,
  })
  @IsString({ message: stringValidationMessage })
  @Length(2, 12, { message: lengthValidationMessage })
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: propertyValidationMessage })
  email: string;

  @Column()
  @IsString()
  @Length(8, 12, { message: lengthValidationMessage })
  /**
   * toPlainOnly : dto => JSON(response)만 제외
   * toClassOnly : JSON => dto(request)만 제외
   */
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
