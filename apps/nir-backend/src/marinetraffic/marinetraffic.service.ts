import { Inject, Injectable } from '@nestjs/common';
import { MARINETRAFFIC_CONFIG } from './constants';
import axios from 'axios';
import { HistoryPositionDto, PositionDto } from './dto';
import {
  IMarinetrafficConfig,
  IPoint,
  IStraightLine,
} from '../core/interfaces';
import { HistoricalPositions, VesselRout } from './mock-data';
import * as haversine from 'haversine';
import {
  distanceBetweenPoints,
  pointDeviationFromLineSegment,
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
    const minNormalPointDeviation = 0.1;
    // const historyTrackIndex = 1;

    const deviationPoints = historyTrack.reduce(
      (deviationArray, historyPoint) => {
        const nearestRoutSegment: IStraightLine = this.searchNearestRoutSegment(
          rout,
          historyPoint,
        );
        const deviationDistance = pointDeviationFromLineSegment(
          nearestRoutSegment,
          historyPoint,
        );
        return deviationDistance > minNormalPointDeviation
          ? [...deviationArray, historyPoint]
          : deviationArray;
      },
      [],
    );

    return deviationPoints;
    // return { ...nearestRoutSegment, hPoint: historyTrackIndex };
  }

  // refactor
  searchNearestRoutPointIndex(rout: IPoint[], point: IPoint): number {
    const nearestPoint = rout.reduce(
      (nearestRoutPointIndex, currentRoutPoint, index, rout) => {
        const start = {
          x: currentRoutPoint.x,
          y: currentRoutPoint.y,
        };

        const end = {
          x: point.x,
          y: point.y,
        };

        // const start = {
        //   longitude: currentRoutPoint.x,
        //   latitude: currentRoutPoint.y,
        // };
        //
        // const end = {
        //   longitude: point.x,
        //   latitude: point.y,
        // };

        if (index === 0) {
          return {
            index: 0,
            dist: distanceBetweenPoints(start, end),
            pos: { ...currentRoutPoint },
          };
        }

        const currentDist = distanceBetweenPoints(start, end);

        return {
          dist: Math.min(currentDist, nearestRoutPointIndex.dist),
          index:
            currentDist > nearestRoutPointIndex.dist
              ? nearestRoutPointIndex.index
              : index,
          pos: {
            ...rout[
              currentDist > nearestRoutPointIndex.dist
                ? nearestRoutPointIndex.index
                : index
            ],
          },
        };
      },
      { index: 0, dist: 0, pos: {} },
    );

    return nearestPoint.index;
  }

  searchNearestRoutSegment(rout: IPoint[], point: IPoint): IStraightLine {
    const nearestPointIndex = this.searchNearestRoutPointIndex(rout, point);
    let secondNearestPointIndex: number;
    if (nearestPointIndex === 0) {
      secondNearestPointIndex = 1;
    } else if (nearestPointIndex === rout.length - 1) {
      secondNearestPointIndex = rout.length - 1;
    } else {
      secondNearestPointIndex =
        distanceBetweenPoints(rout[nearestPointIndex - 1], point) >
        distanceBetweenPoints(rout[nearestPointIndex + 1], point)
          ? nearestPointIndex + 1
          : nearestPointIndex - 1;
    }

    return {
      x1: rout[nearestPointIndex].x,
      y1: rout[nearestPointIndex].y,
      x2: rout[secondNearestPointIndex].x,
      y2: rout[secondNearestPointIndex].y,
    };
  }
}
