import { IMarinetrafficConfig } from './marinetraffic-config.interface';

export interface BaseConfigInterface {
  APP_PORT?: number;
  MARINETRAFFIC_CONFIG: IMarinetrafficConfig;
}
