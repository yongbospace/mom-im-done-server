import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { UsersModel } from '../entity/users.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UsersModel;
    if (!user) {
      throw new InternalServerErrorException(
        '@User는 AccessToken과 같이 사용하세요. User 정보가 없습니다.',
      );
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
