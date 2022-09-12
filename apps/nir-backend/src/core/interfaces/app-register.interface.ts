import { BaseConfigInterface } from './base-config.interface';
import {CertsOptionsInterface} from "@app/common/interfaces";

export interface AppRegisterOptions {
  config: BaseConfigInterface;
  certs?: CertsOptionsInterface
}
