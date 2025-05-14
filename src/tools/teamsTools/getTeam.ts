import { returnTypeT, TeamResponse, TeamsApi } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const GetTeamSchema = z.object({
  teamId: commonSchema.InputIdSchema.describe(
    'Required. The unique identifier (ID) of the team to retrieve. This can be obtained from the list teams tool.',
  ),
});

type GetTeamSchemaType = z.infer<typeof GetTeamSchema>;

export const getTeamToolDefinition: BoldSignTool = {
  method: ToolNames.GetTeam.toString(),
  name: 'Get team',
  description:
    'Retrieve detailed information about an existing team in your BoldSign organization. This API provides access to team-specific properties, such as team name, users, created date, and modified date, by specifying the unique team ID.',
  inputSchema: GetTeamSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await getTeamHandler(args as GetTeamSchemaType);
  },
};

async function getTeamHandler(payload: GetTeamSchemaType): Promise<McpResponse> {
  try {
    const teamsApi = new TeamsApi();
    teamsApi.basePath = configuration.getBasePath();
    teamsApi.setApiKey(configuration.getApiKey());
    const teamResponse: returnTypeT<TeamResponse> = await teamsApi.getTeam(payload.teamId);
    return handleMcpResponse({
      statusCode: teamResponse.response.status,
      data: teamResponse.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
