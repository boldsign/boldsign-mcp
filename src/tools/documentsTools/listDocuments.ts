import { DocumentApi, DocumentRecords } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const ListDocumentsSchema = z.object({
  pageSize: commonSchema.OptionalPageSizeSchema.default(10).describe(
    'Optional. The maximum number of documents to display per page. Defaults to 10 but can be set between 1 and 100.',
  ),
  page: commonSchema.PageSchema.describe(
    'Required. The page number to retrieve, starting from 1. Used for pagination to navigate through the list of available documents.',
  ),
  searchKey: commonSchema.OptionalStringSchema.describe(
    'Optional. A search term used to filter the document list. The API will return documents matching details like document title, document ID, sender name, or recipient name.',
  ),
  sentBy: z
    .array(commonSchema.EmailSchema.describe('Email address of the sender.'))
    .optional()
    .nullable()
    .describe(
      'Optional. Filter documents by sender email addresses. One or more sender email IDs can be specified.',
    ),
  recipients: z
    .array(commonSchema.EmailSchema.describe('Email address of the signer.'))
    .optional()
    .nullable()
    .describe(
      'Optional. Filter documents by signer email addresses. One or more signer email IDs can be specified.',
    ),
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

type ListDocumentsSchemaType = z.infer<typeof ListDocumentsSchema>;

export const listDocumentsToolDefinition: BoldSignTool = {
  method: ToolNames.ListDocuments.toString(),
  name: 'List documents',
  description:
    'Retrieve a paginated list of documents available in your My Documents section. This API fetches document details such as status, sender, recipient, labels, transmission type, creation date, and modification date, with options for filtering and paginated navigation.',
  inputSchema: ListDocumentsSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await listDocumentsHandler(args as ListDocumentsSchemaType);
  },
};

async function listDocumentsHandler(payload: ListDocumentsSchemaType): Promise<McpResponse> {
  try {
    const documentApi = new DocumentApi();
    documentApi.basePath = configuration.getBasePath();
    documentApi.setApiKey(configuration.getApiKey());
    const documentRecords: DocumentRecords = await documentApi.listDocuments(
      payload.page,
      payload.sentBy ?? undefined,
      payload.recipients ?? undefined,
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
      data: documentRecords,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
