export const testSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Test Configuration',
  description: 'DCS API Test Configuration',
  type: 'object',
  properties: {
    IS_REMOTE: {
      type: 'boolean',
    },
    NUMBER: {
      type: 'number',
    },
    STRING: {
      type: 'string',
    },
    EMPTY_VALUE: {
      type: 'string',
    },
    NESTED_VALUE: {
      type: 'object',
      properties: {
        KEY: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  },
  required: ['IS_REMOTE', 'NUMBER', 'STRING', 'EMPTY_VALUE'],
};
