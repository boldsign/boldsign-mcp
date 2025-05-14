import { BoldSignTool } from '../utils/types.js';
import { contactsApiToolsDefinitions } from './contactsTools/index.js';
import { documentsApiToolsDefinitions } from './documentsTools/index.js';
import { teamsApiToolsDefinitions } from './teamsTools/index.js';
import { templatesApiToolsDefinitions } from './templatesTools/index.js';
import { usersApiToolsDefinitions } from './usersTools/index.js';

export const definitions: BoldSignTool[] = [
  ...contactsApiToolsDefinitions,
  ...documentsApiToolsDefinitions,
  ...templatesApiToolsDefinitions,
  ...usersApiToolsDefinitions,
  ...teamsApiToolsDefinitions,
];
