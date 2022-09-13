import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@app/config";
import {configOptions} from "./config-options.provider";
import {BaseConfigInterface} from "./core/interfaces";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const configService = new ConfigService(configOptions);
  const config = await configService.getConfig<BaseConfigInterface>();
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
      .setTitle('NIR')
      .setDescription('NIR backend')
      .setVersion('0.1.0')
      .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.APP_PORT || 3000);
}
bootstrap();
