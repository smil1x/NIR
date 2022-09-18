import { Controller, Get, Param } from '@nestjs/common';
import { MarinetrafficService } from './marinetraffic.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Marinetraffic')
@Controller()
export class MarinetrafficController {
  constructor(private readonly appService: MarinetrafficService) {}

  @Get(':shipid')
  @ApiOperation({
    summary: 'Get Vessel Position',
  })
  @ApiOkResponse({
    description: 'Successfully',
    type: String,
  })
  async getSingleVesselPositions(
    @Param('shipid') shipid: number,
  ): Promise<any> {
    return await this.appService.getSingleVesselPositions(shipid);
  }

  @Get(':shipid/history')
  @ApiOperation({
    summary: 'Get Vessel Historical Positions',
  })
  @ApiOkResponse({
    description: 'Successfully',
    type: String,
  })
  async getVesselHistoricalPositions(
    @Param('shipid') shipid: number,
  ): Promise<any> {
    return await this.appService.getVesselHistoricalPositions(shipid);
  }
}
