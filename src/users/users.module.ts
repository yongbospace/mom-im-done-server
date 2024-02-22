import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { UserChildrenModel } from './entity/user-children.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersModel, UserChildrenModel])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
