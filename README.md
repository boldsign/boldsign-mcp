# BoldSign MCP Server

**Author:** Syncfusion

**Homepage:** [https://boldsign.com](https://boldsign.com)

An MCP server designed to facilitate interaction between Large Language Models (LLMs) and the BoldSign API. The Model Context Protocol (MCP) extends LLM capabilities, enabling them to act as agents when connecting with external systems.

This project contains various tools that interact with the BoldSign API to manage templates and documents.

## Prerequisites

Before you begin, ensure you have the following installed and set up:

1.  **A BoldSign Account:** You will need an account to obtain API credentials. You can [sign up for a free trial here](https://boldsign.com/electronic-signature-pricing/?plan=api) or use an existing sandbox or paid account.
2.  **BoldSign API Credentials:** Obtain your necessary application credentials, specifically an API key. Instructions on how to generate and manage your API key can be found in the [BoldSign API documentation](https://developers.boldsign.com/authentication/api-key).
3.  **Node.js:** Version 18.0.0 or higher is required.
4.  **An MCP Client:** To interact with the server, you need an MCP client application. Examples include Cursor, VS Code, Windsurf, Claude Desktop, Cline, or any other compatible MCP client.

## Installation

This section provides instructions on how to configure popular MCP clients to connect to the BoldSign MCP server. You will need to add the relevant configuration snippet to your client's settings or configuration file.

### Command Line Usage

If you install this package globally (e.g., with `npm install -g @boldsign/mcp`), you can invoke the CLI directly using:

```
boldsign-mcp
```

Alternatively, you can use `npx -y @boldsign/mcp` without a global install.

### Environment Variables

You will need to configure the following environment variables for the BoldSign MCP server to function correctly:

- `BOLDSIGN_API_KEY` - Your API key obtained from your BoldSign account. Please refer to the [Prerequisites](#prerequisites) section for instructions on how to get your API key.

- `BOLDSIGN_API_REGION` - Specifies the region of your BoldSign account. This defaults to `US` if not specified.

  - `US` for the United States region.

  - `EU` for the Europe region.

### Install in Cursor

The recommended approach is to add the following configuration to your global Cursor MCP configuration file, typically found at `~/.cursor/mcp.json`.

Alternatively, you can install it for a specific project by creating a `.cursor/mcp.json` file in your project's root folder and adding the same configuration there.

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

Refer to the [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol) for more information on setting up MCP servers in Cursor.

### Install in Windsurf

Add the following configuration snippet to your Windsurf MCP configuration file:

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

Refer to the [Windsurf MCP documentation](https://docs.windsurf.com/windsurf/mcp) for more information on Windsurf MCP setup.

### Install in VS Code

Add the following configuration to the VS Code settings file where you manage MCP server configurations:

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

Refer to the [VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more information on VS Code MCP setup.

### Install in Claude Desktop

Add the following configuration to your Claude Desktop configuration file, which is typically named `claude_desktop_config.json`:

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

Refer to the [Model Context Protocol quickstart guide](https://modelcontextprotocol.io/quickstart/user) for more information on Claude Desktop MCP setup.

### Install in Cline

Add the following configuration snippet to your Cline MCP configuration file.

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

Refer to the [Cline MCP configuration guide](https://docs.cline.bot/mcp-servers/configuring-mcp-servers) for more information on Cline MCP setup.

## Available Tools

This MCP server provides access to the following tools via the BoldSign API:

### Documents

- [List documents](https://developers.boldsign.com/documents/list-documents): Retrieves a paginated list of your documents.

- [List team documents](https://developers.boldsign.com/documents/list-team-documents): Retrieves a paginated list of team documents.

- [Get document](https://developers.boldsign.com/documents/document-details-and-status): Retrieves detailed information, including status, for a specific document using its ID.

- [Revoke document](https://developers.boldsign.com/documents/revoke-document): Allows you to cancel or call off a document that is in progress.

- [Send reminders](https://developers.boldsign.com/documents/send-reminder): Sends reminders to signers who have not yet completed their signature on a document.

### Templates

- [List templates](https://developers.boldsign.com/template/list-templates): Retrieves a paginated list of templates available in your BoldSign account.

- [Get template](https://developers.boldsign.com/template/template-details): Retrieves detailed information for a specific template using its ID.

- [Send document from template](https://developers.boldsign.com/documents/send-document-from-template): Creates and sends out a document for signing based on a pre-configured template.

### Contacts

- [List Contacts](https://developers.boldsign.com/contacts/list-contacts): Retrieves a paginated list of contacts from your BoldSign account.

- [Get Contact](https://developers.boldsign.com/contacts/get-contact-details): Retrieves detailed information for a specific contact using their ID.

### Users

- [List Users](https://developers.boldsign.com/users/list-users): Retrieves a paginated list of users in your BoldSign organization.

- [Get User](https://developers.boldsign.com/users/get-user-details): Retrieves detailed information for a specific user using their ID.

### Teams

- [List Teams](https://developers.boldsign.com/teams/list-teams): Retrieves a paginated list of teams in your BoldSign organization.

- [Get Team](https://developers.boldsign.com/teams/get-team-details): Retrieves detailed information for a specific team using their ID.

## Repository

[https://github.com/boldsign/boldsign-mcp](https://github.com/boldsign/boldsign-mcp)

## Bug Tracker

[https://github.com/boldsign/boldsign-mcp/issues](https://github.com/boldsign/boldsign-mcp/issues)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
