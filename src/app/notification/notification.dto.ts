import {
  IsString,
  IsObject,
  IsDate,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';

export class NotificationDto {
  @IsObject()
  dappId: Types.ObjectId;

  @IsString()
  content: string;

  @IsBoolean()
  isPublish: boolean;

  @IsArray()
  seen: string[];

  @IsString()
  url: string;

  @IsDate()
  time: Date;
}
