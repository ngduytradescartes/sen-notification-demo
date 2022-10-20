import { IsString, IsDate, IsEnum, IsObject } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';

import { NOTIFICATION_TYPE } from 'src/schemas/notification.schema';

export class NotificationDto {
  @IsEnum(NOTIFICATION_TYPE)
  type: string;

  @IsObject()
  sender: Types.ObjectId;

  @IsString()
  thumbnail: string;

  @IsString()
  title: string[];

  @IsString()
  content: string;

  @IsString()
  action: string;

  @IsDate()
  broadcastedAt: Date;
}

export class UpdateNotificationDto extends PartialType(NotificationDto) {}
