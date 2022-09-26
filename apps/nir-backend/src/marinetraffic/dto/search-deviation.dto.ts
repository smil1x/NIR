import { Point } from '../../core/interfaces';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDeviationDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "ship's route for deviation search",
    example: '[[1,2], [0,0]]',
  })
  route: Point[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'maximum permissible deviation in meters',
    example: '500',
  })
  normalDeviation: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'maximum permissible deviation in meters',
    example: '3',
  })
  days: string;
}
