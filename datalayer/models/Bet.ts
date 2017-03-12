import { IOC } from "@smallstack/core-common";
import { GeneratedBet } from "../generated/models/GeneratedBet";

export class Bet extends GeneratedBet {

	/**
	 * If you want to you can implement your own model methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("Bet", Bet);
