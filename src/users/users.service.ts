import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';
import { RolesEnum } from './const/roles.const';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}
  getUsers() {
    return this.usersRepository.find({
      relations: {
        homeworks: true,
        parents: true,
        children: true,
      },
    });
  }

  async createUser(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password' | 'role'>,
  ) {
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });
    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 별명입니다.');
    }

    const emailExists = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });
    if (emailExists) {
      throw new BadRequestException('이미 존재하는 E-mail입니다.');
    }

    const userObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    const newUser = await this.usersRepository.save(userObject);
    return newUser;
  }

  getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getChildren(userId: number) {
    return await this.usersRepository.find({
      where: {
        parents: {
          id: userId,
        },
      },
      relations: {
        parents: true,
        children: true,
      },
    });
  }

  async takeChild(userId: number, childId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        children: true,
      },
    });

    return await this.usersRepository.save({
      ...user,
      children: [...user.children, { id: childId }],
    });
  }
}
