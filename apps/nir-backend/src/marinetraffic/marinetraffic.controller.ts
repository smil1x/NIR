import { Controller, Get, Param } from '@nestjs/common';
import { MarinetrafficService } from './marinetraffic.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HistoryPositionDto, PositionDto } from './dto';

@ApiTags('Marinetraffic')
@Controller()
export class MarinetrafficController {
  constructor(private readonly appService: MarinetrafficService) {}

  @Get(':shipId/position')
  @ApiOperation({
    summary: 'Get Vessel Position',
  })
  @ApiOkResponse({
    description: 'Successfully',
    type: PositionDto,
  })
  async getSingleVesselPositions(
    @Param('shipId') shipId: number,
  ): Promise<PositionDto> {
    return await this.appService.getSingleVesselPositions(shipId);
  }

  @Get(':shipId/history')
  @ApiOperation({
    summary: 'Get Vessel Historical Positions',
  })
  @ApiOkResponse({
    description: 'Successfully',
    type: [HistoryPositionDto],
  })
  async getVesselHistoricalPositions(
    @Param('shipId') shipId: number,
  ): Promise<Array<HistoryPositionDto>> {
    return await this.appService.getVesselHistoricalPositions(shipId);
  }
}
