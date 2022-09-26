import { ApiProperty } from '@nestjs/swagger';
import { DEFAULT_HISTORY_PERIOD } from '../constants';
import { IsNumber } from 'class-validator';

export class DaysQuery {
  @ApiProperty({
    description: 'history period in days',
    default: DEFAULT_HISTORY_PERIOD,
  })
  @IsNumber()
  days: string = DEFAULT_HISTORY_PERIOD;
}
