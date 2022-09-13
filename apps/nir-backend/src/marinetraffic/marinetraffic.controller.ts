import { Controller, Get } from '@nestjs/common';
import { MarinetrafficService } from './marinetraffic.service';
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Marinetraffic')
@Controller()
export class MarinetrafficController {
  constructor(private readonly appService: MarinetrafficService) {}

  @Get()
  @ApiOkResponse({
    description: 'Successfully',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
