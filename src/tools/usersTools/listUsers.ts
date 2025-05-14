import { returnTypeT, UserApi, UserRecords } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const ListUsersSchema = z.object({
  pageSize: commonSchema.OptionalPageSizeSchema.default(10).describe(
    'Optional. Specifies the maximum number of user records to be retrieved per page. If not provided, a default page size will be used by the BoldSign API. The value must be between 1 and 100. The default value is 10.',
  ),
  page: commonSchema.PageSchema.describe(
    'Required. The page number of the user list to retrieve. Used for pagination to navigate through the list of available users.',
  ),
  search: commonSchema.OptionalStringSchema.describe(
    'Optional. A string used to filter the user list. The API will return contacts whose details contain this search term.',
  ),
});

type ListUsersSchemaType = z.infer<typeof ListUsersSchema>;

export const listUsersToolDefinition: BoldSignTool = {
  method: ToolNames.ListUsers.toString(),
  name: 'List users',
  description: 'Retrieves a paginated list of BoldSign users, with optional filtering by a search term.',
  inputSchema: ListUsersSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await listUsersHandler(args as ListUsersSchemaType);
  },
};

async function listUsersHandler(payload: ListUsersSchemaType): Promise<McpResponse> {
  try {
    const userApi = new UserApi();
    userApi.basePath = configuration.getBasePath();
    userApi.setApiKey(configuration.getApiKey());
    const usersResponse: returnTypeT<UserRecords> = await userApi.listUsers(
      payload.page,
      payload.pageSize ?? undefined,
      payload.search ?? undefined,
    );
    return handleMcpResponse({
      statusCode: usersResponse.response.status,
      data: usersResponse.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
