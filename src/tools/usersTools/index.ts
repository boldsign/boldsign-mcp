import { getUserToolDefinition } from '../../tools/usersTools/getUser.js';
import { listUsersToolDefinition } from '../../tools/usersTools/listUsers.js';
import { BoldSignTool } from '../../utils/types.js';

export const usersApiToolsDefinitions: BoldSignTool[] = [getUserToolDefinition, listUsersToolDefinition];

export default {
  getUserToolDefinition,
  listUsersToolDefinition,
};
