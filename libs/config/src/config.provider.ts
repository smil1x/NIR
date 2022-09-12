import { Provider } from '@nestjs/common';
import { CONFIG_OPTIONS } from '@app/common/consts';
import { ConfigOptionsInterface } from './interfaces/config-options.interface';

export function createConfigOptionsAsyncProviders(
  options: ConfigOptionsInterface,
): Provider {
  return {
    provide: CONFIG_OPTIONS,
    useValue: options,
  };
}
