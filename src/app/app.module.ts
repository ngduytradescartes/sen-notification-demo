import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService, MongooseConfigService } from './app.service';
import { DappModule } from './dapp/dapp.module';
import { EventsService } from './events.service';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import configuration from 'src/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    NotificationModule,
    DappModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsService],
})
export class AppModule {}
