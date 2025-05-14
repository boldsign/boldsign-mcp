import { DocumentApi } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const ListTeamDocumentsSchema = z.object({
  pageSize: commonSchema.OptionalPageSizeSchema.default(10).describe(
    'Optional. The maximum number of team documents to display per page. Defaults to 10 but can be set between 1 and 100.',
  ),
  page: commonSchema.PageSchema.describe(
    'Required. The page number to retrieve, starting from 1. Used for pagination to navigate through the list of available team documents.',
  ),
  searchKey: commonSchema.OptionalStringSchema.describe(
    'Optional. A search term used to filter the document list. The API will return documents matching details like document title, document ID, sender name, or recipient name.',
  ),
  userId: z
    .array(commonSchema.InputIdSchema.describe('The unique identifier (ID) of a user in the team.'))
    .optional()
    .nullable()
    .describe(
      'Optional. Filter documents based on the list of team member IDs. One or more user IDs can be specified.',
    ),
  teamId: z
    .array(commonSchema.InputIdSchema.describe('The unique identifier (ID) of the team.'))
    .optional()
    .nullable()
    .describe('Optional. Filter documents based on specific teams. One or more team IDs can be specified.'),
  startDate: commonSchema.OptionalDateSchema.describe(
    'Optional. Start transmit date range of the document. The date should be in a valid date-time format.',
  ),
  endDate: commonSchema.OptionalDateSchema.describe(
    'Optional. End transmit date range of the document. The date should be in a valid date-time format.',
  ),
  labels: z
    .array(z.string().describe('Label of the document.'))
    .optional()
    .nullable()
    .describe(
      'Optional. Labels associated with documents. Used to filter the list by specific document tags.',
    ),
  transmitType: z
    .enum(['Sent', 'Received', 'Both'])
    .optional()
    .nullable()
    .default('Both')
    .describe("Optional. Type of transmission. Can be 'Sent', 'Received', or 'Both'."),
  status: z
    .array(
      z
        .enum([
          'None',
          'WaitingForMe',
          'WaitingForOthers',
          'NeedAttention',
          'Completed',
          'Declined',
          'Revoked',
          'Expired',
          'Scheduled',
          'Draft',
        ])
        .default('None'),
    )
    .optional()
    .nullable()
    .describe(
      "Optional. Filter documents based on their current status. Available statuses include 'WaitingForMe', 'WaitingForOthers', 'NeedAttention', 'Completed', 'Declined', 'Revoked', 'Expired', 'Scheduled', and 'Draft'. Use 'None' to disable status filtering.",
    ),
  nextCursor: commonSchema.OptionalIntegerSchema.describe(
    'Optional. Cursor value for pagination beyond 10,000 records. Set to the cursor of the last retrieved document.',
  ),
  brandIds: z
    .array(commonSchema.InputIdSchema.describe('Unique identifier (ID) of the brand.'))
    .optional()
    .nullable()
    .describe(
      'Optional. Filters documents based on associated brand IDs. Only documents linked to the specified brands will be retrieved.',
    ),
  dateFilterType: z
    .enum(['SentBetween', 'Expiring'])
    .optional()
    .nullable()
    .describe(
      "Optional. Type of date filter applied to documents. Available options: 'SentBetween' and 'Expiring'.",
    ),
});

type ListTeamDocumentsSchemaType = z.infer<typeof ListTeamDocumentsSchema>;

export const listTeamDocumentsToolDefinition: BoldSignTool = {
  method: ToolNames.ListTeamDocuments.toString(),
  name: 'List team documents',
  description:
    'Retrieve a paginated list of documents available in the Team Documents section of your BoldSign organization. Team admins can view documents sent and received by team members, while account admins have access to all team documents across the organization. This API allows filtering based on status, user ID, team ID, document details, transmission type, and date range. If the user is not an account admin or team admin, an unauthorized response will be returned.',
  inputSchema: ListTeamDocumentsSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await listTeamDocumentsHandler(args as ListTeamDocumentsSchemaType);
  },
};

async function listTeamDocumentsHandler(payload: ListTeamDocumentsSchemaType): Promise<McpResponse> {
  try {
    const documentApi = new DocumentApi();
    documentApi.basePath = configuration.getBasePath();
    documentApi.setApiKey(configuration.getApiKey());
    const teamListDocumentsResponse = await documentApi.teamDocuments(
      payload.page,
      payload.userId ?? undefined,
      payload.teamId ?? undefined,
      (payload.transmitType as any) ?? undefined,
      payload.dateFilterType ?? undefined,
      payload.pageSize ?? undefined,
      payload.startDate ?? undefined,
      payload.status ?? undefined,
      payload.endDate ?? undefined,
      payload.searchKey ?? undefined,
      payload.labels ?? undefined,
      payload.nextCursor ?? undefined,
      payload.brandIds ?? undefined,
    );
    return handleMcpResponse({
      statusCode: teamListDocumentsResponse.response.status,
      data: teamListDocumentsResponse.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
