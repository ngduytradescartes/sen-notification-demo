import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.use(morgan('tiny'));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
