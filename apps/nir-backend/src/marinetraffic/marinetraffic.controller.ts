import { Controller, Get } from '@nestjs/common';
import { MarinetrafficService } from './marinetraffic.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Marinetraffic')
@Controller()
export class MarinetrafficController {
  constructor(private readonly appService: MarinetrafficService) {}

  @Get()
  @ApiOkResponse({
    description: 'Successfully',
    type: String,
  })
  getSingleVesselPositions(): string {
    return this.appService.getSingleVesselPositions();
  }
}
