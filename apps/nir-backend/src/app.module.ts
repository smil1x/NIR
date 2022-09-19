import { DynamicModule, Module } from '@nestjs/common';
import { MarinetrafficModule } from './marinetraffic/marinetraffic.module';
import { AppRegisterOptions } from './core/interfaces';

@Module({})
export class AppModule {
  public static register(options: AppRegisterOptions): DynamicModule {
    const { config } = options;

    return {
      module: AppModule,
      imports: [MarinetrafficModule.register(config.MARINETRAFFIC_CONFIG)],
    };
  }
}
