import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

import { User } from 'src/schemas/user.schema';
import { EnvironmentVariables } from 'src/config';
import { NewUserDto } from './user.dto';
import { MIN_OFFSET } from 'src/pipelines/offset.pipe';
import { MAX_LIMIT } from 'src/pipelines/limit.pipe';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private notificationService: NotificationService,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true });

  async getUsers({
    filter = {},
    search = '',
    offset = MIN_OFFSET,
    limit = MAX_LIMIT,
  }: {
    filter?: object;
    search?: string;
    offset?: number;
    limit?: number;
  }) {
    const cond = search ? { ...filter, $text: { $search: search } } : filter;
    const notifications = await this.userModel
      .find(cond)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('readIds')
      .exec();

    return notifications;
  }

  async createUser(user: NewUserDto) {
    const newNotification = await new this.userModel({
      ...user,
      notificationMark: null,
      lastLoginTime: new Date(),
    }).save();
    return newNotification;
  }

  async syncReadNotification(user: User) {
    let nextMarkRecord = (
      await this.notificationService.getAdjacentNotification(
        user.notificationMark?.toString(),
      )
    )[0];

    if (!nextMarkRecord && !user.notificationMark)
      nextMarkRecord = await this.notificationService.getOldestNotification();

    if (user.readIds.includes(nextMarkRecord._id)) {
      user.readIds = user.readIds.filter(
        (val) => val.toString() !== nextMarkRecord._id.toString(),
      );
      user.notificationMark = nextMarkRecord._id;
      return await this.syncReadNotification(user);
    }
  }

  async updateReadNotification(id: string, userId: string) {
    const user = await this.userModel.findById(userId);
    const notification = await this.notificationService.getNotification(id);

    if (!user.readIds.includes(notification._id))
      user.readIds.push(notification._id);
    await this.syncReadNotification(user);
    return await user.save();
  }

  async updateReadNotifications(userId: string) {
    const user = await this.userModel.findById(userId);
    const latestNotification =
      await this.notificationService.getLatestNotification();
    user.notificationMark = latestNotification._id;
    user.readIds = [];
    return await user.save();
  }
}
