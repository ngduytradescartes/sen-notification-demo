import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';

import { ParseLimitPipe } from 'src/pipelines/limit.pipe';
import { ParseOffsetPipe } from 'src/pipelines/offset.pipe';
import { NewUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  // Admin route
  @Post()
  async createUser(@Body() body: NewUserDto) {
    return await this.service.createUser(body);
  }

  // User route
  @Get('/all')
  async getUsers(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getUsers({ search, offset, limit });
  }
  @Patch('/update-read-notification/:id')
  async updateReadNotification(
    @Param() params: { id: string },
    @Body('user') user: string,
  ) {
    return this.service.updateReadNotification(params.id, user);
  }
  @Patch('/update-read-notifications')
  async updateReadNotifications(@Body('user') user: string) {
    return this.service.updateReadNotifications(user);
  }
}
