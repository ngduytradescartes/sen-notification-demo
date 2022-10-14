import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;
  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.get('mongodb.uri', { infer: true }),
    };
  }
}
