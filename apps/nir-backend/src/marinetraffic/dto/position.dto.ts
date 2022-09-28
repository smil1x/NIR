import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PositionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      "Latitude - a geographic coordinate that specifies the north-south position of the vessel on the Earth's surface",
    example: '64.056160',
  })
  lat: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      "Longitude - a geographic coordinate that specifies the east-west position of the vessel on the Earth's surface",
    example: '-52.251110',
  })
  lon: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'The speed (in knots x10) that the subject vessel is reporting according to AIS transmissions',
    example: '104',
  })
  speed: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'The heading (in degrees) that the subject vessel is reporting according to AIS transmissions',
    example: '94',
  })
  heading: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'The course (in degrees) that the subject vessel is reporting according to AIS transmissions',
    example: '92',
  })
  course: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      "The date and time (in UTC) that the subject vessel's position or event was recorded by MarineTraffic",
    example: '2022-09-19T11:47:59',
  })
  timestamp: string;

  public static FromArray(positionArr: Array<string>): PositionDto {
    return {
      lon: positionArr[0],
      lat: positionArr[1],
      speed: positionArr[2],
      course: positionArr[3],
      heading: positionArr[4],
      timestamp: positionArr[5],
    };
  }
}
