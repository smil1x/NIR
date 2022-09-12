import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG } from '@app/common/consts';
import { ConfigService } from './config.service';
import { createConfigOptionsAsyncProviders } from './config.provider';
import { ConfigOptionsInterface } from './interfaces/config-options.interface';

export const configFactory = {
  provide: CONFIG,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => configService.getConfig(),
};

@Global()
@Module({})
export class ConfigModule {
  /**
   * Registers a configured Config Module for import into the current module
   * using provided options (async due to possible AWS request)
   */
  public static registerAsync(
    configOptions: ConfigOptionsInterface,
  ): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        createConfigOptionsAsyncProviders(configOptions),
        configFactory,
        ConfigService,
      ],
      exports: [ConfigService, configFactory],
    };
  }
}
