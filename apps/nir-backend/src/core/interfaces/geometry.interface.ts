import { PositionDto } from '../../marinetraffic/dto';

export interface IPoint {
  x: number;
  y: number;
}

export type Point = Pick<PositionDto, 'lat' | 'lon'>;

export interface IGeoVector2 {
  lat: number;
  lon: number;
}

export interface IRoutSegment {
  start: Point;
  end: Point;
}
