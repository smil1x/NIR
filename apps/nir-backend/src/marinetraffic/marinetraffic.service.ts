import { Inject, Injectable } from '@nestjs/common';
import { MARINETRAFFIC_CONFIG } from './constants';
import axios from 'axios';
import { HistoryPositionDto, PositionDto, SearchDeviationDto } from './dto';
import { IMarinetrafficConfig, IRouteSegment, Point } from '../core/interfaces';
import { HistoricalPositionsMT } from './mock-data';
import {
  metersBetweenGeoCoordinates,
  pointDeviationFromRoutSegment,
} from '../core/utils';
import { DeviationPointDto } from './dto/deviationPoint.dto';
import { DeviationModel } from './dto/deviation.model';

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
    shipId: string,
    days: string,
  ): Promise<HistoryPositionDto[]> {
    const { SINGLE_VESSEL_HISTORICAL_POSITIONS_KEY } = this.marinetrafficConfig;
    let responseData: string[][];
    try {
      responseData = await this.requestVesselHistoricalPositions(
        shipId,
        days,
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
    shipId: string,
    days: string,
    requestKey,
  ): Promise<string[][]> {
    return axios
      .get(
        `https://services.marinetraffic.com/api/exportvesseltrack/${requestKey}`,
        {
          params: {
            v: 1,
            shipid: shipId,
            days: days,
            protocol: 'json',
            period: 'daily',
          },
        },
      )
      .then((res) => res.data);
  }

  async deviationFromRoute(
    searchDeviationDto: SearchDeviationDto,
  ): Promise<DeviationModel> {
    const { normalDeviation, route, history } = searchDeviationDto;

    const pointsDeviation: DeviationPointDto[] = history.map((historyPoint) => {
      return this.pointDeviationFromRoute(route, historyPoint, normalDeviation);
    });

    return {
      route: route,
      historyTrack: pointsDeviation,
      normalDeviation: normalDeviation,
    };
  }

  searchNearestRoutePointIndex(route: Point[], point: Point): number {
    const nearestPoint = route.reduce(
      (nearestRoutPoint, currentRoutPoint, index, route) => {
        if (index === 0) {
          return {
            index: 0,
            dist: metersBetweenGeoCoordinates(currentRoutPoint, point),
            pos: { ...currentRoutPoint },
          };
        }

        const currentDist = metersBetweenGeoCoordinates(
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
            ...route[
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

  pointDeviationFromRoute(
    route: Point[],
    point: Point,
    normalDeviation: string,
  ): DeviationPointDto {
    const nearestPointIndex = this.searchNearestRoutePointIndex(route, point);

    let secondRoutePointIndex: number;
    let deviation: number;

    if (nearestPointIndex === 0) {
      secondRoutePointIndex = 1;
      deviation = pointDeviationFromRoutSegment(
        { start: route[nearestPointIndex], end: route[secondRoutePointIndex] },
        point,
      );
    } else if (nearestPointIndex === route.length - 1) {
      secondRoutePointIndex = route.length - 2;
      deviation = pointDeviationFromRoutSegment(
        { start: route[nearestPointIndex], end: route[secondRoutePointIndex] },
        point,
      );
    } else {
      const leftRoutSegment: IRouteSegment = {
        start: {
          lon: route[nearestPointIndex].lon,
          lat: route[nearestPointIndex].lat,
        },
        end: {
          lon: route[nearestPointIndex - 1].lon,
          lat: route[nearestPointIndex - 1].lat,
        },
      };
      const rightRoutSegment: IRouteSegment = {
        start: {
          lon: route[nearestPointIndex].lon,
          lat: route[nearestPointIndex].lat,
        },
        end: {
          lon: route[nearestPointIndex + 1].lon,
          lat: route[nearestPointIndex + 1].lat,
        },
      };
      const deviationFromLeftSegment = pointDeviationFromRoutSegment(
        leftRoutSegment,
        point,
      );
      const deviationFromRightSegment = pointDeviationFromRoutSegment(
        rightRoutSegment,
        point,
      );
      secondRoutePointIndex =
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
      isDeviated: deviation > Number(normalDeviation),
      deviation: deviation.toString(),
      routeSegment: {
        start: {
          lat: route[nearestPointIndex].lat,
          lon: route[nearestPointIndex].lon,
        },
        end: {
          lat: route[secondRoutePointIndex].lat,
          lon: route[secondRoutePointIndex].lon,
        },
      },
    };
  }
}
