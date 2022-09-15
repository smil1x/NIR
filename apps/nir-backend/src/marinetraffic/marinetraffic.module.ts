import { DynamicModule, Module } from '@nestjs/common';
import { MarinetrafficController } from './marinetraffic.controller';
import { MarinetrafficService } from './marinetraffic.service';
import { MARINETRAFIC_KEY } from './constants';

@Module({
  imports: [],
  controllers: [MarinetrafficController],
  providers: [MarinetrafficService],
})
export class MarinetrafficModule {
  static register({
    marinetrafficKey,
  }: {
    marinetrafficKey: string;
  }): DynamicModule {
    return {
      module: MarinetrafficModule,
      controllers: [MarinetrafficController],
      providers: [
        MarinetrafficService,
        {
          provide: MARINETRAFIC_KEY,
          useValue: marinetrafficKey,
        },
      ],
    };
  }
}
