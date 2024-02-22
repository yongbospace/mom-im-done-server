import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeworkDto } from './create-homework.dto';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class UpdateHomeworkDto extends PartialType(CreateHomeworkDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  range?: string;

  @IsISO8601()
  @IsOptional()
  dueDate?: string;
}
