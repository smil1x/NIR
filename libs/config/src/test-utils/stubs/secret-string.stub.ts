import { testCerts } from './test-certs.stub';

export const validSecretString = JSON.stringify({
  IS_REMOTE: true,
  NUMBER: 0,
  STRING: 'test',
  EMPTY_VALUE: '',
});

export const notValidSecretString = 'not valid config';

export const validCertsString = testCerts;
