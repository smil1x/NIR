import { Inject, Injectable } from '@nestjs/common';
import { MARINETRAFFIC_CONFIG } from './constants';
import axios from 'axios';
import { HistoryPositionDto, PositionDto } from './dto';
import { IMarinetrafficConfig, IPoint, IRoutSegment } from '../core/interfaces';
import { HistoricalPositions, VesselRout } from './mock-data';
import {
  distanceBetweenGeoCoordinates,
  pointDeviationFromRoutSegment,
} from '../core/utils';

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

  test() {
    const historyTrack = HistoricalPositions;
    const rout = VesselRout;
    const minNormalPointDeviation = 0;

    const deviationPoints = historyTrack.reduce(
      (deviationArray, historyPoint) => {
        const pointDeviation = this.pointDeviationFromRout(rout, historyPoint);

        return pointDeviation.deviation > minNormalPointDeviation
          ? [...deviationArray, pointDeviation]
          : deviationArray;
      },
      [],
    );

    return deviationPoints;
  }

  searchNearestRoutPointIndex(rout: IPoint[], point: IPoint): number {
    const nearestPoint = rout.reduce(
      (nearestRoutPoint, currentRoutPoint, index, rout) => {
        if (index === 0) {
          return {
            index: 0,
            dist: distanceBetweenGeoCoordinates(currentRoutPoint, point),
            pos: { ...currentRoutPoint },
          };
        }

        const currentDist = distanceBetweenGeoCoordinates(
          currentRoutPoint,
          point,
        );

        return {
          dist: Math.min(currentDist, nearestRoutPoint.dist),
          index:
            currentDist > nearestRoutPoint.dist
              ? nearestRoutPoint.index
              : index,
          pos: {
            ...rout[
              currentDist > nearestRoutPoint.dist
                ? nearestRoutPoint.index
                : index
            ],
          },
        };
      },
      { index: 0, dist: 0, pos: {} },
    );

    return nearestPoint.index;
  }

  // type method
  pointDeviationFromRout(rout: IPoint[], point: IPoint): any {
    const nearestPointIndex = this.searchNearestRoutPointIndex(rout, point);
    let secondRoutPointIndex: number;
    let deviation: number;
    if (nearestPointIndex === 0) {
      secondRoutPointIndex = 1;
    } else if (nearestPointIndex === rout.length - 1) {
      secondRoutPointIndex = rout.length - 1;
    } else {
      const leftRoutSegment: IRoutSegment = {
        x1: rout[nearestPointIndex].x,
        y1: rout[nearestPointIndex].y,
        x2: rout[nearestPointIndex - 1].x,
        y2: rout[nearestPointIndex - 1].y,
      };
      const rightRoutSegment = {
        x1: rout[nearestPointIndex].x,
        y1: rout[nearestPointIndex].y,
        x2: rout[nearestPointIndex + 1].x,
        y2: rout[nearestPointIndex + 1].y,
      };
      const deviationFromLeftSegment = pointDeviationFromRoutSegment(
        leftRoutSegment,
        point,
      );
      const deviationFromRightSegment = pointDeviationFromRoutSegment(
        rightRoutSegment,
        point,
      );
      secondRoutPointIndex =
        deviationFromLeftSegment > deviationFromRightSegment
          ? nearestPointIndex - 1
          : nearestPointIndex + 1;
      deviation = Math.min(
        deviationFromRightSegment,
        deviationFromRightSegment,
      );
    }

    return {
      ...point,
      deviation,
      routSegment: {
        x1: rout[nearestPointIndex].x,
        y1: rout[nearestPointIndex].y,
        x2: rout[secondRoutPointIndex].x,
        y2: rout[secondRoutPointIndex].y,
      },
    };
  }
}
