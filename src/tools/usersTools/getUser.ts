import { returnTypeT, UserApi, UserProperties } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const GetUserSchema = z.object({
  userId: commonSchema.InputIdSchema.describe(
    'Required. The unique identifier (ID) of the user to retrieve. This can be obtained from the list users tool.',
  ),
});

type GetUserSchemaType = z.infer<typeof GetUserSchema>;

export const getUserToolDefinition: BoldSignTool = {
  method: ToolNames.GetUser.toString(),
  name: 'Get user',
  description: 'Retrieves detailed information for a specific BoldSign user based on their unique user ID.',
  inputSchema: GetUserSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await getUserHandler(args as GetUserSchemaType);
  },
};

async function getUserHandler(payload: GetUserSchemaType): Promise<McpResponse> {
  try {
    const userApi = new UserApi();
    userApi.basePath = configuration.getBasePath();
    userApi.setApiKey(configuration.getApiKey());
    const userResponse: returnTypeT<UserProperties> = await userApi.getUser(payload.userId);
    return handleMcpResponse({
      statusCode: userResponse.response.status,
      data: userResponse.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
