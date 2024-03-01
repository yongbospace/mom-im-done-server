import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { BaseModel } from './entity/base.entity';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { ConfigService } from '@nestjs/config';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from './const/env-key.const';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * <Cursor Paginate Response>
   *    date: Data[],
   *    cursor: { after : 마지막 data의 ID}
   *    count: 응답한 데이터 갯수
   *    next: 다음 요청시 사용할 URL
   *
   * <Page Paginate Response>
   *    date: Data[],
   *    total: 전체 데이터 갯수
   */

  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    // paginate은 repository.find()사용하므로 필수, 제너릭에 Entity 필요
    repository: Repository<T>,
    // where, order 옵션을 필요시 override
    overrideFindOptions: FindManyOptions<T> = {},
    // nextUrl에 사용
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, overrideFindOptions, path);
    }
  }

  // prive : 각 모듈에서 사용시 page/cursor는 자동완성 필요 X, common에서만 사용

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto);
    const [data, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });
    return {
      data,
      total: count,
    };
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);
    const data = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });
    const lastItem =
      data.length > 0 && data.length === dto.take
        ? data[data.length - 1]
        : null;

    const protocal = this.configService.get<string>(ENV_PROTOCOL_KEY);
    const host = this.configService.get<string>(ENV_HOST_KEY);
    const nextUrl = lastItem && new URL(`${protocal}://${host}/${path}`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {
          nextUrl.searchParams.append(key, dto[key]);
        }
      }
      let key = null;
      if (dto.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }
      nextUrl.searchParams.append(key, lastItem.id.toString());
    }
    return {
      data,
      cursor: { after: lastItem?.id ?? null },
      count: data.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  // 적용되지 않은 쿼리 받지 않도록, main.ts에 아래 설정
  // whitelist: true, forbidNonWhitelisted: true,
  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    /**
     * where/order 외에 다른 옵션도 커스텀하여 생성가능
     *  where__id__more__than: 1, : 3개로 스플릿 operator(o)
     *  order__createdAt: 'ASC' : 2개로 스플릿 operator(x)
     */

    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = { ...where, ...this.parseOptionsFilter(key, value) };
      } else if (key.startsWith('order__')) {
        order = { ...order, ...this.parseOptionsFilter(key, value) };
      }
    }
    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseOptionsFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> | FindOptionsOrder<T> = {};
    const split = key.split('__');
    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `key: ${key} where 필터는 '__'로 split 했을때 길이가 2 또는 3이어야 합니다.`,
      );
    }

    if (split.length === 2) {
      // key.length가 2일때 ex) where:{id:1}
      const [_, field] = split;
      options[field] = value;
    } else {
      // key.length가 3일때 ex) where:{id:MoreThan(1)}
      // FILTER_MAPPER 설정하여 utility 가져오기
      const [_, field, operator] = split;
      options[field] = FILTER_MAPPER[operator](value);
      /**
       * where__id__between = 1,2 경우
       * const values = value.toString().split(',');
       * if (operator === 'between') {
       *    options[field] = FILTER_MAPPER[operator](values[0], values[1]);
       * } else {
       *    options[field] = FILTER_MAPPER[operator](value);
       * }
       */
    }
    return options;
  }
}
