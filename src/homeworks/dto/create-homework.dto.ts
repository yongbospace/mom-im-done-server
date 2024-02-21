import { PickType } from '@nestjs/mapped-types';
import { HomeworksModel } from '../entity/homeworks.entity';

export class CreateHomeworkDto extends PickType(HomeworksModel, [
  'title',
  'range',
  'dueDate',
]) {}
