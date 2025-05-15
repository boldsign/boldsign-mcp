# BoldSign MCP Server Installation Guide

This guide is designed for AI agents and users to install and configure the BoldSign MCP server for use with popular MCP clients.

---

## Prerequisites

1. **Node.js** (version 18.0.0 or higher)
2. **A BoldSign Account**
   - [Sign up for a free trial](https://boldsign.com/electronic-signature-pricing/?plan=api) or use an existing account.
3. **BoldSign API Key**
   - [How to generate an API key](https://developers.boldsign.com/authentication/api-key)

---

## Installation Steps

### 1. Environment Variables

Before configuring your MCP client, ensure the following environment variables are set:

- `BOLDSIGN_API_KEY` — Your BoldSign API key. (You may ask the user to provide it in the chat or let them configure it on their own.)
- `BOLDSIGN_API_REGION` — The region for your BoldSign account (`US` or `EU`). Defaults to `US`. (You may ask if their account resides in a region other than `US` and switch based on that.)

---

### 2. Client Configuration

Below are the setup instructions for each supported MCP client. You may ask the user which client they want to use and proceed based on that answer.

#### **Cursor**

1. Add the following to your global Cursor MCP config (`~/.cursor/mcp.json`) or project `.cursor/mcp.json`:

   ```json
   {
     "mcpServers": {
       "boldsign": {
         "command": "npx",
         "args": ["-y", "@boldsign/mcp"],
         "env": {
           "BOLDSIGN_API_KEY": "{YOUR_BOLDSIGN_API_KEY}",
           "BOLDSIGN_API_REGION": "US"
         }
       }
     }
   }
   ```

2. Replace `{YOUR_BOLDSIGN_API_KEY}` with your actual API key.

3. [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol)

---

#### **Windsurf**

1. Add the following to your Windsurf MCP config:

   ```json
   {
     "mcpServers": {
       "boldsign": {
         "command": "npx",
         "args": ["-y", "@boldsign/mcp"],
         "env": {
           "BOLDSIGN_API_KEY": "{YOUR_BOLDSIGN_API_KEY}",
           "BOLDSIGN_API_REGION": "US"
         }
       }
     }
   }
   ```

2. Replace `{YOUR_BOLDSIGN_API_KEY}` with your actual API key.

3. [Windsurf MCP documentation](https://docs.windsurf.com/windsurf/mcp)

---

#### **VS Code**

1. Add the following to your VS Code MCP server settings:

   ```json
   {
     "servers": {
       "boldsign": {
         "type": "stdio",
         "command": "npx",
         "args": ["-y", "@boldsign/mcp"],
         "env": {
           "BOLDSIGN_API_KEY": "{YOUR_BOLDSIGN_API_KEY}",
           "BOLDSIGN_API_REGION": "US"
         }
       }
     }
   }
   ```

2. Replace `{YOUR_BOLDSIGN_API_KEY}` with your actual API key.

3. [VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

---

#### **Claude Desktop**

1. Add the following to your `claude_desktop_config.json`:

   ```json
   {
     "mcpServers": {
       "boldsign": {
         "command": "npx",
         "args": ["-y", "@boldsign/mcp"],
         "env": {
           "BOLDSIGN_API_KEY": "{YOUR_BOLDSIGN_API_KEY}",
           "BOLDSIGN_API_REGION": "US"
         }
       }
     }
   }
   ```

2. Replace `{YOUR_BOLDSIGN_API_KEY}` with your actual API key.

3. [Model Context Protocol quickstart guide](https://modelcontextprotocol.io/quickstart/user)

---

#### **Cline**

1. Add the following to your Cline MCP config:

   ```json
   {
     "mcpServers": {
       "boldsign": {
         "command": "npx",
         "args": ["-y", "@boldsign/mcp"],
         "env": {
           "BOLDSIGN_API_KEY": "{YOUR_BOLDSIGN_API_KEY}",
           "BOLDSIGN_API_REGION": "US"
         }
       }
     }
   }
   ```

2. Replace `{YOUR_BOLDSIGN_API_KEY}` with your actual API key.

3. [Cline MCP configuration guide](https://docs.cline.bot/mcp-servers/configuring-mcp-servers)

---

### 3. Verification / Testing

You may test the connection by calling a simple tool from the examples below:

- List the last 5 documents
- Get the admin of the HR team

---

## Troubleshooting

Common issues and solutions:

1. **Server fails to start:**

   - Ensure your API key is valid and correctly set.
   - Check that Node.js is version 18.0.0 or higher.
   - Ensure your account region is correctly set.

2. **Cannot access BoldSign resources:**
   - Verify network connectivity.
   - Check API key permissions and validity for any 401 errors.

---

## Environment Variables

- `BOLDSIGN_API_KEY`: Your BoldSign API key ([how to obtain](https://developers.boldsign.com/authentication/api-key))
- `BOLDSIGN_API_REGION`: The region for your BoldSign account (`US` or `EU`). Defaults to `US`.

---

## Additional Notes

- The BoldSign MCP server enables LLMs and agents to interact with the BoldSign API for document, template, contact, user, and team management.
- No additional configuration is needed for basic usage.
- For advanced usage, refer to the [BoldSign API documentation](https://developers.boldsign.com/).

---

## Support

If you encounter issues:

1. [BoldSign MCP GitHub Issues](https://github.com/boldsign/boldsign-mcp/issues)
2. [BoldSign Homepage](https://boldsign.com)
3. [Model Context Protocol quickstart guide](https://modelcontextprotocol.io/quickstart/user)
