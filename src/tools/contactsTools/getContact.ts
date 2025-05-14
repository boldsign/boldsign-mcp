import { ContactsApi, ContactsDetails, returnTypeT } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const GetContactSchema = z.object({
  id: commonSchema.InputIdSchema.describe(
    'Required. The unique identifier (ID) of the contact to retrieve. This can be obtained from the list contacts tool.',
  ),
});

type GetContactSchemaType = z.infer<typeof GetContactSchema>;

export const getContactToolDefinition: BoldSignTool = {
  method: ToolNames.GetContact.toString(),
  name: 'Get contact',
  description:
    'This tool utilizes the BoldSign API to retrieve detailed information for a specific contact within your organization. To use this tool, you need to provide the unique identifier (ID) of the contact you wish to retrieve. Contacts are primarily used to store signer details, identified by their unique email address, for use when creating and sending documents for signature within the BoldSign application.',
  inputSchema: GetContactSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await getContactHandler(args as GetContactSchemaType);
  },
};

async function getContactHandler(payload: GetContactSchemaType): Promise<McpResponse> {
  try {
    const contactsApi = new ContactsApi();
    contactsApi.basePath = configuration.getBasePath();
    contactsApi.setApiKey(configuration.getApiKey());
    const contact: returnTypeT<ContactsDetails> = await contactsApi.getContact(payload.id);
    return handleMcpResponse({
      statusCode: contact.response.status,
      data: contact.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
