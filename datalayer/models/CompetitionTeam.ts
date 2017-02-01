import { IOC } from "smallstack";
import { GeneratedCompetitionTeam } from "../generated/models/GeneratedCompetitionTeam";

export class CompetitionTeam extends GeneratedCompetitionTeam {

	/**
	 * If you want to you can implement your own model methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("CompetitionTeam", CompetitionTeam);
