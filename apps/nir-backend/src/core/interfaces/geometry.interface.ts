export class Point {
  lat: string;
  lon: string;
}

export interface IGeoVector2 {
  lat: number;
  lon: number;
}

export interface IRouteSegment {
  start: Point;
  end: Point;
}
