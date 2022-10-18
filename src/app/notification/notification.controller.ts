import {
  Controller,
  Get,
  Query,
  Post,
  Req,
  Patch,
  Param,
  Sse,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { EventsService } from '../events.service';
import { NotificationService } from './notification.service';

@Controller('/notification')
export class NotificationController {
  constructor(
    private readonly service: NotificationService,
    private readonly eventsService: EventsService,
  ) {}
  @Sse('sse')
  events() {
    return this.eventsService.subscribe();
  }
  @Get('/all')
  async getNotifications(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getNotifications({ search, offset, limit });
  }
  @Patch('/mark-all-as-read')
  async markAllAsRead(@Req() request: Request) {
    return this.service.markAllAsRead(request.body.user);
  }
  @Patch('/:id')
  async updateNotification(
    @Req() request: Request,
    @Param() params: { id: string },
  ) {
    return this.service.updateNotification(params.id, request.body);
  }
  @Patch('/mark-as-read/:id')
  async markAsRead(@Param() params: { id: string }, @Body('user') user: any) {
    return this.service.markAsReadOrUnread(params.id, user);
  }
  @Patch()
  async updateNotifications(@Req() request: Request) {
    return this.service.updateNotifications(request.body);
  }
  @Post()
  async createNotifications(@Req() request: Request) {
    this.eventsService.emit({ emitting: new Date().toISOString() });
    return this.service.newNotification(request.body);
  }
}
