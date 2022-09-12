import { Test, TestingModule } from '@nestjs/testing';
import { CONFIG_OPTIONS } from '@app/common/consts';
import { ConfigService } from './config.service';
import {
  testSchema,
  testConfig,
  notValidSecretString,
  testCerts,
  getTestPrivateKey,
  getTestCertificate,
  getTestCertificateChain,
} from './test-utils/stubs';
import { secretManagerMock } from './test-utils/mocks';
import { APP_PREFIX, AWS_SECRETS_MANAGER_CERTS_SECRET_NAME, AWS_SECRETS_MANAGER_SECRET_NAME } from '@app/config/consts';

const configOptionsValue = {
  providedClient: secretManagerMock,
  providedConfig: testConfig,
  providedSchema: testSchema,
  providedCerts: testCerts,
  secretName: 'secret-name',
  certsSecretName: 'certs-secret-name',
};

const moduleMetadata = {
  providers: [
    ConfigService,
    {
      provide: CONFIG_OPTIONS,
      useValue: configOptionsValue,
    },
  ],
};

describe('ConfigService', () => {
  let configService: ConfigService;

  const DEFAULT_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...DEFAULT_ENV };

    const module: TestingModule = await Test.createTestingModule(moduleMetadata).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = DEFAULT_ENV;
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
  });

  describe('#getConfig()', () => {
    it('should get remote config with provided secret name if env variable is empty', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[AWS_SECRETS_MANAGER_SECRET_NAME] = '';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ IS_REMOTE: true }));
    });

    it('should get remote config for test environment', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ IS_REMOTE: true }));
    });

    it('should get remote config for non test environment', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env.NODE_ENV = 'development';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ IS_REMOTE: true }));
    });

    it('should get local config', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'false';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ IS_REMOTE: false }));
    });

    it('should get local config for non test environment', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'false';
      process.env.NODE_ENV = 'development';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ IS_REMOTE: false }));
    });

    it('should get remote config with overwritten boolean value', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[`${APP_PREFIX}IS_REMOTE`] = 'false';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ IS_REMOTE: false }));
    });

    it('should get remote config with overwritten number value', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[`${APP_PREFIX}NUMBER`] = '1';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ NUMBER: 1 }));
    });

    it('should get remote config with overwritten string value', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[`${APP_PREFIX}STRING`] = 'new test';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ STRING: 'new test' }));
    });

    it('should get remote config with overwritten empty value', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[`${APP_PREFIX}EMPTY_VALUE`] = 'not empty';

      await expect(configService.getConfig()).resolves.toEqual(expect.objectContaining({ EMPTY_VALUE: 'not empty' }));
    });

    it('should get remote config with overwritten array value', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[`${APP_PREFIX}NESTED_VALUE__KEY__1__VALUE`] = 'nested value';

      await expect(configService.getConfig()).resolves.toEqual(
        expect.objectContaining({
          NESTED_VALUE: { KEY: [{ VALUE: 'nested value' }] },
        }),
      );
    });

    it('should throw validation error', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[`${APP_PREFIX}NUMBER`] = 'non number';

      await expect(configService.getConfig()).rejects.toThrow(Error);
    });

    it('should throw error in case of remote secret parsing', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[`${APP_PREFIX}NUMBER`] = 'non number';

      jest.spyOn(secretManagerMock, 'getSecretValue').mockImplementation(() => ({
        promise: () => Promise.resolve(notValidSecretString),
      }));

      await expect(configService.getConfig()).rejects.toThrow(Error);
    });
  });

  describe('#getKafkaCerts()', () => {
    it('should get remote certificates with provided secret name if env variable is empty', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env[AWS_SECRETS_MANAGER_CERTS_SECRET_NAME] = '';

      jest.spyOn(secretManagerMock, 'getSecretValue').mockImplementation(() => ({
        promise: () => Promise.resolve({ SecretString: testCerts }),
      }));
      const certs = await configService.getKafkaCerts();

      expect(certs).toMatchObject({
        privateKey: getTestPrivateKey(),
        certificate: getTestCertificate(),
        certificateChain: getTestCertificateChain(),
      });
      await expect(configService.getKafkaCerts()).resolves.toEqual(certs);

      expect(secretManagerMock.getSecretValue).toHaveBeenCalledWith({
        SecretId: 'certs-secret-name',
      });
    });

    it('should get remote certificates for test environment', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';

      jest.spyOn(secretManagerMock, 'getSecretValue').mockImplementation(() => ({
        promise: () => Promise.resolve({ SecretString: testCerts }),
      }));
      await expect(configService.getKafkaCerts()).resolves.toMatchObject({
        privateKey: getTestPrivateKey(),
        certificate: getTestCertificate(),
        certificateChain: getTestCertificateChain(),
      });

      expect(secretManagerMock.getSecretValue).toHaveBeenCalledWith({
        SecretId: 'certs-secret-name',
      });
    });

    it('should get remote certificates for non test environment', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';
      process.env.NODE_ENV = 'development';
      process.env[AWS_SECRETS_MANAGER_CERTS_SECRET_NAME] = 'dev-certs-secret-name';

      jest.spyOn(secretManagerMock, 'getSecretValue').mockImplementation(() => ({
        promise: () => Promise.resolve({ SecretString: testCerts }),
      }));
      await expect(configService.getKafkaCerts()).resolves.toMatchObject({
        privateKey: getTestPrivateKey(),
        certificate: getTestCertificate(),
        certificateChain: getTestCertificateChain(),
      });

      expect(secretManagerMock.getSecretValue).toHaveBeenCalledWith({
        SecretId: 'dev-certs-secret-name',
      });
    });

    it('should get local certificates', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'false';

      jest.spyOn(secretManagerMock, 'getSecretValue');
      await expect(configService.getKafkaCerts()).resolves.toMatchObject({
        privateKey: getTestPrivateKey(),
        certificate: getTestCertificate(),
        certificateChain: getTestCertificateChain(),
      });

      expect(secretManagerMock.getSecretValue).not.toHaveBeenCalled();
    });

    it('should get local certificates for non test environment', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'false';
      process.env.NODE_ENV = 'development';

      jest.spyOn(secretManagerMock, 'getSecretValue');
      await expect(configService.getKafkaCerts()).resolves.toMatchObject({
        privateKey: getTestPrivateKey(),
        certificate: getTestCertificate(),
        certificateChain: getTestCertificateChain(),
      });

      expect(secretManagerMock.getSecretValue).not.toHaveBeenCalled();
    });

    it('should throw error in case of remote secret parsing', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';

      jest.spyOn(secretManagerMock, 'getSecretValue').mockImplementation(() => ({
        promise: () => Promise.resolve({ SecretString: '' }),
      }));

      await expect(configService.getKafkaCerts()).rejects.toThrow(Error);
    });

    it('should throw error in case of aws secrets manager request failure', async () => {
      process.env.USE_AWS_SECRETS_MANAGER = 'true';

      jest.spyOn(secretManagerMock, 'getSecretValue').mockImplementation(() => ({
        promise: () => Promise.reject(Error('AWS is unreachable')),
      }));

      await expect(configService.getKafkaCerts()).rejects.toThrow(Error);
    });

    describe('when no client providedC', () => {
      beforeAll(async () => {
        configOptionsValue.providedClient = null;
      });

      it('should get local certificates for test environment', async () => {
        process.env.USE_AWS_SECRETS_MANAGER = 'false';

        jest.spyOn(secretManagerMock, 'getSecretValue');
        await expect(configService.getKafkaCerts()).resolves.toMatchObject({
          privateKey: getTestPrivateKey(),
          certificate: getTestCertificate(),
          certificateChain: getTestCertificateChain(),
        });

        expect(secretManagerMock.getSecretValue).not.toHaveBeenCalled();
      });
    });
  });
});
