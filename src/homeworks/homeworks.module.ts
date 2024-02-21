import { Module } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { HomeworksController } from './homeworks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([HomeworksModule])],
  controllers: [HomeworksController],
  providers: [HomeworksService],
})
export class HomeworksModule {}
