import { IOC } from "smallstack";
import { GeneratedSmallstackEmail } from "../generated/models/GeneratedSmallstackEmail";

export class SmallstackEmail extends GeneratedSmallstackEmail {

	/**
	 * If you want to you can implement your own model methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("SmallstackEmail", SmallstackEmail);
