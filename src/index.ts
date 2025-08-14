#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { definitions } from './tools/index.js';
import { BoldSignTool } from './utils/types.js';
import { toJsonString, zodToJsonSchema } from './utils/utils.js';

export const server = new Server(
  { name: 'boldsign-mcp', version: '0.0.5' },
  { capabilities: { tools: {}, resources: {}, completions: {}, logging: {} } },
);

server.onerror = (error) => console.error('[Error]', error);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: definitions.map((toolDefinition: BoldSignTool) => {
    return {
      name: toolDefinition.method,
      description: toolDefinition.description,
      inputSchema: zodToJsonSchema(toolDefinition.inputSchema),
    };
  }),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const tool = definitions.find((t) => t.method === toolName);

  if (!tool) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
  }

  const args = request.params.arguments;
  const schemaResult = tool.inputSchema.safeParse(args);

  if (!schemaResult.success) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid parameters for tool ${toolName}: ${schemaResult.error.message}`,
    );
  }

  try {
    const result = await tool.handler(args);
    return {
      content: [{ type: 'text', text: `${toJsonString(result)}` }],
    };
  } catch (error) {
    console.error('[Error] Failed to fetch data:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new McpError(ErrorCode.InternalError, `API error: ${errorMessage}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
