import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;
export const ROLE = ['admin', 'user', 'editor'];

@Schema()
export class User {
  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true, enum: ROLE })
  role: string;

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  readIds: Types.ObjectId[];

  @Prop({ type: Types.ObjectId })
  notificationMark: Types.ObjectId;

  @Prop({ type: Date, required: true })
  lastLoginTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
