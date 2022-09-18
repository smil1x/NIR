import { Inject, Injectable } from '@nestjs/common';
import { MARINETRAFIC_KEY } from './constants';
import axios from 'axios';

@Injectable()
export class MarinetrafficService {
  constructor(
    @Inject(MARINETRAFIC_KEY) protected readonly marinetrafficKey: string,
  ) {}

  async getSingleVesselPositions(shipid: number): Promise<any> {
    return axios
      .get(
        `https://services.marinetraffic.com/api/exportvessel/${this.marinetrafficKey}`,
        {
          params: {
            v: 1,
            shipid: shipid,
            protocol: 'json',
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getVesselHistoricalPositions(shipid: number): Promise<any> {
    return axios
      .get(
        `https://services.marinetraffic.com/api/exportvesseltrack/29d511fafdb93d5c9fad0f37667573c04e2e1fbb`,
        {
          params: {
            v: 1,
            shipid: shipid,
            days: 1,
            protocol: 'json',
            period: 'daily',
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((err) => {
        console.log('errrrrrrrrrrrrrrrrr', err.response.data);
      });
  }
}
