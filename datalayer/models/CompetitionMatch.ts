import { IOC } from "smallstack";
import { GeneratedCompetitionMatch } from "../generated/models/GeneratedCompetitionMatch";

export class CompetitionMatch extends GeneratedCompetitionMatch {

	/**
	 * If you want to you can implement your own model methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("CompetitionMatch", CompetitionMatch);
