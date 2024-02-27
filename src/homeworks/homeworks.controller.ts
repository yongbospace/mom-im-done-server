import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const/roles.const';
import { IsPublic } from 'src/common/decorator/is-public-decorator';

@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Get()
  @IsPublic()
  getHomeworks() {
    return this.homeworksService.getAllHomeworks();
  }

  @Get(':homeworkId')
  getHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.homeworksService.getHomeworkById(homeworkId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async postHomework(
    @User() user: UsersModel,
    @Body() body: CreateHomeworkDto,
  ) {
    const homework = await this.homeworksService.createHomework(user.id, body);
    return homework;
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
  @Roles(RolesEnum.ADMIN)
  deleteHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.homeworksService.deleteHomework(homeworkId);
  }
}
