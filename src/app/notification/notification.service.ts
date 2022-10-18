import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';
import { MAX_LIMIT } from 'src/pipelines/limit.pipe';
import { MIN_OFFSET } from 'src/pipelines/offset.pipe';
import { EnvironmentVariables } from 'src/config';
import { NotificationDto } from './notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true });

  async getNotifications({
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
    console.log('chay vo services');
    const cond = search ? { ...filter, $text: { $search: search } } : filter;
    console.log('condss: ', cond);
    const notifications = await this.notificationModel
      .find(cond)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('dappId')
      .exec();
    console.log('notifications: ', notifications);
    return notifications;
  }

  async updateNotification(_id: string, data: NotificationDto) {
    const newNotification = await this.notificationModel
      .findOneAndUpdate({ _id }, data, { new: true })
      .exec();
    return newNotification;
  }

  async markAsReadOrUnread(_id: string, user: string) {
    const notification = await this.notificationModel.findById(_id);
    if (notification.seenUser.includes(user)) {
      notification.seenUser = notification.seenUser.filter(
        (val) => val !== user,
      );
      return await notification.save();
    }
    notification.seenUser.push(user);
    return await notification.save();
  }

  async updateNotifications(data: NotificationDto) {
    const newNotifications = await this.notificationModel
      .updateMany({}, data, { new: true, runValidators: true })
      .exec();
    return newNotifications;
  }

  async markAllAsRead(user: string) {
    await this.notificationModel
      .updateMany({ seenUser: { $all: [user] } }, { $pull: { seenUser: user } })
      .exec();
    const newNotifications = await this.notificationModel
      .updateMany({}, { $push: { seenUser: user } })
      .exec();
    return newNotifications;
  }

  async newNotification(notification: NotificationDto) {
    const newNotification = await new this.notificationModel({
      ...notification,
      time: new Date(),
    }).save();
    return newNotification;
  }
}
