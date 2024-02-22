import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Post()
  async postHomework(@Body() body: CreateHomeworkDto) {
    const homework = await this.homeworksService.createHomework(body);
    return homework;
  }

  @Get()
  getHomeworks() {
    return this.homeworksService.getAllHomeworks();
  }

  @Get(':homeworkId')
  getHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.homeworksService.getHomeworkById(homeworkId);
  }

  @Patch(':homeworkId')
  patchHomework(
    @Param('homeworkId', ParseIntPipe) homeworkId: number,
    @Body() body: UpdateHomeworkDto,
  ) {
    return this.homeworksService.updateHomework(homeworkId, body);
  }

  @Patch(':homeworkId/do')
  doHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.homeworksService.doHomework(homeworkId);
  }

  @Delete(':homeworkId')
  deleteHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.homeworksService.deleteHomework(homeworkId);
  }
}
