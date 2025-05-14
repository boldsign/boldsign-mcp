import Configuration from './configuration.js';

// MCP SERVER DETAILS.
export const MCP_SERVER_NAME: string = 'boldsign-mcp';
export const MCP_SERVER_VERSION: string = '0.0.1';

// BoldSign constants.
export const configuration: Configuration = Configuration.getInstance();

// Constants.
export const INVALID_TOOL_NAME: string = 'Invalid tool name';

// Exceptions.

export const INVALID_API_KEY: string = 'Must be a valid BoldSign API Key.';
export const INVALID_ACCESS_TOKEN_KEY: string = 'Must be a valid BoldSign Access Token.';
export const INVALID_AUTH: string = 'Must be a valid BoldSign Authentication object.';
