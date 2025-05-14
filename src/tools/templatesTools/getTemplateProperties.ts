import { returnTypeT, TemplateApi, TemplateProperties } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const GetTemplatePropertiesSchema = z.object({
  templateId: commonSchema.InputIdSchema.describe(
    'Required. The unique identifier (ID) of the template to retrieve. This can be obtained from the list templates tool.',
  ),
});

type GetTemplatePropertiesSchemaType = z.infer<typeof GetTemplatePropertiesSchema>;

export const getTemplatePropertiesToolDefinition: BoldSignTool = {
  method: ToolNames.GetTemplateProperties.toString(),
  name: 'Get template properties',
  description:
    'Retrieves the detailed properties and settings of a specific BoldSign template using its unique template ID.',
  inputSchema: GetTemplatePropertiesSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await getTemplatePropertiesHandler(args as GetTemplatePropertiesSchemaType);
  },
};

async function getTemplatePropertiesHandler(payload: GetTemplatePropertiesSchemaType): Promise<McpResponse> {
  try {
    const templateApi = new TemplateApi();
    templateApi.basePath = configuration.getBasePath();
    templateApi.setApiKey(configuration.getApiKey());
    const templateResponse: returnTypeT<TemplateProperties> = await templateApi.getProperties(
      payload.templateId,
    );
    return handleMcpResponse({
      statusCode: templateResponse.response.status,
      data: templateResponse.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
