import { Point } from '../../core/interfaces';
import { DeviationPointDto } from './deviationPoint.dto';
import { IsNotEmpty } from 'class-validator';

export class DeviationModel {
  @IsNotEmpty()
  route: Point[];

  @IsNotEmpty()
  historyTrack: DeviationPointDto[];

  @IsNotEmpty()
  normalDeviation: string;
}
