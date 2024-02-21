import { IsBoolean, IsISO8601, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class HomeworksModel extends BaseModel {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  range: string;

  @Column()
  @IsISO8601()
  dueDate: string;

  @Column({ default: false })
  @IsBoolean()
  isDone: boolean;
}
