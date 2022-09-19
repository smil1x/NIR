import { PositionDto } from './position.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HistoryPositionDto extends PositionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'International Maritime Organisation number - a seven-digit number that uniquely identifies vessels',
    example: '9351098',
  })
  imo: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'A uniquely assigned ID by MarineTraffic for the subject vessel',
    example: '362849',
  })
  shipId: string;

  public static FromArray(positionArr: Array<string>): HistoryPositionDto {
    return {
      mmsi: positionArr[0],
      imo: positionArr[1],
      status: positionArr[2],
      speed: positionArr[3],
      lon: positionArr[4],
      lat: positionArr[5],
      course: positionArr[6],
      heading: positionArr[7],
      timestamp: positionArr[8],
      shipId: positionArr[9],
    };
  }
}
