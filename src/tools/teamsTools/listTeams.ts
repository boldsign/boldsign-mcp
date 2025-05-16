import { TeamListResponse, TeamsApi } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const ListTeamsSchema = z.object({
  pageSize: commonSchema.OptionalPageSizeSchema.default(10).describe(
    'Optional. Specifies the maximum number of teams to retrieve per page. The value must be an integer between 1 and 100. By default, the BoldSign API retrieves 10 teams per page.',
  ),
  page: commonSchema.PageSchema.describe(
    'Required. The page number to retrieve from the list of teams, starting from 1. Used for pagination to navigate through the list of available teams.',
  ),
  searchKey: commonSchema.OptionalStringSchema.describe(
    'Optional. A search term to filter the list of teams. The API will return teams whose details, such as name, match the provided search term.',
  ),
});

type ListTeamsSchemaType = z.infer<typeof ListTeamsSchema>;

export const listTeamsToolDefinition: BoldSignTool = {
  method: ToolNames.ListTeams.toString(),
  name: 'List teams',
  description:
    'Retrieve a paginated list of teams within your BoldSign organization. This API fetches team details such as team name, users, created date, and modified date for all listed teams, with options for filtering using a search term and navigating through pages of results.',
  inputSchema: ListTeamsSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await listTeamsHandler(args as ListTeamsSchemaType);
  },
};

async function listTeamsHandler(payload: ListTeamsSchemaType): Promise<McpResponse> {
  try {
    const teamsApi = new TeamsApi();
    teamsApi.basePath = configuration.getBasePath();
    teamsApi.setApiKey(configuration.getApiKey());
    const teamListResponse: TeamListResponse = await teamsApi.listTeams(
      payload.page,
      payload.pageSize ?? undefined,
      payload.searchKey ?? undefined,
    );
    return handleMcpResponse({
      data: teamListResponse,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
