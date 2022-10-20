import { IsString, IsDate, IsArray, IsEnum, IsObject } from 'class-validator';
import { Types } from 'mongoose';
import { OmitType } from '@nestjs/mapped-types';

import { ROLE } from 'src/schemas/user.schema';

export class UserDto {
  @IsString()
  address: Types.ObjectId;

  @IsEnum(ROLE)
  role: string;

  // TODO: constraint stricter
  @IsArray()
  readIds: Types.ObjectId[];

  @IsObject()
  notificationMark: Types.ObjectId;

  @IsDate()
  lastLoginTime: Date;
}

export class NewUserDto extends OmitType(UserDto, [
  'readIds',
  'notificationMark',
  'lastLoginTime',
]) {}
