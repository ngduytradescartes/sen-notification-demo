import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'Dapp' })
  dappId: Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, default: false })
  isPublish: string;

  @Prop({ type: [{ type: String, unique: true }], required: true, default: [] })
  seenUser: string[];

  @Prop({ type: String, default: '' })
  url: string;

  @Prop({ type: Date, required: true })
  time: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
