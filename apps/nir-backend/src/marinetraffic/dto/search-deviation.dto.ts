import { Point } from '../../core/interfaces';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDeviationDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "ship's route for deviation search",
  })
  route: Point[];

  @IsNotEmpty()
  @ApiProperty({
    description: "ship's history route for deviation search",
  })
  history: Point[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'maximum permissible deviation in meters',
    example: '500',
  })
  normalDeviation: string;
}
