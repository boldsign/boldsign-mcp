import { DocumentApi } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const GetDocumentPropertiesSchema = z.object({
  documentId: commonSchema.InputIdSchema.describe(
    'Required. The unique identifier (ID) of the document to retrieve. This can be obtained from the list documents tool.',
  ),
});

type GetDocumentPropertiesSchemaType = z.infer<typeof GetDocumentPropertiesSchema>;

export const getDocumentPropertiesToolDefinition: BoldSignTool = {
  method: ToolNames.GetDocumentProperties.toString(),
  name: 'Get document properties',
  description:
    'Retrieve comprehensive details of a document in your BoldSign organization. This API allows authorized users, including senders, signers, team admins, and account admins, to access document properties by specifying the unique document ID. The response includes information such as status, metadata, sender and signer details, form fields, and document history. If an unauthorized user attempts to access the document, an unauthorized response will be returned.',
  inputSchema: GetDocumentPropertiesSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await getDocumentPropertiesHandler(args as GetDocumentPropertiesSchemaType);
  },
};

async function getDocumentPropertiesHandler(payload: GetDocumentPropertiesSchemaType): Promise<McpResponse> {
  try {
    const documentApi = new DocumentApi();
    documentApi.basePath = configuration.getBasePath();
    documentApi.setApiKey(configuration.getApiKey());
    const documentResponse = await documentApi.getProperties(payload.documentId);
    return handleMcpResponse({
      statusCode: documentResponse.response.status,
      data: documentResponse.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
