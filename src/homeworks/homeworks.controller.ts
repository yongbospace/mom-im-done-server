import { Controller } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';

@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}
}
