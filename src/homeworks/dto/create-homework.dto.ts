import { PickType } from '@nestjs/mapped-types';
import { HomeworksModel } from '../entity/homeworks.entity';
import { IsNumber } from 'class-validator';

export class CreateHomeworkDto extends PickType(HomeworksModel, [
  'title',
  'range',
  'dueDate',
]) {
  @IsNumber()
  childId: number;
}
