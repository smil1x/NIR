import { Injectable } from '@nestjs/common';

@Injectable()
export class MarinetrafficService {
  getHello(): string {
    return 'It is nir-backend app';
  }
}
