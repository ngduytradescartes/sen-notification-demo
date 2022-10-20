import {
  Controller,
  Get,
  Query,
  Post,
  Patch,
  Param,
  Sse,
  Body,
} from '@nestjs/common';

import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { EventsService } from '../events.service';
import { NotificationDto, UpdateNotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';

@Controller('/notification')
export class NotificationController {
  constructor(
    private readonly service: NotificationService,
    private readonly eventsService: EventsService,
  ) {}
  // Initialize SSE
  @Sse('sse')
  events() {
    return this.eventsService.subscribe();
  }
  // User route
  @Get('/all')
  async getNotifications(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getNotifications({ search, offset, limit });
  }

  // Admin Route
  @Patch('/:id')
  async updateNotification(
    @Body() body: UpdateNotificationDto,
    @Param() params: { id: string },
  ) {
    return this.service.updateNotification(params.id, body);
  }
  @Post()
  async createNotifications(@Body() body: NotificationDto) {
    const notification = await this.service.createNotification(body);
    this.eventsService.emit(notification);
    return notification;
  }
}
