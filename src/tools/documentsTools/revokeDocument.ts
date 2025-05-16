import { DocumentApi, returnTypeI, RevokeDocument } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const RevokeDocumentSchema = z.object({
  documentId: commonSchema.InputIdSchema.describe(
    'Required. The unique identifier (ID) of the document to revoke. This can be obtained from the list documents tool.',
  ),
  message: z.string().describe('The exact reason for performing a revoke action.'),
  onBehalfOf: z
    .string()
    .email()
    .describe('Email address of on-behalf sender.')
    .describe(
      'Optional. Email address of the sender when creating a document on their behalf. This email can be retrieved from the `behalfOf` property in the get document or list documents tool.',
    ),
});

type RevokeDocumentSchemaType = z.infer<typeof RevokeDocumentSchema>;

export const revokeDocumentToolDefinition: BoldSignTool = {
  method: ToolNames.RevokeDocument.toString(),
  name: 'Revoke document',
  description:
    'The document signing process can be called off or revoked by the sender of the document. Once you revoke a document, signers can no longer view or sign it. Revoke action can only be performed on the in-progress status documents.',
  inputSchema: RevokeDocumentSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await revokeDocumentHandler(args as RevokeDocumentSchemaType);
  },
};

async function revokeDocumentHandler(payload: RevokeDocumentSchemaType): Promise<McpResponse> {
  try {
    const documentApi = new DocumentApi();
    documentApi.basePath = configuration.getBasePath();
    documentApi.setApiKey(configuration.getApiKey());
    const revokeDocumentRequest: RevokeDocument = new RevokeDocument();
    revokeDocumentRequest.message = payload.message;
    revokeDocumentRequest.onBehalfOf = payload.onBehalfOf;
    const documentResponse: returnTypeI = await documentApi.revokeDocument(
      payload.documentId,
      revokeDocumentRequest,
    );
    return handleMcpResponse({
      data: documentResponse.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
