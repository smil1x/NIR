import { Inject, Injectable, Optional } from '@nestjs/common';
import { SecretsManager } from 'aws-sdk';
import { first, last, isEmpty, set } from 'lodash';
import { CONFIG_OPTIONS } from '@app/common/consts';
import { CertsOptionsInterface } from '@app/common/interfaces/certs-options.interface';
import * as fileSystem from 'fs';
import * as path from 'path';
import { ConfigOptionsInterface } from './interfaces/config-options.interface';
import {
  AWS_REGION,
  APP_PREFIX,
  APP_VARIABLE_SEPARATOR,
  AWS_SECRETS_MANAGER_SECRET_NAME,
  AWS_SECRETS_MANAGER_CERTS_SECRET_NAME,
} from '@app/config/consts';

const Ajv = require('ajv'); // eslint-disable-line @typescript-eslint/no-var-requires

const getPattern = (type) =>
  `-----BEGIN ${type.toUpperCase()}-----\\r?\\n([A-Za-z0-9/+]{64}\\r?\\n)*[A-Za-z0-9/+]{1,64}={0,2}\\r?\\n-----END ${type.toUpperCase()}-----`;
const privateKeyRegex = new RegExp(getPattern('private key'), 'gi');
const certificateRegex = new RegExp(getPattern('certificate'), 'gi');

const getDefaultAwsClient = () =>
  new SecretsManager({
    region: AWS_REGION,
    httpOptions: {
      timeout: 30000,
    },
  });

@Injectable()
export class ConfigService {
  private config;

  private certs: CertsOptionsInterface;

  private readonly schema: Record<string, unknown>;

  private readonly ajv;

  private readonly awsClient: SecretsManager;

  private readonly secretName: string;

  private readonly appName: string;

  private readonly certsSecretName: string;

  constructor(
    @Optional()
    @Inject(CONFIG_OPTIONS)
    private configOptions: ConfigOptionsInterface,
  ) {
    this.ajv = new Ajv();
    this.awsClient = configOptions.providedClient || getDefaultAwsClient();
    this.schema = configOptions.providedSchema;
    this.secretName = configOptions.secretName;
    this.appName = configOptions.appName;
    this.certsSecretName = configOptions.certsSecretName;
  }

  public async getConfig<T>(): Promise<T> {
    if (this.config) {
      return this.config;
    }

    await this.getBaseConfig();
    this.mergeEnvVariables();

    const validate = this.ajv.compile(this.schema);

    if (!validate(this.config)) {
      throw new Error(JSON.stringify(validate.errors));
    } else {
      return this.config;
    }
  }

  public async getKafkaCerts(): Promise<CertsOptionsInterface> {
    if (!this.certs) {
      await this.getCertificates();
    }

    return this.certs;
  }

  private async getCertificates() {
    if (
      process.env.NODE_ENV === 'test' &&
      this.configOptions.providedCerts &&
      !this.configOptions.providedClient
    ) {
      this.certs = this.parseCertificates(this.configOptions.providedCerts);
    }

    process.env.USE_AWS_SECRETS_MANAGER === 'true'
      ? await this.getSecretsManagerCerts()
      : await this.getLocalCerts();
  }

  private parseCertificates(certsString) {
    const privateKey = first(certsString.match(privateKeyRegex)) as string;
    const certificate = first(certsString.match(certificateRegex)) as string;
    const certificateChain = last(
      certsString.match(certificateRegex),
    ) as string;

    if ([privateKey, certificateChain, certificate].some(isEmpty)) {
      throw Error('Invalid Kafka Certificates configuration');
    }

    return {
      privateKey,
      certificate,
      certificateChain,
    };
  }

  private async getBaseConfig(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      if (
        this.configOptions.providedConfig &&
        !this.configOptions.providedClient
      ) {
        this.config = this.configOptions.providedConfig;
      } else {
        process.env.USE_AWS_SECRETS_MANAGER === 'true'
          ? await this.getSecretsManagerConfig()
          : await this.getLocalConfig();
      }
    } else {
      process.env.USE_AWS_SECRETS_MANAGER === 'true'
        ? await this.getSecretsManagerConfig()
        : await this.getLocalConfig();
    }
  }

  private async getSecretsManagerCerts() {
    const SECRET_NAME =
      process.env[AWS_SECRETS_MANAGER_CERTS_SECRET_NAME] ||
      this.certsSecretName;
    this.certs = this.parseCertificates(await this.getSecretValue(SECRET_NAME));
  }

  private async getSecretsManagerConfig() {
    const SECRET_NAME =
      process.env[AWS_SECRETS_MANAGER_SECRET_NAME] || this.secretName;
    this.config = JSON.parse(await this.getSecretValue(SECRET_NAME));
  }

  private async getSecretValue(secretName): Promise<string> {
    try {
      const configData = await this.awsClient
        .getSecretValue({ SecretId: secretName })
        .promise();
      return configData.SecretString;
    } catch (e) {
      throw new Error(JSON.stringify(e));
    }
  }

  private async getLocalConfig(): Promise<void> {
    this.config =
      this.configOptions.providedConfig ||
      (await import(`../../../apps/${this.appName}/config.json`));
  }

  private async getLocalCerts(): Promise<void> {
    this.certs = this.parseCertificates(
      this.configOptions.providedCerts ||
        fileSystem.readFileSync(
          path.resolve(__dirname, `../../../apps/${this.appName}/certs.pem`),
          'utf-8',
        ),
    );
  }

  private mergeEnvVariables(): void {
    Object.keys(process.env)
      .filter(
        (variable: string) => variable !== AWS_SECRETS_MANAGER_SECRET_NAME,
      )
      .filter((variable: string) => variable.startsWith(APP_PREFIX))
      .forEach((appVar: string) => {
        const variableParts = appVar
          .slice(APP_PREFIX.length)
          .split(APP_VARIABLE_SEPARATOR);
        const propertyPath = this.getConfigPropertyPath(variableParts);
        set(
          this.config,
          propertyPath,
          ConfigService.convertToConfigValue(process.env[appVar]),
        );
      });
  }

  private getConfigPropertyPath(properties): string[] {
    return properties.reduce((acc, property) => {
      acc.push(
        ConfigService.isNumberValue(property) ? Number(property) - 1 : property,
      );
      return acc;
    }, []);
  }

  private static convertToConfigValue(value): string | number | boolean {
    if (ConfigService.isNumberValue(value)) {
      return Number(value);
    }
    if (ConfigService.isBooleanValue(value)) {
      return value === 'true';
    }
    return value;
  }

  private static isNumberValue(value): boolean {
    return !Number.isNaN(Number.parseInt(value, 10));
  }

  private static isBooleanValue(value): boolean {
    return ['true', 'false'].includes(value);
  }
}
