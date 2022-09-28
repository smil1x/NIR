import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PositionDto } from '../../marinetraffic/dto';
import { MARINETRAFFIC_HEADERS } from '../../marinetraffic/constants';

@Injectable()
export class RequestService {
  async getHistoricalPositions(
    shipId: string,
    startDate: string,
    endDate: string,
  ): Promise<PositionDto[]> {
    return axios
      .get(
        `https://www.marinetraffic.com/map/gettrackjson/shipid:${shipId}/stdate:${startDate}/endate:${endDate}/trackorigin:livetrack`,
        {
          headers: MARINETRAFFIC_HEADERS,
          withCredentials: true,
        },
      )
      .then((res) => res.data)
      .then((data) => data.map((pos) => PositionDto.FromArray(pos)));
  }

  async getShipId(mmsi: string): Promise<string> {
    return axios
      .get('https://www.marinetraffic.com/en/search/searchAsset', {
        params: {
          what: 'vessel',
          term: mmsi,
        },
        headers: MARINETRAFFIC_HEADERS,
        withCredentials: true,
      })
      .then((res) => (res.data.length ? res.data[0].id : ''))
      .catch((err) => {
        console.log(err);
      });
  }

  async getVoyageInfo(shipId: string): Promise<any> {
    return axios
      .get('https://www.marinetraffic.com/en/ais/get_info_window_json', {
        params: {
          asset_type: 'ship',
          id: shipId,
        },
        headers: MARINETRAFFIC_HEADERS,
        withCredentials: true,
      })
      .then((res) => {
        return {
          departurePortTimestamp: res.data.voyage.departure_port_info_portTime,
          departureCountryCode:
            res.data.voyage.departure_port_info_country_code,
          lastPosTimestamp: res.data.values.last_pos,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
