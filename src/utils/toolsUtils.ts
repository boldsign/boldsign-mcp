import type { AxiosError } from 'axios';
import type { HttpError } from 'boldsign';
import { McpErrorResponse, McpOkResponse } from '../utils/types.js';
import { logError, logResponse, toJsonString } from '../utils/utils.js';
import Configuration from './configuration.js';

export function handleMcpResponse(content: McpOkResponse): McpOkResponse {
  if (Configuration.getInstance()?.isLoggingEnabled() === true) {
    logResponse(toJsonString(content));
  }

  return content;
}

export function handleMcpError(error: any): McpErrorResponse {
  // Perform tasks with the error response.
  logError(error);
  const axiosError = error as AxiosError | HttpError;
  if (axiosError && axiosError.response) {
    return {
      statusCode: axiosError.response?.status,
      errorMessage: axiosError.message,
      error: axiosError.response.data,
    };
  } else {
    return {
      statusCode: null,
      errorMessage: error?.message,
      error: error,
    };
  }
}
