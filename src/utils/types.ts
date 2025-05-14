import { AnyZodObject } from 'zod';

export type Region = 'US' | 'EU';

export interface BoldSignTool {
  method: string;
  name: string;
  description: string;
  inputSchema: AnyZodObject;
  handler(args: unknown): Promise<McpResponse>;
}

export interface McpOkResponse {
  readonly statusCode: number | null;
  readonly data: any;
}

export interface McpErrorResponse {
  readonly statusCode: number | null;
  readonly errorMessage: string;
  readonly error: any;
}

export interface ToolUnsupportedResponse {
  readonly errorMessage: 'Tool unsupported';
}

export type McpResponse = McpOkResponse | McpErrorResponse | ToolUnsupportedResponse;

export type NullOrUndefined = null | undefined;
