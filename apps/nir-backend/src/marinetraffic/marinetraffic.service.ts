import { Inject, Injectable } from '@nestjs/common';
import { MARINETRAFFIC_CONFIG } from './constants';
import axios from 'axios';
import { PositionDto, SearchDeviationDto } from './dto';
import { IMarinetrafficConfig, IRouteSegment, Point } from '../core/interfaces';
import {
  metersBetweenGeoCoordinates,
  pointDeviationFromRoutSegment,
} from '../core/utils';
import { DeviationPointDto } from './dto/deviationPoint.dto';
import { DeviationModel } from './dto/deviation.model';
import { RequestService } from '../core/services/request.service';
import * as moment from 'moment';

@Injectable()
export class MarinetrafficService {
  constructor(
    @Inject(MARINETRAFFIC_CONFIG)
    protected readonly marinetrafficConfig: IMarinetrafficConfig,
    protected readonly requestService: RequestService,
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

  async getVesselHistoricalPositions(ship: string): Promise<PositionDto[]> {
    const shipId = await this.requestService.getShipId(ship);
    if (shipId) {
      const voyageInfo = await this.requestService.getVoyageInfo(shipId);
      const startDate = moment
        .unix(voyageInfo.departurePortTimestamp)
        .format('YYYY-MM-DD');
      const endDate = moment
        .unix(voyageInfo.lastPosTimestamp)
        .format('YYYY-MM-DD');
      return this.requestService.getHistoricalPositions(
        shipId,
        startDate,
        endDate,
      );
    }
    return [];
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

  async test(shipId: string): Promise<any> {
    // 2022-09-26 13:42
    // const his = this.requestService.getVoyageInfo(shipId);
    // const date = moment.unix(Number(shipId)).format('YYYY-MM-DD HH:mm');

    // console.log(date);
    return 'date';
  }
}
