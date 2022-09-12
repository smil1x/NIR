import { Controller, Get } from '@nestjs/common';
import { MarinetrafficService } from './marinetraffic.service';

@Controller()
export class MarinetrafficController {
  constructor(private readonly appService: MarinetrafficService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
