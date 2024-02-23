import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './entity/users.entity';
import { User } from './decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('child/me')
  @UseGuards(AccessTokenGuard)
  async getChildren(@User() user: UsersModel) {
    return this.usersService.getChildren(user.id);
  }

  @Post('/child/:childId')
  @UseGuards(AccessTokenGuard)
  async postChild(
    @User() user: UsersModel,
    @Param('childId', ParseIntPipe) childId: number,
  ) {
    return await this.usersService.takeChild(user.id, childId);
  }
}
