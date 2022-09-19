export const getSchema = () => ({
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Configuration',
  description: 'APP Configuration',
  type: 'object',
  properties: {
    APP_PORT: {
      description: 'The port on which the application is running',
      type: 'number',
    },
    MARINETRAFFIC_CONFIG: {
      description: 'MARINETRAFFIC_CONFIG',
      type: 'object',
      properties: {
        SINGLE_VESSEL_POSITIONS_KEY: {
          description: 'SINGLE_VESSEL_POSITIONS_KEY',
          type: 'string',
        },
        SINGLE_VESSEL_HISTORICAL_POSITIONS_KEY: {
          description: 'SINGLE_VESSEL_HISTORICAL_POSITIONS_KEY',
          type: 'string',
        },
      },
      required: [
        'SINGLE_VESSEL_POSITIONS_KEY',
        'SINGLE_VESSEL_HISTORICAL_POSITIONS_KEY',
      ],
    },
  },
  required: ['MARINETRAFFIC_CONFIG'],
});
