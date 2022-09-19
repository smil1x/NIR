import { Inject, Injectable } from '@nestjs/common';
import { MARINETRAFFIC_CONFIG } from './constants';
import axios, { AxiosResponse } from 'axios';
import { HistoryPositionDto, PositionDto } from './dto';
import { IMarinetrafficConfig } from '../core/interfaces';

@Injectable()
export class MarinetrafficService {
  constructor(
    @Inject(MARINETRAFFIC_CONFIG)
    protected readonly marinetrafficConfig: IMarinetrafficConfig,
  ) {}

  async getSingleVesselPositions(shipid: number): Promise<any> {
    const { SINGLE_VESSEL_POSITIONS_KEY } = this.marinetrafficConfig;
    return axios
      .get(
        `https://services.marinetraffic.com/api/exportvessel/${SINGLE_VESSEL_POSITIONS_KEY}`,
        {
          params: {
            v: 3,
            shipid: shipid,
            protocol: 'json',
          },
        },
      )
      .then((res: AxiosResponse<Array<Array<string>>>): PositionDto => {
        return res.data.map((pos) => {
          return PositionDto.FromArray(pos);
        })[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getVesselHistoricalPositions(shipId: number): Promise<any> {
    const { SINGLE_VESSEL_HISTORICAL_POSITIONS_KEY } = this.marinetrafficConfig;
    return axios
      .get(
        `https://services.marinetraffic.com/api/exportvesseltrack/${SINGLE_VESSEL_HISTORICAL_POSITIONS_KEY}`,
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
      .then(
        (res: AxiosResponse<Array<Array<string>>>): HistoryPositionDto[] => {
          return res.data.map((pos) => {
            return HistoryPositionDto.FromArray(pos);
          });
        },
      )
      .catch((err) => {
        console.log('errrrrrrrrrrrrrrrrr', err.response.data);
      });
  }
}
