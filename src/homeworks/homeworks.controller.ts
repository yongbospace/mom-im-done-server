import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { ApiTags } from '@nestjs/swagger';
import { PaginateHomeworkDto } from './dto/paginate-homework.dto';

@ApiTags('homeworks')
@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Get()
  @IsPublic()
  getHomeworks(@Query() query: PaginateHomeworkDto) {
    return this.homeworksService.paginateHomework(query);
  }

  @Get(':homeworkId')
  getHomeworkByHomeworkId(
    @Param('homeworkId', ParseIntPipe) homeworkId: number,
  ) {
    return this.homeworksService.getHomeworkById(homeworkId);
  }

  @Get('child/me')
  getHomeworkByChild(@User() user: UsersModel) {
    return this.homeworksService.getHomeworkByChild(user.id);
  }

  @Post()
  async postHomework(
    @User() user: UsersModel,
    @Body() body: CreateHomeworkDto,
  ) {
    const homework = await this.homeworksService.createHomework(user.id, body);
    return homework;
  }

  @Patch(':homeworkId')
  @Roles(RolesEnum.ADMIN && RolesEnum.PARENT)
  patchHomework(
    @User() user: UsersModel,
    @Param('homeworkId', ParseIntPipe) homeworkId: number,
    @Body() body: UpdateHomeworkDto,
  ) {
    return this.homeworksService.updateHomework(user.id, homeworkId, body);
  }

  @Patch(':homeworkId/do')
  doHomework(
    @User() user: UsersModel,
    @Param('homeworkId', ParseIntPipe) homeworkId: number,
  ) {
    return this.homeworksService.doHomework(user.id, homeworkId);
  }

  @Delete(':homeworkId')
  @Roles(RolesEnum.ADMIN && RolesEnum.PARENT)
  deleteHomework(
    @User() user: UsersModel,
    @Param('homeworkId', ParseIntPipe) homeworkId: number,
  ) {
    return this.homeworksService.deleteHomework(user.id, homeworkId);
  }

  // Test Homeworks 생성
  @Post('random/generate')
  async postRandomHomeworks(@User() user: UsersModel) {
    await this.homeworksService.generateHomeworks(user.id);
    return true;
  }
}
