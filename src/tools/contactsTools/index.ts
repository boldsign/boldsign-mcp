import { getContactToolDefinition } from '../../tools/contactsTools/getContact.js';
import { listContactsToolDefinition } from '../../tools/contactsTools/listContacts.js';
import { BoldSignTool } from '../../utils/types.js';

export const contactsApiToolsDefinitions: BoldSignTool[] = [
  getContactToolDefinition,
  listContactsToolDefinition,
];

export default {
  getContactToolDefinition,
  listContactsToolDefinition,
};
