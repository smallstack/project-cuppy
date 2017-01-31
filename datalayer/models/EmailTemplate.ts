import { IOC } from "smallstack";
import { GeneratedEmailTemplate } from "../generated/models/GeneratedEmailTemplate";

export class EmailTemplate extends GeneratedEmailTemplate {

	/**
	 * If you want to you can implement your own model methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("EmailTemplate", EmailTemplate);
