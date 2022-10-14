import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsService } from './events.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
