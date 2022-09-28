import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MarinetrafficService } from './marinetraffic.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PositionDto, SearchDeviationDto } from './dto';
import { DeviationModel } from './dto/deviation.model';

@ApiTags('Marinetraffic')
@Controller()
export class MarinetrafficController {
  constructor(private readonly marinetrafficService: MarinetrafficService) {}

  @Get(':shipId/position')
  @ApiOperation({
    summary: 'Get Vessel Position',
  })
  @ApiOkResponse({
    description: 'Successfully',
    type: PositionDto,
  })
  async getSingleVesselPosition(
    @Param('shipId') shipId: number,
  ): Promise<PositionDto | []> {
    return await this.marinetrafficService.getSingleVesselPosition(shipId);
  }

  @Get(':shipId/history')
  @ApiOperation({
    summary: 'Get Vessel Historical Positions',
  })
  @ApiOkResponse({
    description: 'Successfully',
    type: [PositionDto],
  })
  async getVesselHistoricalPositions(
    @Param('shipId') shipId: string,
  ): Promise<PositionDto[]> {
    return await this.marinetrafficService.getVesselHistoricalPositions(shipId);
  }

  @Post('/deviation')
  @ApiOperation({
    summary: 'Get deviation from the route',
  })
  @ApiOkResponse({
    description: 'Successfully',
    type: DeviationModel,
  })
  async deviationFromRoute(
    @Body() searchDeviationDto: SearchDeviationDto,
  ): Promise<DeviationModel> {
    return await this.marinetrafficService.deviationFromRoute(
      searchDeviationDto,
    );
  }

  @Get(':shipId/test')
  @ApiOperation({
    summary: 'test',
  })
  @ApiOkResponse({
    description: 'Successfully',
    type: PositionDto,
  })
  async test(@Param('shipId') shipId: string): Promise<any> {
    return this.marinetrafficService.test(shipId);
  }
}
