import { getDocumentPropertiesToolDefinition } from '../../tools/documentsTools/getDocumentProperties.js';
import { listDocumentsToolDefinition } from '../../tools/documentsTools/listDocuments.js';
import { listTeamDocumentsToolDefinition } from '../../tools/documentsTools/listTeamDocuments.js';
import { revokeDocumentToolDefinition } from '../../tools/documentsTools/revokeDocument.js';
import { sendReminderForDocumentToolDefinition } from './sendReminderForDocumentSign.js';
import { BoldSignTool } from '../../utils/types.js';

export const documentsApiToolsDefinitions: BoldSignTool[] = [
  getDocumentPropertiesToolDefinition,
  listDocumentsToolDefinition,
  listTeamDocumentsToolDefinition,
  sendReminderForDocumentToolDefinition,
  revokeDocumentToolDefinition,
];

export default {
  getDocumentPropertiesToolDefinition,
  listDocumentsToolDefinition,
  listTeamDocumentsToolDefinition,
  sendReminderForDocumentToolDefinition,
  revokeDocumentToolDefinition,
};
