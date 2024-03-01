import { Module } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { HomeworksController } from './homeworks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworksModel } from './entity/homeworks.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomeworksModel]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [HomeworksController],
  providers: [HomeworksService],
})
export class HomeworksModule {}
