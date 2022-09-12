import { Module } from '@nestjs/common';
import {MarinetrafficModule} from "./marinetraffic/marinetraffic.module";

@Module({
  imports: [MarinetrafficModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
