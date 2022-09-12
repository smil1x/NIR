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
  },
  required: [],
});
