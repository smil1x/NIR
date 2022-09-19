import { DynamicModule, Module } from '@nestjs/common';
import { MarinetrafficController } from './marinetraffic.controller';
import { MarinetrafficService } from './marinetraffic.service';
import { MARINETRAFFIC_CONFIG } from './constants';
import { IMarinetrafficConfig } from '../core/interfaces';

@Module({
  imports: [],
  controllers: [MarinetrafficController],
  providers: [MarinetrafficService],
})
export class MarinetrafficModule {
  static register(marinetrafficConfig: IMarinetrafficConfig): DynamicModule {
    return {
      module: MarinetrafficModule,
      controllers: [MarinetrafficController],
      providers: [
        MarinetrafficService,
        {
          provide: MARINETRAFFIC_CONFIG,
          useValue: marinetrafficConfig,
        },
      ],
    };
  }
}
