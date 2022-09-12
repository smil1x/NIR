import SecretsManager = require('aws-sdk/clients/secretsmanager');
import { ApplicationType } from '@app/config/enums/application-type.enum';

export interface ConfigOptionsInterface {
  /**
   * Provided validation Schema.
   */
  providedSchema: Record<string, unknown>;

  /**
   * Provided AWS SecretsManager Client.
   */
  providedClient?: SecretsManager;

  /**
   * Provided AWS SecretsManager Client.
   */
  providedConfig?: any;

  /**
   * AWS SecretsManager secret name.
   */
  secretName?: string;

  /**
   * Application name.
   */
  appName: string;

  /**
   * Provided MSK certificates
   */
  providedCerts?: string;

  /**
   * AWS SecretsManager MSK Certs secret name
   */
  certsSecretName?: string;

  /**
   * Application type: service or lambda
   */
  applicationType?: ApplicationType;
}
