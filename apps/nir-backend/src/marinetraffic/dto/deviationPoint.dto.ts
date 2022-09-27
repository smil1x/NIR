import { HistoryPositionDto } from './history-position.dto';
import { IRouteSegment } from '../../core/interfaces';

export class DeviationPointDto extends HistoryPositionDto {
  deviation: string;

  routeSegment: IRouteSegment;

  isDeviated: boolean;
}
