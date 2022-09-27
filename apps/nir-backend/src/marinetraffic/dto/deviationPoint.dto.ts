import { IRouteSegment, Point } from '../../core/interfaces';

export class DeviationPointDto extends Point {
  deviation: string;

  routeSegment: IRouteSegment;

  isDeviated: boolean;
}
