import { Injectable, NotFoundException } from '@nestjs/common';
import { HomeworksModel } from './entity/homeworks.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { NotFoundError } from 'rxjs';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworksService {
  constructor(
    @InjectRepository(HomeworksModel)
    private readonly homeworksRepository: Repository<HomeworksModel>,
  ) {}

  async createHomework(dto: CreateHomeworkDto) {
    return await this.homeworksRepository.save({
      ...dto,
    });
  }

  getAllHomeworks() {
    return this.homeworksRepository.find();
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
