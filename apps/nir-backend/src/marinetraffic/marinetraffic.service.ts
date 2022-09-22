import { Inject, Injectable } from '@nestjs/common';
import { MARINETRAFFIC_CONFIG } from './constants';
import axios from 'axios';
import { HistoryPositionDto, PositionDto } from './dto';
import { IMarinetrafficConfig } from '../core/interfaces';

@Injectable()
export class MarinetrafficService {
  constructor(
    @Inject(MARINETRAFFIC_CONFIG)
    protected readonly marinetrafficConfig: IMarinetrafficConfig,
  ) {}

  async getSingleVesselPosition(shipId: number): Promise<PositionDto | []> {
    const { SINGLE_VESSEL_POSITIONS_KEY } = this.marinetrafficConfig;
    let responseData: string[][];
    try {
      responseData = await this.requestSingleVesselPosition(
        shipId,
        SINGLE_VESSEL_POSITIONS_KEY,
      );
    } catch (err) {
      console.log('err', err.response.data);
    }
    console.log(responseData);
    return (
      responseData.map((pos) => {
        return PositionDto.FromArray(pos);
      })[0] || []
    );
  }

  async getVesselHistoricalPositions(
    shipId: number,
  ): Promise<HistoryPositionDto[]> {
    const { SINGLE_VESSEL_HISTORICAL_POSITIONS_KEY } = this.marinetrafficConfig;
    let responseData: string[][];
    try {
      responseData = await this.requestVesselHistoricalPositions(
        shipId,
        SINGLE_VESSEL_HISTORICAL_POSITIONS_KEY,
      );
    } catch (err) {
      console.log(err.response.data);
    }

    return responseData.map((pos) => {
      return HistoryPositionDto.FromArray(pos);
    });
  }

  private async requestSingleVesselPosition(
    shipId: number,
    requestKey: string,
  ): Promise<string[][]> {
    return axios
      .get(
        `https://services.marinetraffic.com/api/exportvessel/${requestKey}`,
        {
          params: {
            v: 3,
            shipid: shipId,
            protocol: 'json',
          },
        },
      )
      .then((res) => res.data);
  }

  private async requestVesselHistoricalPositions(
    shipId: number,
    requestKey,
  ): Promise<string[][]> {
    return axios
      .get(
        `https://services.marinetraffic.com/api/exportvesseltrack/${requestKey}`,
        {
          params: {
            v: 1,
            shipid: shipId,
            days: 1,
            protocol: 'json',
            period: 'daily',
          },
        },
      )
      .then((res) => res.data);
  }
}
