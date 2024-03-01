import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
  // page ? pagePagination : cursorPagination
  @IsNumber()
  @IsOptional()
  page?: number;

  // order 'ASC' 일때, 마지막 데이터 ID
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  // order 'DESC' 일때, 마지막 데이터 ID
  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // CreatedAt 기준 오름차 or 내림차
  // dto에 인수 미입력 시 그대로 작동(기본값X) 기본값 적용하려면 아래코드 필요
  // main.ts : app.useGlobalPipes(new ValidationPipe({ transform: true }));
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt?: 'ASC' | 'DESC' = 'ASC';

  // 한번에 받아올 데이터 갯수
  @IsNumber()
  take: number = 10;
}
