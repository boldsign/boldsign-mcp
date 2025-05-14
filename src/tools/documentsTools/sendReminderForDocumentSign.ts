import { DocumentApi, ReminderMessage, returnTypeI } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const SendReminderForDocumentSignSchema = z.object({
  documentId: commonSchema.InputIdSchema.describe(
    'Required. The unique identifier (ID) of the document to send a reminder email to signers for pending signatures.',
  ),
  receiverEmails: z
    .array(commonSchema.EmailSchema.describe('Email address of the signer.'))
    .optional()
    .nullable()
    .describe(
      'Optional. One or more signer email addresses to send reminders for pending signatures. If multiple signers are required to sign the document, specify their email addresses. If there is not emails provided, it will send reminder to all pending signers.',
    ),
  message: z
    .array(z.string().describe('Custom message content for the reminder email.'))
    .optional()
    .nullable()
    .describe(
      'Optional. Message to be sent in the reminder email. If not provided, the system will use a default reminder message.',
    ),
  onBehalfOf: z
    .array(commonSchema.EmailSchema.describe('Email address of the sender.'))
    .optional()
    .nullable()
    .describe(
      'Optional. Email address of the sender when creating a document on their behalf. This email can be retrieved from the `behalfOf` property in the get document or list documents tool.',
    ),
});

type SendReminderForDocumentSignSchemaType = z.infer<typeof SendReminderForDocumentSignSchema>;

export const sendReminderForDocumentToolDefinition: BoldSignTool = {
  method: ToolNames.SendReminderForDocumentSign.toString(),
  name: 'Send reminder for document sign',
  description:
    'Send reminder emails to signers for pending document signatures. This API allows users to remind signers about outstanding signature requests by specifying the document ID and recipient email addresses. Multiple signers can receive reminders at once, and custom messages can be included. If sending reminders on behalf of another sender, specify the relevant sender email addresses.',
  inputSchema: SendReminderForDocumentSignSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await sendReminderForDocumentSignHandler(args as SendReminderForDocumentSignSchemaType);
  },
};

async function sendReminderForDocumentSignHandler(
  payload: SendReminderForDocumentSignSchemaType,
): Promise<McpResponse> {
  try {
    const documentApi = new DocumentApi();
    documentApi.basePath = configuration.getBasePath();
    documentApi.setApiKey(configuration.getApiKey());
    const reminderMessage: ReminderMessage = new ReminderMessage();
    reminderMessage.message = payload.message ? payload.message[0] : undefined;
    reminderMessage.onBehalfOf = payload.onBehalfOf ? payload.onBehalfOf[0] : undefined;
    const documentResponse: returnTypeI = await documentApi.remindDocument(
      payload.documentId,
      payload.receiverEmails ?? undefined,
      reminderMessage,
    );
    return handleMcpResponse({
      statusCode: documentResponse.response.status,
      data: documentResponse.response.data,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}
