import { HistoryPositionDto } from './history-position.dto';
import { IRoutSegment } from '../../core/interfaces';

export class DeviationPointDto extends HistoryPositionDto {
  deviation: string;

  routSegment: IRoutSegment;

  isDeviated: boolean;
}
