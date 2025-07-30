import { TemplateApi, TemplateRecords } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';
import { setAsTemplate } from './transforms.js';

const ListTemplatesSchema = z.object({
  pageSize: z.number().int().min(1).max(100),
  page: z.number().int().min(1).default(1),
  searchKey: commonSchema.OptionalStringSchema.describe(
    'Optional. A search key to filter templates by properties such as name and email address. Provides a way to refine results based on specific criteria.',
  ),
  templateType: z
    .enum(['all', 'mytemplates', 'sharedtemplate'])
    .optional()
    .nullable()
    .default('all')
    .describe(
      "Optional. Filters templates based on their type (all, mytemplates, sharedtemplate). Defaults to 'all'.",
    ),
  createdBy: z
    .array(commonSchema.EmailSchema.describe('Email address of the template creator.'))
    .optional()
    .nullable()
    .describe('Optional. Filters templates based on the email address(es) of their creators.'),
  templateLabels: z
    .array(z.string().describe('Label of the template.'))
    .optional()
    .nullable()
    .describe('Optional. Filters templates based on associated labels (tags).'),
  startDate: commonSchema.OptionalDateSchema.describe(
    'Optional. Filters templates created on or after this date (in YYYY-MM-DD format).',
  ),
  endDate: commonSchema.OptionalDateSchema.describe(
    'Optional. Filters templates created on or before this date (in YYYY-MM-DD format).',
  ),
  brandIds: z
    .array(
      commonSchema.InputIdSchema.describe(
        'The unique identifier (ID) of the brand to be used for depicting a brand.',
      ),
    )
    .optional()
    .nullable()
    .describe('Optional. Filters templates associated with the specified brand IDs.'),
});

type ListTemplatesSchemaType = z.infer<typeof ListTemplatesSchema>;

export const listTemplatesToolDefinition: BoldSignTool = {
  method: ToolNames.ListTemplates.toString(),
  name: 'List templates',
  description:
    'Retrieves a paginated list of BoldSign templates with options to filter by page number, page size, search key, template type, creator, labels, creation date range, and brand IDs.',
  inputSchema: ListTemplatesSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await listTemplatesHandler(args as ListTemplatesSchemaType);
  },
};

async function listTemplatesHandler(payload: ListTemplatesSchemaType): Promise<McpResponse> {
  try {
    const templateApi = new TemplateApi();
    templateApi.basePath = configuration.getBasePath();
    templateApi.setApiKey(configuration.getApiKey());
    const templateRecords: TemplateRecords = await templateApi.listTemplates(
      payload.page,
      payload.templateType ?? undefined,
      payload.pageSize ?? undefined,
      payload.searchKey ?? undefined,
      undefined,
      payload.createdBy ?? undefined,
      payload.templateLabels ?? undefined,
      payload.startDate ?? undefined,
      payload.endDate ?? undefined,
      payload.brandIds ?? undefined,
    );
    setAsTemplate(templateRecords.result);
    return handleMcpResponse({
      data: templateRecords,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
