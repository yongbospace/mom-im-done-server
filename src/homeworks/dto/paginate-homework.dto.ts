import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

export class PaginateHomeworkDto extends BasePaginationDto {}
