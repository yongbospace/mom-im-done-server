import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginateHomeworkDto {
  @IsNumber()
  @IsOptional()
  where__id_less_than?: number;

  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  // CreatedAt 기준 오름차 or 내림차
  // dto에 인수 미입력 시 그대로 작동(기본값X) 기본값 적용하려면 아래코드 필요
  // main.ts : app.useGlobalPipes(new ValidationPipe({ transform: true }));
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createAt?: 'ASC' | 'DESC' = 'DESC';

  // 한번에 받아올 데이터 수
  @IsNumber()
  @IsOptional()
  take: number = 10;
}
