import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
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

  @Get('family/me')
  @UseGuards(AccessTokenGuard)
  async getFamily(@User() user: UsersModel) {
    return await this.usersService.getFamilyByUser(user.id);
  }

  @Post('/family')
  @UseGuards(AccessTokenGuard)
  async postJoinFamily(
    @User() user: UsersModel,
    @Query('relativeId') relativeId?: number,
  ) {
    return await this.usersService.joinFamily(user.id, relativeId);
  }

  @Delete('/family')
  @UseGuards(AccessTokenGuard)
  async deleteFamily(@User() user: UsersModel) {
    return await this.usersService.leaveFamily(user.id);
  }
}
