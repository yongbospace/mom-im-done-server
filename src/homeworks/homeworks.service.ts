import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeworksModel } from './entity/homeworks.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { UsersService } from 'src/users/users.service';
import { RolesEnum } from 'src/users/const/roles.const';

@Injectable()
export class HomeworksService {
  constructor(
    @InjectRepository(HomeworksModel)
    private readonly homeworksRepository: Repository<HomeworksModel>,
    private readonly usersService: UsersService,
  ) {}

  getAllHomeworks() {
    return this.homeworksRepository.find({
      relations: {
        author: true,
        child: true,
      },
    });
  }

  async getHomeworkById(homeworkId: number) {
    const homework = await this.homeworksRepository.findOne({
      where: {
        id: homeworkId,
      },
    });

    if (!homework) {
      throw new NotFoundException(`id:${homeworkId} Homework가 없습니다.`);
    }

    return homework;
  }

  async createHomework(userId: number, dto: CreateHomeworkDto) {
    const user = await this.usersService.getUserById(userId);
    const child = await this.usersService.getUserById(dto.childId);

    if (user.role !== RolesEnum.PARENT) {
      throw new UnauthorizedException('부모만 숙제를 시킬 수 있습니다.');
    }

    if (child.role !== RolesEnum.CHILD) {
      throw new BadRequestException(`id ${child.id}님은 학생이 아닙니다.`);
    }

    if (user.family.id !== child.family.id) {
      throw new UnauthorizedException(
        '같은 가족에게만 숙제를 부여할 수 있습니다.',
      );
    }

    return await this.homeworksRepository.save({
      ...dto,
      author: {
        id: userId,
      },
      child: {
        id: dto.childId,
      },
    });
  }

  async updateHomework(homeworkId: number, dto: UpdateHomeworkDto) {
    const homework = await this.homeworksRepository.findOne({
      where: {
        id: homeworkId,
      },
    });

    const { title, range, dueDate } = dto;

    if (!homework) {
      throw new NotFoundException(`id:${homeworkId} Homework가 없습니다.`);
    }
    if (title) {
      homework.title = title;
    }
    if (range) {
      homework.range = range;
    }
    if (dueDate) {
      homework.dueDate = dueDate;
    }

    const newHomework = await this.homeworksRepository.save(homework);

    return newHomework;
  }

  async doHomework(homeworkId: number) {
    const homework = await this.homeworksRepository.findOne({
      where: { id: homeworkId },
    });

    if (!homework) {
      throw new NotFoundException(`id:${homeworkId} Homework가 없습니다.`);
    }

    const newHomework = await this.homeworksRepository.save({
      ...homework,
      isDone: true,
    });

    return newHomework;
  }

  async deleteHomework(homeworkId: number) {
    const homework = await this.homeworksRepository.findOne({
      where: { id: homeworkId },
    });

    if (!homework) {
      throw new NotFoundException(`id:${homeworkId} Homework가 없습니다.`);
    }

    await this.homeworksRepository.delete(homeworkId);

    return `id: ${homeworkId} was deleted.`;
  }
}
