import { ContactsApi, ContactsList } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const ListContactsSchema = z.object({
  pageSize: z.number().int().min(1).max(100),
  page: z.number().int().min(1).default(1),
  searchKey: commonSchema.OptionalStringSchema.describe(
    'Optional. A string used to filter the contact list. The API will return contacts whose details contain this search term.',
  ),
  contactType: z
    .enum(['MyContacts', 'AllContacts'])
    .optional()
    .nullable()
    .default('AllContacts')
    .describe(
      "Optional. Filters the list of contacts based on their type. 'MyContacts' retrieves contacts specifically associated with your account, while 'AllContacts' (default) retrieves all accessible contacts within your organization.",
    ),
});

type ListContactsSchemaType = z.infer<typeof ListContactsSchema>;

export const listContactsToolDefinition: BoldSignTool = {
  method: ToolNames.ListContacts.toString(),
  name: 'List contacts',
  description:
    'This tool allows you to retrieve a paginated list of contacts from your BoldSign organization. You can specify the page number to navigate through the results, the number of contacts to display per page, an optional search term to filter contacts, and the type of contacts to retrieve (your personal contacts or all organizational contacts). Contacts are primarily used to store signer details, identified by their unique email address, for use when creating and sending documents for signature within the BoldSign application.',
  inputSchema: ListContactsSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await listContactsHandler(args as ListContactsSchemaType);
  },
};

async function listContactsHandler(payload: ListContactsSchemaType): Promise<McpResponse> {
  try {
    const contactsApi = new ContactsApi();
    contactsApi.basePath = configuration.getBasePath();
    contactsApi.setApiKey(configuration.getApiKey());
    const contactsList: ContactsList = await contactsApi.contactUserList(
      payload.page,
      payload.pageSize ?? undefined,
      payload.searchKey ?? undefined,
      payload.contactType ?? undefined,
    );
    return handleMcpResponse({
      data: contactsList,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
