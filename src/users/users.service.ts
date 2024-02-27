import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';
import { UserFamilyModel } from './entity/user-family.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(UserFamilyModel)
    private readonly userFamilyRepository: Repository<UserFamilyModel>,
  ) {}
  getAllUsers() {
    return this.usersRepository.find({
      relations: ['homeworks', 'family'],
    });
  }

  async createUser(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password' | 'role'>,
  ) {
    const nicknameExists = await this.usersRepository.exists({
      where: { nickname: user.nickname },
    });
    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 별명입니다.');
    }

    const emailExists = await this.usersRepository.exists({
      where: { email: user.email },
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

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getUserById(id: number) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: { family: true },
    });
  }

  async getFamilyByUser(userId: number) {
    const family = await this.userFamilyRepository.findOne({
      where: {
        users: {
          id: userId,
        },
      },
      relations: {
        users: true,
      },
    });
    if (!family) {
      throw new BadRequestException('아직 가족을 선택하지 않으셨습니다.');
    }
    return family;
  }

  async findFamily(userId: number) {
    return await this.userFamilyRepository.findOne({
      where: { users: { id: userId } },
      relations: { users: true },
    });
  }

  async joinFamily(userId: number, relativeId?: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const userFamily = await this.findFamily(userId);
    const relative = relativeId
      ? await this.usersRepository.findOne({ where: { id: relativeId } })
      : null;

    if (userFamily) {
      if (!relativeId) {
        throw new BadRequestException('user는 이미 가족이 설정되어 있습니다.');
      }

      const relativeFamily = await this.findFamily(relativeId);

      if (relativeFamily) {
        throw new BadRequestException(
          'user, relative 모두 이미 가족이 설정되어 있습니다.',
        );
      }

      const users = await this.usersRepository.find({
        where: { family: { id: userFamily.id } },
      });

      userFamily.users.push(...users, relative);
      await this.userFamilyRepository.save(userFamily);
    } else {
      if (relativeId) {
        const relativeFamily = await this.findFamily(relativeId);

        if (relativeFamily) {
          const relatives = await this.usersRepository.find({
            where: { family: { id: relativeFamily.id } },
          });
          relativeFamily.users.push(user, ...relatives);
          await this.userFamilyRepository.save(relativeFamily);
        } else {
          const newFamily = this.userFamilyRepository.create({
            users: [user, relative],
          });
          await this.userFamilyRepository.save(newFamily);
        }
      } else {
        const newFamily = this.userFamilyRepository.create({
          users: [user, relative],
        });
        await this.userFamilyRepository.save(newFamily);
      }
    }

    return true;
  }

  async leaveFamily(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { family: true },
    });
    const userFamily = await this.userFamilyRepository.findOne({
      where: { users: { id: userId } },
      relations: { users: true },
    });
    if (!userFamily) {
      throw new NotFoundException('가족이 설정되어 있지 않습니다.');
    }
    userFamily.users = userFamily.users.filter(
      (relative) => relative.id !== userId,
    );
    user.family = null;
    await this.usersRepository.save(user);

    const familyReminder = await this.usersRepository.exists({
      where: { family: { id: userFamily.id } },
    });
    if (!familyReminder) {
      await this.userFamilyRepository.remove(userFamily);
    }
    return true;
  }
}
