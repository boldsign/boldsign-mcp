import { getTemplatePropertiesToolDefinition } from '../../tools/templatesTools/getTemplateProperties.js';
import { listTemplatesToolDefinition } from '../../tools/templatesTools/listTemplates.js';
import { BoldSignTool } from '../../utils/types.js';
import { sendDocumentFromTemplateDynamicToolDefinition } from './sendDocumentFromTemplate.js';

export const templatesApiToolsDefinitions: BoldSignTool[] = [
  sendDocumentFromTemplateDynamicToolDefinition,
  listTemplatesToolDefinition,
  getTemplatePropertiesToolDefinition,
];

export default {
  sendDocumentFromTemplateDynamicToolDefinition,
  listTemplatesToolDefinition,
  getTemplatePropertiesToolDefinition,
};
