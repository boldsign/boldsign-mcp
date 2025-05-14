import { getTeamToolDefinition } from '../../tools/teamsTools/getTeam.js';
import { listTeamsToolDefinition } from '../../tools/teamsTools/listTeams.js';
import { BoldSignTool } from '../../utils/types.js';

export const teamsApiToolsDefinitions: BoldSignTool[] = [getTeamToolDefinition, listTeamsToolDefinition];

export default {
  getTeamToolDefinition,
  listTeamsToolDefinition,
};
