import {Module} from "@nestjs/common";
import {MarinetrafficController} from "./marinetraffic.controller";
import {MarinetrafficService} from "./marinetraffic.service";

@Module({
    imports: [],
    controllers: [MarinetrafficController],
    providers: [MarinetrafficService],
})
export class MarinetrafficModule {}