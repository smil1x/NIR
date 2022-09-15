import { Inject, Injectable } from '@nestjs/common';
import { MARINETRAFIC_KEY } from './constants';
import axios from 'axios';

@Injectable()
export class MarinetrafficService {
  constructor(
    @Inject(MARINETRAFIC_KEY) protected readonly marinetrafficKey: string,
  ) {}
  getSingleVesselPositions(): string {
    axios
      .get(
        `https://services.marinetraffic.com/api/exportvessel/${this.marinetrafficKey}`,
        {
          params: {
            v: 1,
            shipid: 281897,
            protocol: 'json',
          },
        },
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(this.marinetrafficKey);
    return `It is nir-backend app ${this.marinetrafficKey}`;
  }
}
