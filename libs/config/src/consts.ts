export const AWS_REGION = 'us-east-1'; // Default AWS Region.
export const APP_PREFIX = 'BP_'; // Short for Blueprints. APP_PREFIX can be any other string.
export const APP_VARIABLE_SEPARATOR = '__'; // Needed to handle nested properties.

export const AWS_SECRETS_MANAGER_SECRET_NAME = `${APP_PREFIX}_AWS_SECRETS_MANAGER_SECRET_NAME`;
export const AWS_SECRETS_MANAGER_CERTS_SECRET_NAME = `${APP_PREFIX}_AWS_SECRETS_MANAGER_CERTS_SECRET_NAME`;
