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

  async getHomeworkByChild(userId: number) {
    const homework = await this.homeworksRepository.findOne({
      where: {
        child: { id: userId },
      },
    });
    return homework;
  }

  async createHomework(userId: number, dto: CreateHomeworkDto) {
    const user = await this.usersService.getUserById(userId);
    const child = await this.usersService.getUserById(dto.childId);

    if (user.role !== RolesEnum.PARENT) {
      throw new UnauthorizedException('부모만 숙제를 작성할 수 있습니다.');
    }
    if (child.role !== RolesEnum.CHILD) {
      throw new BadRequestException(`id ${child.id}님은 학생이 아닙니다.`);
    }
    if (user.family.id !== child.family.id) {
      throw new UnauthorizedException(
        '자기 아이들의 숙제만 작성이 가능합니다.',
      );
    }

    const homework = this.homeworksRepository.create({
      ...dto,
      author: { id: userId },
      child: { id: dto.childId },
    });

    const newHomework = await this.homeworksRepository.save(homework);
    return newHomework;
  }

  async updateHomework(
    userId: number,
    homeworkId: number,
    dto: UpdateHomeworkDto,
  ) {
    const homework = await this.homeworksRepository.findOne({
      where: { id: homeworkId },
      relations: ['author'],
    });

    if (!homework) {
      throw new NotFoundException(`id:${homeworkId} Homework가 없습니다.`);
    }
    if (homework.author.id !== userId) {
      throw new UnauthorizedException(
        '본인이 작성한 숙제만 수정할 수 있습니다.',
      );
    }

    const { title, range, dueDate } = dto;
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

  async doHomework(userId: number, homeworkId: number) {
    const homework = await this.homeworksRepository.findOne({
      where: { id: homeworkId },
      relations: ['child'],
    });
    if (!homework) {
      throw new NotFoundException(`id:${homeworkId} Homework가 없습니다.`);
    }
    if (homework.child.id !== userId) {
      throw new UnauthorizedException('본인의 숙제가 아닙니다.');
    }
    if (homework.isDone) {
      throw new BadRequestException('이미 완료된 숙제입니다.');
    }
    const newHomework = await this.homeworksRepository.save({
      ...homework,
      isDone: true,
    });
    return newHomework;
  }

  async deleteHomework(userId: number, homeworkId: number) {
    const homework = await this.homeworksRepository.findOne({
      where: { id: homeworkId },
      relations: ['author'],
    });
    if (!homework) {
      throw new NotFoundException(`id:${homeworkId} Homework가 없습니다.`);
    }
    if (homework.author.id !== userId) {
      throw new UnauthorizedException(
        '본인이 작성한 숙제만 삭제할 수 있습니다.',
      );
    }
    await this.homeworksRepository.delete(homeworkId);
    return `id: ${homeworkId} was deleted.`;
  }
}
