#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { definitions } from './tools/index.js';
import { MCP_SERVER_NAME, MCP_SERVER_VERSION } from './utils/constants.js';
import { BoldSignTool } from './utils/types.js';
import { toJsonString } from './utils/utils.js';

export const mcpServer = new McpServer(
  { name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION },
  { capabilities: { tools: {}, resources: {}, prompts: {}, completions: {}, logging: {} } },
);

definitions.forEach((toolDefinition: BoldSignTool) => {
  mcpServer.tool(
    toolDefinition.method,
    toolDefinition.description,
    toolDefinition.inputSchema.shape,
    async (input, _extra) => {
      const mcpResponse = await toolDefinition.handler(input);
      return {
        content: [{ type: 'text', text: `${toJsonString(mcpResponse)}` }],
      };
    },
  );
});

async function runServer() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

runServer().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
