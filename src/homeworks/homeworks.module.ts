import { Module } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { HomeworksController } from './homeworks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworksModel } from './entity/homeworks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HomeworksModel])],
  controllers: [HomeworksController],
  providers: [HomeworksService],
})
export class HomeworksModule {}
