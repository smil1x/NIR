import { PositionDto } from './position.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HistoryPositionDto extends PositionDto {
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
      speed: positionArr[1],
      status: positionArr[2],
      lon: positionArr[3],
      lat: positionArr[4],
      course: positionArr[5],
      heading: positionArr[6],
      timestamp: positionArr[7],
      shipId: positionArr[8],
    };
  }
}
