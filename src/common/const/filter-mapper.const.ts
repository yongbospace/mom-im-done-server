import {
  And,
  Any,
  ArrayContainedBy,
  ArrayContains,
  ArrayOverlap,
  Between,
  Equal,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  ILike,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

export const FILTER_MAPPER = {
  and: And,
  any: Any,
  array_contained_by: ArrayContainedBy,
  array_contains: ArrayContains,
  array_overlap: ArrayOverlap,
  between: Between,
  equal: Equal,
  in: In,
  is_null: IsNull,
  less_than: LessThan,
  less_than_or_equal: LessThanOrEqual,
  i_like: ILike,
  like: Like,
  more_than: MoreThan,
  more_than_or_equal: MoreThanOrEqual,
  not: Not,
};
