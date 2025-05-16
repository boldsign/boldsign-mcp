import type { AxiosError } from 'axios';
import type { HttpError } from 'boldsign';
import { McpErrorResponse, McpOkResponse } from '../utils/types.js';

export function handleMcpResponse(content: McpOkResponse): McpOkResponse {
  return content;
}

export function handleMcpError(error: any): McpErrorResponse {
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
