import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';

import { AuthModule } from 'src/auth/auth.module';
import { UserFamilyModel } from './entity/user-family.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel, UserFamilyModel]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
