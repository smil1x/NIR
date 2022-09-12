import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@app/config";
import {configOptions} from "./config-options.provider";
import {BaseConfigInterface} from "./core/interfaces";

async function bootstrap() {
  const configService = new ConfigService(configOptions);
  const config = await configService.getConfig<BaseConfigInterface>();
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(config.APP_PORT || 3000);
}
bootstrap();
