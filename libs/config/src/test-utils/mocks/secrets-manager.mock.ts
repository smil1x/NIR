import { validSecretString } from '@app/config/test-utils/stubs';

export const secretManagerMock = {
  getSecretValue: () => ({
    promise: () =>
      new Promise((resolve) =>
        resolve({
          SecretString: validSecretString,
        }),
      ),
  }),
};
